export interface HotelCardData {
    id: number;
    name: string;
    city: string;
    star_rating: number;
    main_image: string | null;
    price_from: string | null;
    average_rating: string | null;
    amenities: string[];
}