import { Request, Response } from "express";
import * as bookingService from "../services/bookingService";
import * as paymentService from "../services/paymentService";

const PAYSTACK_URL = "https://api.paystack.co";
const headers = () => ({
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json"
});

// Step 1: start the payment, returns the Paystack link
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
            return res.status(400).json({ message: `This booking is already ${booking.status}` });
        }

        // Unique reference per attempt, so the guest can retry if a payment fails
        const reference = `${booking.booking_reference}_${Date.now()}`;

        // Paystack wants the amount in cents
        const amountInCents = Math.round(Number(booking.total_amount) * 100);

        const response = await fetch(`${PAYSTACK_URL}/transaction/initialize`, {
            method: "POST",
            headers: headers(),
            body: JSON.stringify({
                email: booking.guest_email,
                amount: amountInCents,
                currency: "ZAR",
                reference,
                callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
                metadata: { booking_id: booking.id }
            })
        });

        const result: any = await response.json();
        if (!response.ok || !result.status) {
            return res.status(502).json({ message: result.message || "Could not start payment" });
        }

        await paymentService.createPayment(booking.id, booking.total_amount, reference);

        res.status(200).json({
            authorization_url: result.data.authorization_url,
            reference
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to start payment" });
    }
};

// Step 2: guest comes back from Paystack, we confirm with Paystack
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

        // Already handled
        if (payment.status === "succeeded") {
            return res.status(200).json({ message: "Payment successful", booking });
        }

        const response = await fetch(`${PAYSTACK_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
            headers: headers()
        });
        const result: any = await response.json();

        if (!response.ok || !result.status) {
            return res.status(502).json({ message: result.message || "Could not verify payment" });
        }

        const data = result.data;
        const expectedCents = Math.round(Number(payment.amount) * 100);

        if (data.status === "success" && data.amount === expectedCents && data.currency === "ZAR") {
            await paymentService.markPaymentSucceeded(payment.id);
            const updated = await bookingService.updateBookingStatus(payment.booking_id, "confirmed");
            return res.status(200).json({ message: "Payment successful", booking: updated });
        }

        if (data.status === "failed" || data.status === "abandoned") {
            await paymentService.markPaymentFailed(payment.id);
            return res.status(400).json({ message: "Payment was not completed" });
        }

        res.status(200).json({ message: "Payment is still pending" });
    } catch (error) {
        res.status(500).json({ message: "Failed to verify payment" });
    }
};