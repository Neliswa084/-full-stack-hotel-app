export interface HotelImage {
    id: number;
    hotel_id: number;
    image_url: string;
    is_main_image: boolean;
    display_order: number;
    created_at: Date;
}

export type NewHotelImage = Omit<HotelImage, 'id' | 'created_at'>;