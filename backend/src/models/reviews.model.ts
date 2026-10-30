export interface Review {
    id: number;
    user_id: number;
    hotel_id: number;
    rating: number;
    comment: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface ReviewWithUser extends Review {
    first_name: string;
    last_name: string;
}