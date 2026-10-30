import { Request, Response } from "express";
import axios from "axios";
import * as bookingService from "../services/bookingService";
import * as paymentService from "../services/paymentService";

// Start the payment and get the Paystack payment link
export const initializePayment = async (req: Request, res: Response) => {
    try {
        const bookingId = parseInt(String(req.body.booking_id));
        if (isNaN(bookingId)) {
            return res.status(400).json({ message: "Booking ID is required" });
        }

        const booking = await bookingService.findBookingById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (booking.user_id !== req.user!.id) {
            return res.status(403).json({ message: "This is not your booking" });
        }
        if (booking.status !== "awaiting_payment") {
            return res.status(400).json({ message: "This booking does not need payment" });
        }

        // A new reference for every try, so the guest can try again if it fails
        const reference = booking.booking_reference + "_" + Date.now();

        // Paystack counts in cents, so R850 must be sent as 85000
        const amountInCents = Math.round(Number(booking.total_amount) * 100);

        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email: booking.guest_email,
                amount: amountInCents,
                currency: "ZAR",
                reference: reference,
                callback_url: process.env.FRONTEND_URL + "/payment/callback"
            },
            {
                headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
            }
        );

        // Save the payment as pending
        await paymentService.createPayment(booking.id, booking.total_amount, reference);

        res.status(200).json({
            authorization_url: response.data.data.authorization_url,
            reference: reference
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to start payment" });
    }
};

// Ask Paystack if the payment was successful
export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const reference = String(req.params.reference);

        const payment = await paymentService.findPaymentByReference(reference);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        const booking = await bookingService.findBookingById(payment.booking_id);
        if (!booking || booking.user_id !== req.user!.id) {
            return res.status(403).json({ message: "This is not your payment" });
        }

        // If we already confirmed it before, don't do it again
        if (payment.status === "succeeded") {
            return res.status(200).json({ message: "Payment successful", booking });
        }

        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
            }
        );

        const paystackStatus = response.data.data.status;
        const paidAmount = response.data.data.amount;
        const expectedAmount = Math.round(Number(payment.amount) * 100);

        if (paystackStatus === "success" && paidAmount === expectedAmount) {
            await paymentService.markPaymentSucceeded(payment.id);
            const updatedBooking = await bookingService.updateBookingStatus(payment.booking_id, "confirmed");
            return res.status(200).json({ message: "Payment successful", booking: updatedBooking });
        }

        await paymentService.markPaymentFailed(payment.id);
        res.status(400).json({ message: "Payment was not completed" });
    } catch (error) {
        res.status(500).json({ message: "Failed to verify payment" });
    }
};