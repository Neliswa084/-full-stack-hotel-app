export interface Room {
    id: number;
    hotel_id: number;
    name: string;
    description: string | null;
    capacity: number;
    price_per_night: string;
    total_rooms: number;
    created_at: Date;
    updated_at: Date;
}