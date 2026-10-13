export interface Hotel {
    id: number;
    name: string;
    description: string | null;
    address: string;
    city: string;
    latitude: string | null;
    longitude: string | null;
    star_rating: number;
    check_in_time: string;
    check_out_time: string;
    cancellation_policy: string | null;
    children_policy: string | null;
    pet_policy: string | null;
    smoking_policy: string | null;
    is_visible: boolean;
    created_at: Date;
    updated_at: Date;
}

export type NewHotel = Omit<Hotel, 'id' | 'created_at' | 'updated_at'>;