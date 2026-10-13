import { query } from "../config/database";
import { Room } from "../models/room.model";


export const findAllRooms = async (): Promise<Room[]> => {
    const {rows} = await query(
        "SELECT * FROM room_types ORDER BY id"
    );
    return rows;
};

export const findRoomByHotelId = async (hotel_id: number): Promise<Room[]> => {
    const {rows} = await query(
        "SELECT * FROM room_types WHERE hotel_id = $1 ORDER BY id",
        [hotel_id]
    );
    return rows;
};
