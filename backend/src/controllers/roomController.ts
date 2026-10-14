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
