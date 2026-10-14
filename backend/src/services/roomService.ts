import { query } from "../config/database";
import { Room } from "../models/room.model";


export const findAllRooms = async (): Promise<Room[]> => {
    const {rows} = await query(
        "SELECT * FROM room_types ORDER BY id"
    );
    return rows;
};

export const findRoomsByHotelId = async (hotel_id: number): Promise<Room[]> => {
    const {rows} = await query(
        "SELECT * FROM room_types WHERE hotel_id = $1 ORDER BY id",
        [hotel_id]
    );
    return rows;
};



export const addRoom = async (hotelId: number , name: string, capacity: number, price_per_night: string, total_rooms: number): Promise<Room> => {
    const { rows } = await query(
        `INSERT INTO room_types (hotel_id, name, capacity, price_per_night, total_rooms)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [hotelId, name, capacity, price_per_night, total_rooms]
    );
    return rows[0];
};