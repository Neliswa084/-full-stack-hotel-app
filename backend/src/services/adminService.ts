import { query } from "../config/database";

export const getStats = async () => {
    const hotels = await query("SELECT COUNT(*) FROM hotels");
    const users = await query("SELECT COUNT(*) FROM users WHERE role = 'guest'");
    const bookings = await query("SELECT COUNT(*) FROM bookings");

    return {
        hotels: Number(hotels.rows[0].count),
        users: Number(users.rows[0].count),
        bookings: Number(bookings.rows[0].count)
    };
};
export const getAllHotels = async () => {
    const { rows } = await query("SELECT * FROM hotels ORDER BY id");
    return rows;
};