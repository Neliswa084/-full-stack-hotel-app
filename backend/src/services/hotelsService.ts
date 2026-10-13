import { query } from "../config/database";
import { Hotel , NewHotel} from "../models/hotel.model";



export const findAllHotels = async (): Promise<Hotel[]> => {
    const {rows} = await query(
        "SELECT * FROM hotels WHERE is_visible = true ORDER BY id"
    );
    return rows
}
