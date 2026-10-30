export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface Payment {
    id: number;
    booking_id: number;
    amount: string; 
    payment_provider: string;
    provider_reference: string | null;
    status: PaymentStatus;
    paid_at: Date | null;
    created_at: Date;
}