import { Request, Response } from "express";

import * as hotelsService from "../services/hotelsService";


export const getAllHotels = async (req: Request, res: Response) => {

    try {
        const hotels = await hotelsService.findAllHotels();
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch hotels" });
    }
}