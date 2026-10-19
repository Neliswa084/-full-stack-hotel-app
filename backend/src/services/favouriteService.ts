import { query } from "../config/database";


export const addFavourite = async (userId: number, hotelId: number) => {
    await query(
        `INSERT INTO favourites (user_id, hotel_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, hotel_id) DO NOTHING`,
        [userId, hotelId]
    );
};

export const removeFavourite = async (userId: number, hotelId: number): Promise<boolean> => {
    const { rows } = await query(
        "DELETE FROM favourites WHERE user_id = $1 AND hotel_id = $2 RETURNING *",
        [userId, hotelId]
    );
    return rows.length > 0;
};

export const findFavouritesByUser = async (userId: number) => {
    const { rows } = await query(
        `SELECT h.id, h.name, h.city, h.star_rating, f.created_at AS saved_at,
                (SELECT image_url FROM hotel_images
                 WHERE hotel_id = h.id AND is_main_image = true LIMIT 1) AS main_image,
                (SELECT MIN(price_per_night) FROM room_types
                 WHERE hotel_id = h.id) AS price_from
         FROM favourites f
         JOIN hotels h ON h.id = f.hotel_id
         WHERE f.user_id = $1 AND h.is_visible = true
         ORDER BY f.created_at DESC`,
        [userId]
    );
    return rows;
};