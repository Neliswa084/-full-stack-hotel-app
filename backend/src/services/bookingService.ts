import { query } from "../config/database";
import { Booking, NewBooking, BookingDetails, BookingStatus } from "../models/booking.model";

export const findRoomForBooking = async (roomId: number) => {
    const { rows } = await query(
        `SELECT rt.*, h.is_visible
         FROM room_types rt
         JOIN hotels h ON h.id = rt.hotel_id
         WHERE rt.id = $1`,
        [roomId]
    );
    return rows[0] || null;
};

export const countBookedRooms = async (roomId: number, checkIn: string, checkOut: string): Promise<number> => {
    const { rows } = await query(
        `SELECT COALESCE(SUM(number_of_rooms), 0) AS booked
         FROM bookings
         WHERE room_type_id = $1
           AND status IN ('awaiting_payment', 'confirmed')
           AND check_in_date < $3
           AND check_out_date > $2`,
        [roomId, checkIn, checkOut]
    );
    return Number(rows[0].booked);
};

export const createBooking = async (b: NewBooking): Promise<Booking> => {
    const { rows } = await query(
        `INSERT INTO bookings (booking_reference, user_id, room_type_id,
            guest_first_name, guest_last_name, guest_email, guest_phone,
            check_in_date, check_out_date, number_of_rooms, number_of_adults, number_of_children,
            arrival_time, special_requests, price_per_night, total_amount, payment_method, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
         RETURNING *`,
        [b.booking_reference, b.user_id, b.room_type_id,
         b.guest_first_name, b.guest_last_name, b.guest_email, b.guest_phone,
         b.check_in_date, b.check_out_date, b.number_of_rooms, b.number_of_adults, b.number_of_children,
         b.arrival_time, b.special_requests, b.price_per_night, b.total_amount, b.payment_method, b.status]
    );
    return rows[0];
};

const detailsSelect = `
    SELECT b.*, rt.name AS room_name, h.id AS hotel_id, h.name AS hotel_name
    FROM bookings b
    JOIN room_types rt ON rt.id = b.room_type_id
    JOIN hotels h ON h.id = rt.hotel_id`;

export const findBookingsByUser = async (userId: number): Promise<BookingDetails[]> => {
    const { rows } = await query(
        `${detailsSelect} WHERE b.user_id = $1 ORDER BY b.check_in_date DESC`,
        [userId]
    );
    return rows;
};

export const findBookingById = async (id: number): Promise<BookingDetails | null> => {
    const { rows } = await query(
        `${detailsSelect} WHERE b.id = $1`,
        [id]
    );
    return rows[0] || null;
};

export const findAllBookings = async (): Promise<BookingDetails[]> => {
    const { rows } = await query(
        `${detailsSelect} ORDER BY b.created_at DESC`
    );
    return rows;
};

export const updateBookingStatus = async (id: number, status: BookingStatus): Promise<Booking | null> => {
    const { rows } = await query(
        `UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [status, id]
    );
    return rows[0] || null;
};