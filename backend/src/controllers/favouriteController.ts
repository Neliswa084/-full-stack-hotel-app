import { Request, Response } from "express";
import * as favouriteService from "../services/favouriteService";

export const getMyFavourites = async (req: Request, res: Response) => {
    try {
        const favourites = await favouriteService.findFavouritesByUser(req.user!.id);
        res.status(200).json(favourites);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch favourites" });
    }
};

export const saveFavourite = async (req: Request, res: Response) => {
    try {
        const hotelId = parseInt(String(req.params.hotelId));
        if (isNaN(hotelId)) {
            return res.status(400).json({ message: "Invalid hotel ID" });
        }
        await favouriteService.addFavourite(req.user!.id, hotelId);
        res.status(201).json({ message: "Added to favourites" });
    } catch (error: any) {
        if (error.code === "23503") {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(500).json({ message: "Failed to add favourite" });
    }
};

export const deleteFavourite = async (req: Request, res: Response) => {
    try {
        const hotelId = parseInt(String(req.params.hotelId));
        if (isNaN(hotelId)) {
            return res.status(400).json({ message: "Invalid hotel ID" });
        }
        const removed = await favouriteService.removeFavourite(req.user!.id, hotelId);
        if (!removed) {
            return res.status(404).json({ message: "This hotel is not in your favourites" });
        }
        res.status(200).json({ message: "Removed from favourites" });
    } catch (error) {
        res.status(500).json({ message: "Failed to remove favourite" });
    }
};