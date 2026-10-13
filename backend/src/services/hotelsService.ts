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

export const removeHotel = async (id: number): Promise<Hotel | null> => {
    const {rows} = await query(
        "DELETE FROM hotels WHERE id = $1 RETURNING *",
        [id]
    );  
    return rows[0] || null;
};

export const updateHotel = async (id: number, hotel: NewHotel): Promise<Hotel | null> => {
    const { rows } = await query(
        `UPDATE hotels SET
            name = $1, description = $2, address = $3, city = $4,
            latitude = $5, longitude = $6, star_rating = $7,
            check_in_time = $8, check_out_time = $9, cancellation_policy = $10,
            children_policy = $11, pet_policy = $12, smoking_policy = $13,
            is_visible = $14, updated_at = CURRENT_TIMESTAMP
         WHERE id = $15
         RETURNING *`,
        [
            hotel.name, hotel.description, hotel.address, hotel.city,
            hotel.latitude, hotel.longitude, hotel.star_rating,
            hotel.check_in_time, hotel.check_out_time, hotel.cancellation_policy,
            hotel.children_policy, hotel.pet_policy, hotel.smoking_policy,
            hotel.is_visible, id
        ]
    );
    return rows[0] || null;
};