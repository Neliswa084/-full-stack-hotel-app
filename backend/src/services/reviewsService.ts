import { query } from "../config/database";
import { Review, ReviewWithUser } from  "../models/reviews.model";



export const findReviewById = async (id: number): Promise<Review | null> => {
    const { rows } = await query("SELECT * FROM reviews WHERE id = $1", [id]);
    return rows[0] || null;
};

export const createReview = async (userId: number, hotelId: number, rating: number, comment: string | null): Promise<Review> => {
    const { rows } = await query(
        `INSERT INTO reviews (user_id, hotel_id, rating, comment)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userId, hotelId, rating, comment]
    );
    return rows[0];
};

export const updateReview = async (id: number, rating: number, comment: string | null): Promise<Review | null> => {
    const { rows } = await query(
        `UPDATE reviews SET rating = $1, comment = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [rating, comment, id]
    );
    return rows[0] || null;
};

export const removeReview = async (id: number): Promise<Review | null> => {
    const { rows } = await query("DELETE FROM reviews WHERE id = $1 RETURNING *", [id]);
    return rows[0] || null;
};
export const findReviewsByHotelId = async (hotelId: number): Promise<ReviewWithUser[]> => {
    const { rows } = await query(
        `SELECT r.*, u.first_name, u.last_name
         FROM reviews r
         JOIN users u ON u.id = r.user_id
         WHERE r.hotel_id = $1
         ORDER BY r.created_at DESC`,
        [hotelId]
    );
    return rows;
};

export const getRatingSummary = async (hotelId: number) => {
    const { rows } = await query(
        `SELECT COALESCE(ROUND(AVG(rating), 1), 0) AS average, COUNT(*) AS total
         FROM reviews
         WHERE hotel_id = $1`,
        [hotelId]
    );
    return { average: Number(rows[0].average), total: Number(rows[0].total) };
};

export const hasStayedAtHotel = async (userId: number, hotelId: number): Promise<boolean> => {
    const { rows } = await query(
        `SELECT EXISTS (
            SELECT 1
            FROM bookings b
            JOIN room_types rt ON rt.id = b.room_type_id
            WHERE b.user_id = $1
              AND rt.hotel_id = $2
              AND (b.status = 'completed'
                   OR (b.status = 'confirmed' AND b.check_out_date <= CURRENT_DATE))
         ) AS stayed`,
        [userId, hotelId]
    );
    return rows[0].stayed;
};