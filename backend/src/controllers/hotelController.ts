import { Request, Response } from "express";

import * as hotelsService from "../services/hotelsService";


export const getAllHotels = async (req: Request, res: Response) => {

    try {
        const hotels = await hotelsService.findAllHotels();
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch hotels" });
    }
}

export const getHotelById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        const hotel = await hotelsService.findHotelById(id);

        if(isNaN(id)) {
            return res.status(400).json({ message: "Invalid hotel ID" });
        }

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(200).json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch hotel" });
    }
}