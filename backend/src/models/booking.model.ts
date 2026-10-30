export type PaymentMethod = 'online' | 'cash_at_hotel' | 'card_at_hotel' | 'eft';
export type BookingStatus = 'awaiting_payment' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
    id: number;
    booking_reference: string;
    user_id: number | null;
    room_type_id: number;
    guest_first_name: string;
    guest_last_name: string;
    guest_email: string;
    guest_phone: string | null;
    check_in_date: string;
    check_out_date: string;
    number_of_rooms: number;
    number_of_adults: number;
    number_of_children: number;
    arrival_time: string | null;
    special_requests: string | null;
    price_per_night: string;
    total_amount: string;
    payment_method: PaymentMethod;
    status: BookingStatus;
    created_at: Date;
    updated_at: Date;
}

export type NewBooking = Omit<Booking, 'id' | 'created_at' | 'updated_at'>;

export interface BookingDetails extends Booking {
    hotel_id: number;
    hotel_name: string;
    room_name: string;
}