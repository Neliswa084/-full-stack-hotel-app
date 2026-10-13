import { query } from "../config/database";
import { Room } from "../models/room.model";


export const findAllRooms = async (): Promise<Room[]> => {
    const {rows} = await query(
        "SELECT * FROM room_types ORDER BY id"
    );
    return rows;
};