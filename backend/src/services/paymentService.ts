import { query } from "../config/database";
import { Payment } from "../models/payment.model";

export const createPayment = async (bookingId: number, amount: string, reference: string): Promise<Payment> => {
    const { rows } = await query(
        `INSERT INTO payments (booking_id, amount, payment_provider, provider_reference, status)
         VALUES ($1, $2, 'paystack', $3, 'pending')
         RETURNING *`,
        [bookingId, amount, reference]
    );
    return rows[0];
};

export const findPaymentByReference = async (reference: string): Promise<Payment | null> => {
    const { rows } = await query(
        `SELECT * FROM payments WHERE provider_reference = $1`,
        [reference]
    );
    return rows[0] || null;
};

export const markPaymentSucceeded = async (id: number): Promise<Payment | null> => {
    const { rows } = await query(
        `UPDATE payments SET status = 'succeeded', paid_at = CURRENT_TIMESTAMP
         WHERE id = $1 RETURNING *`,
        [id]
    );
    return rows[0] || null;
};

export const markPaymentFailed = async (id: number): Promise<void> => {
    await query(`UPDATE payments SET status = 'failed' WHERE id = $1`, [id]);
};