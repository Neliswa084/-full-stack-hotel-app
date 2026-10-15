import { query } from "../config/database";
import { Amenity } from "../models/amenitie.model";

export const findAllAmenities = async (): Promise<Amenity[]> => {
    const { rows } = await query(
        "SELECT * FROM amenities ORDER BY name"
    );
    return rows;
};

export const findAmenitiesByHotelId = async (hotelId: number): Promise<Amenity[]> => {
    const { rows } = await query(
        `SELECT a.id, a.name
         FROM amenities a
         JOIN hotel_amenities ha ON ha.amenity_id = a.id
         WHERE ha.hotel_id = $1
         ORDER BY a.name`,
        [hotelId]
    );
    return rows;
};

export const setHotelAmenities = async (hotelId: number, amenityIds: number[]): Promise<Amenity[]> => {
    await query(
        "DELETE FROM hotel_amenities WHERE hotel_id = $1",
        [hotelId]
    );

    for (const amenityId of amenityIds) {
        await query(
            "INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES ($1, $2)",
            [hotelId, amenityId]
        );
    }

    return findAmenitiesByHotelId(hotelId);
};