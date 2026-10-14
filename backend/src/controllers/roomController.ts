import { Request, Response } from "express";
import * as roomsService from "../services/roomService";

export const getAllRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await roomsService.findAllRooms();
      res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: "Error fetching rooms" });
    }
};

export const getRoomsByHotel = async (req: Request, res: Response) => {
    try {
        const hotelId = parseInt(String(req.params.id));
        if (isNaN(hotelId)) {
            return res.status(400).json({ message: "Invalid hotel ID" });
        }
        const rooms = await roomsService.findRoomsByHotelId(hotelId);
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: "Error fetching rooms" });
    }
};

export const addRoom = async (req: Request, res: Response) => {
    try {
        const hotelId = parseInt(String(req.params.id));
        if (isNaN(hotelId)) {
            return res.status(400).json({ message: "Invalid hotel ID" });
        }

        const { name, description, capacity, price_per_night, total_rooms } = req.body;

        if (!name || capacity === undefined || price_per_night === undefined || total_rooms === undefined) {
            return res.status(400).json({ message: "Name, capacity, price per night and total rooms are required" });
        }

        if (capacity <= 0) {
            return res.status(400).json({ message: "Capacity must be more than 0" });
        }
        if (price_per_night < 0 || total_rooms < 0) {
            return res.status(400).json({ message: "Price and total rooms can't be negative" });
        }

        const room = await roomsService.createRoom({
            hotel_id: hotelId,
            name,
            description: description || null,
            capacity,
            price_per_night,
            total_rooms
        });

        res.status(201).json({ message: "Room created", room });
    } catch (error: any) {
        if (error.code === "23505") {
            return res.status(409).json({ message: "This hotel already has a room with that name" });
        }
        if (error.code === "23503") {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(500).json({ message: "Failed to create room" });
    }
};

export const deleteRoom = async (req: Request, res: Response) => {
    try{
        const id = parseInt(String(req.params.id));

        if (isNaN(id)){
            return res.status(400).json({message: "Invalid room ID"});
        }

        const room = await roomsService.removeRoom(id);

        if (!room) {
            return res.status(404).json({message: "Room not found"})
        }
        res.status(200).json({message: "Room deleted"})
    }
    catch (error: any) {
      res.status(500).json({ message: "Failed to delete Room" });
    }
}


