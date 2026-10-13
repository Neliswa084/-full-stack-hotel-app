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
     

        if(isNaN(id)) {
            return res.status(400).json({ message: "Invalid hotel ID" });
        }
        const hotel = await hotelsService.findHotelById(id);

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(200).json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch hotel" });
    }
}

export const addHotel = async (req: Request, res: Response) => {
    try {
        const { name, description, address, city, latitude, longitude,
                star_rating, check_in_time, check_out_time, cancellation_policy,
                children_policy, pet_policy, smoking_policy, is_visible } = req.body;

        if (!name || !address || !city) {
            return res.status(400).json({ message: "Name, address and city are required" });
        }

        if (star_rating !== undefined && (star_rating < 1 || star_rating > 5)) {
            return res.status(400).json({ message: "Star rating must be between 1 and 5" });
        }

        const hotel = await hotelsService.createHotel({
            name,
            description: description || null,
            address,
            city,
            latitude: latitude || null,
            longitude: longitude || null,
            star_rating: star_rating ?? 3,
            check_in_time: check_in_time || "14:00",
            check_out_time: check_out_time || "10:00",
            cancellation_policy: cancellation_policy || null,
            children_policy: children_policy || null,
            pet_policy: pet_policy || null,
            smoking_policy: smoking_policy || null,
            is_visible: is_visible ?? true
        });

        res.status(201).json({ message: "Hotel created", hotel });
    } catch (error) {
        res.status(500).json({ message: "Failed to create hotel" });
    }
};

export const deleteHotel = async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid hotel ID" });
        }

        const hotel = await hotelsService.removeHotel(id);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        res.status(200).json({ message: "Hotel deleted" });
    } catch (error: any) {
        if (error.code === "23503") {
            return res.status(409).json({ message: "This hotel has bookings, hide it instead of deleting" });
        }
        res.status(500).json({ message: "Failed to delete hotel" });
    }
};
