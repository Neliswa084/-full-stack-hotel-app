import { query } from "../config/database";
import { HotelImage, NewHotelImage } from "../models/hotelImage.model";

export const findImagesByHotelId = async (hotelId: number): Promise<HotelImage[]> => {
    const { rows } = await query(
        "SELECT * FROM hotel_images WHERE hotel_id = $1 ORDER BY is_main_image DESC, display_order, id",
        [hotelId]
    );
    return rows;
};

export const createImage = async (image: NewHotelImage): Promise<HotelImage> => {
    if (image.is_main_image) {
        await query(
            "UPDATE hotel_images SET is_main_image = false WHERE hotel_id = $1",
            [image.hotel_id]
        );
    }
    const { rows } = await query(
        `INSERT INTO hotel_images (hotel_id, image_url, is_main_image, display_order)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [image.hotel_id, image.image_url, image.is_main_image, image.display_order]
    );
    return rows[0];
};

export const updateImage = async (id: number, image: Omit<NewHotelImage, 'hotel_id'>): Promise<HotelImage | null> => {
    if (image.is_main_image) {
        await query(
            `UPDATE hotel_images SET is_main_image = false
             WHERE hotel_id = (SELECT hotel_id FROM hotel_images WHERE id = $1)`,
            [id]
        );
    }
    const { rows } = await query(
        `UPDATE hotel_images SET image_url = $1, is_main_image = $2, display_order = $3
         WHERE id = $4
         RETURNING *`,
        [image.image_url, image.is_main_image, image.display_order, id]
    );
    return rows[0] || null;
};

export const removeImage = async (id: number): Promise<HotelImage | null> => {
    const { rows } = await query(
        "DELETE FROM hotel_images WHERE id = $1 RETURNING *",
        [id]
    );
    return rows[0] || null;
};