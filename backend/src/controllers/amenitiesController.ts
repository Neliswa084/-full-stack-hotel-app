import { Request, Response } from "express";
import * as amenityService from "../services/amenitiesService";


export const addAmenity = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Amenity name is required" });
        }

        const amenity = await amenityService.createAmenity(name.trim());
        res.status(201).json({ message: "Amenity added", amenity });
    } catch (error: any) {
        if (error.code === "23505") {
            return res.status(409).json({ message: "This amenity already exists" });
        }
        res.status(500).json({ message: "Failed to add amenity" });
    }
};

export const getAllAmenities = async (req: Request, res: Response) => {
    try {
        const amenities = await amenityService.findAllAmenities();
        res.status(200).json(amenities);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch amenities" });
    }
};

export const getHotelAmenities = async (req: Request, res: Response) => {
    try {
        const hotelId = parseInt(String(req.params.id));
        if (isNaN(hotelId)) {
            return res.status(400).json({ message: "Invalid hotel ID" });
        }
        const amenities = await amenityService.findAmenitiesByHotelId(hotelId);
        res.status(200).json(amenities);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch hotel amenities" });
    }
};

export const updateHotelAmenities = async (req: Request, res: Response) => {
    try {
        const hotelId = parseInt(String(req.params.id));
        if (isNaN(hotelId)) {
            return res.status(400).json({ message: "Invalid hotel ID" });
        }

        const { amenity_ids } = req.body;

        if (!Array.isArray(amenity_ids)) {
            return res.status(400).json({ message: "amenity_ids must be a list, e.g. [1, 3, 5]" });
        }

        const amenities = await amenityService.setHotelAmenities(hotelId, amenity_ids);
        res.status(200).json({ message: "Hotel amenities updated", amenities });
    } catch (error: any) {
        if (error.code === "23503") {
            return res.status(404).json({ message: "Hotel or amenity not found" });
        }
        if (error.code === "23505") {
            return res.status(400).json({ message: "The same amenity was sent twice" });
        }
        res.status(500).json({ message: "Failed to update hotel amenities" });
    }
};