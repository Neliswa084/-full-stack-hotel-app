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
