import { Request, Response } from "express";
import * as bookingService from "../services/bookingService";
import { BookingStatus } from "../models/booking.model";

const PAYMENT_METHODS = ["online", "cash_at_hotel", "card_at_hotel", "eft"];
const STATUSES = ["awaiting_payment", "confirmed", "completed", "cancelled"];

const generateReference = () =>
    "BS" + Math.random().toString(36).substring(2, 8).toUpperCase();

const todayString = () => new Date().toISOString().slice(0, 10);

// ---------- GUEST ----------

export const addBooking = async (req: Request, res: Response) => {
    try {
        const {
            room_type_id, check_in_date, check_out_date,
            number_of_rooms, number_of_adults, number_of_children,
            guest_first_name, guest_last_name, guest_email, guest_phone,
            arrival_time, special_requests, payment_method
        } = req.body;

        if (!room_type_id || !check_in_date || !check_out_date) {
            return res.status(400).json({ message: "Room, check-in date and check-out date are required" });
        }

        const rooms = number_of_rooms ?? 1;
        const adults = number_of_adults ?? 1;
        const children = number_of_children ?? 0;

        if (rooms < 1 || adults < 1 || children < 0) {
            return res.status(400).json({ message: "At least 1 room and 1 adult are required" });
        }

        const method = payment_method ?? "online";
        if (!PAYMENT_METHODS.includes(method)) {
            return res.status(400).json({ message: "Invalid payment method" });
        }

        // Dates
        const checkIn = new Date(check_in_date);
        const checkOut = new Date(check_out_date);
        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            return res.status(400).json({ message: "Dates must be in the format YYYY-MM-DD" });
        }
        if (check_in_date < todayString()) {
            return res.status(400).json({ message: "Check-in date can't be in the past" });
        }
        const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        if (nights < 1) {
            return res.status(400).json({ message: "Check-out must be at least 1 night after check-in" });
        }

        // Room
        const room = await bookingService.findRoomForBooking(room_type_id);
        if (!room || !room.is_visible) {
            return res.status(404).json({ message: "Room not found" });
        }

        if (adults + children > room.capacity * rooms) {
            return res.status(400).json({
                message: `Too many guests. This room fits ${room.capacity} guests per room`
            });
        }

        // Availability
        const booked = await bookingService.countBookedRooms(room.id, check_in_date, check_out_date);
        const available = room.total_rooms - booked;
        if (rooms > available) {
            return res.status(409).json({
                message: available <= 0
                    ? "No rooms left for these dates"
                    : `Only ${available} room(s) left for these dates`
            });
        }

        // Price 
        const total = Number(room.price_per_night) * nights * rooms;

        const user = req.user!;
        const booking = await bookingService.createBooking({
            booking_reference: generateReference(),
            user_id: user.id,
            room_type_id: room.id,
            guest_first_name: guest_first_name || user.first_name,
            guest_last_name: guest_last_name || user.last_name,
            guest_email: guest_email || user.email,
            guest_phone: guest_phone || user.phone_number || null,
            check_in_date,
            check_out_date,
            number_of_rooms: rooms,
            number_of_adults: adults,
            number_of_children: children,
            arrival_time: arrival_time || null,
            special_requests: special_requests || null,
            price_per_night: room.price_per_night,
            total_amount: total.toFixed(2),
            payment_method: method,
            status: method === "online" ? "awaiting_payment" : "confirmed"
        });

        res.status(201).json({ message: "Booking created", booking, nights });
    } catch (error) {
        res.status(500).json({ message: "Failed to create booking" });
    }
};

export const getMyBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await bookingService.findBookingsByUser(req.user!.id);
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
};

export const getBookingById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid booking ID" });
        }

        const booking = await bookingService.findBookingById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // A guest can only see their own booking; an admin can see any
        if (booking.user_id !== req.user!.id && req.user!.role !== "admin") {
            return res.status(403).json({ message: "This is not your booking" });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch booking" });
    }
};

export const cancelMyBooking = async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid booking ID" });
        }

        const booking = await bookingService.findBookingById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (booking.user_id !== req.user!.id) {
            return res.status(403).json({ message: "This is not your booking" });
        }
        if (booking.status === "cancelled" || booking.status === "completed") {
            return res.status(400).json({ message: `This booking is already ${booking.status}` });
        }
        if (booking.check_in_date <= todayString()) {
            return res.status(400).json({ message: "Bookings can't be cancelled on or after the check-in date" });
        }

        const updated = await bookingService.updateBookingStatus(id, "cancelled");
        res.status(200).json({ message: "Booking cancelled", booking: updated });
    } catch (error) {
        res.status(500).json({ message: "Failed to cancel booking" });
    }
};

// ---------- ADMIN ----------

export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await bookingService.findAllBookings();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
};

export const changeBookingStatus = async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid booking ID" });
        }

        const { status } = req.body;
        if (!STATUSES.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const booking = await bookingService.updateBookingStatus(id, status as BookingStatus);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ message: "Booking status updated", booking });
    } catch (error) {
        res.status(500).json({ message: "Failed to update booking status" });
    }
};