import { query } from "../config/database";
import { Room , NewRoom } from "../models/room.model";


export const findAllRooms = async (): Promise<Room[]> => {
    const { rows } = await query(
        "SELECT * FROM room_types ORDER BY id"
    );
    return rows;
};

export const findRoomsByHotelId = async (hotel_id: number): Promise<Room[]> => {
    const { rows } = await query(
        "SELECT * FROM room_types WHERE hotel_id = $1 ORDER BY id",
        [hotel_id]
    );
    return rows;
};





export const createRoom = async (room: NewRoom): Promise<Room> => {
    const { rows } = await query(
        `INSERT INTO room_types (hotel_id, name, description, capacity, price_per_night, total_rooms)
      VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [room.hotel_id, room.name, room.description, room.capacity,
        room.price_per_night, room.total_rooms]
    );
    return rows[0];
};

export const removeRoom = async (id: number): Promise<Room | null> => {
    const {rows} = await query(
        "DELETE FROM room_types WHERE id= $1 RETURNING *",
        [id]
    );
    return rows[0] || null;
}

export const updateRoom = async (id: number, room: NewRoom): Promise<Room | null> => {
    const { rows } = await query(
        `UPDATE room_types SET
        name = $1, description = $2, capacity = $3, price_per_night = $4, total_rooms = $5,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING *`,
        [room.name, room.description, room.capacity, room.price_per_night, room.total_rooms, id]
    );
    return rows[0] || null;
}