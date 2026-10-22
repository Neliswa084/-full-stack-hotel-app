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
 
export interface Hotel {
  id?: number;
  name: string;
  description: string | null;
  address: string;
  city: string;
  star_rating: number;
  check_in_time: string;
  check_out_time: string;
  cancellation_policy: string | null;
  children_policy: string | null;
  pet_policy: string | null;
  smoking_policy: string | null;
  is_visible: boolean;
}
export interface Room {
  id: number;
  hotel_id: number;
  name: string;
  description: string | null;
  capacity: number;
  price_per_night: string;
  total_rooms: number;
}

export interface Photo {
  id: number;
  hotel_id: number;
  image_url: string;
  is_main_image: boolean;
  display_order: number;
}

export interface Amenity {
  id: number;
  name: string;
}

export interface Review {
  id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer: string;
}