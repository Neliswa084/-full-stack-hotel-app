import { query } from "../config/database";
import { Hotel , NewHotel} from "../models/hotel.model";



export const findAllHotels = async (): Promise<Hotel[]> => {
    const {rows} = await query(
        "SELECT * FROM hotels WHERE is_visible = true ORDER BY id"
    );
    return rows
}

export const findHotelById = async (id: number): Promise<Hotel | null> => {
    const {rows} = await query(
        "SELECT * FROM hotels WHERE id = $1 AND is_visible = true",
        [id]
    );
    return rows[0] || null;
};

export const createHotel = async (hotel: NewHotel): Promise<Hotel> => {
    const { rows } = await query(
        `INSERT INTO hotels (name, description, address, city, latitude, longitude,
            star_rating, check_in_time, check_out_time, cancellation_policy,
            children_policy, pet_policy, smoking_policy, is_visible)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         RETURNING *`,
        [
            hotel.name, hotel.description, hotel.address, hotel.city,
            hotel.latitude, hotel.longitude, hotel.star_rating,
            hotel.check_in_time, hotel.check_out_time, hotel.cancellation_policy,
            hotel.children_policy, hotel.pet_policy, hotel.smoking_policy,
            hotel.is_visible
        ]
    );
    return rows[0];
};

export const removeHotel = async (id: number): Promise<void> => {
    const {rows} = await query(
        "DELETE FROM hotels WHERE id = $1",
        [id]
    );  
    return rows[0] || null;
};