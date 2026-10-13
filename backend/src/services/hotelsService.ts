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