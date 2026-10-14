import { Request, Response } from "express";
import * as imageService from "../services/hotelsImageService";

export const getImagesByHotel = async (req: Request, res: Response) => {
    try {
        const hotelId = parseInt(String(req.params.id));
        if (isNaN(hotelId)) {
            return res.status(400).json({ message: "Invalid hotel ID" });
        }
        const images = await imageService.findImagesByHotelId(hotelId);
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch images" });
    }
};

export const addImage = async (req: Request, res: Response) => {
    try {
        const hotelId = parseInt(String(req.params.id));
        if (isNaN(hotelId)) {
            return res.status(400).json({ message: "Invalid hotel ID" });
        }

        const { image_url, is_main_image, display_order } = req.body;

        if (!image_url) {
            return res.status(400).json({ message: "Image URL is required" });
        }

        const image = await imageService.createImage({
            hotel_id: hotelId,
            image_url,
            is_main_image: is_main_image ?? false,
            display_order: display_order ?? 0
        });

        res.status(201).json({ message: "Image added", image });
    } catch (error: any) {
        if (error.code === "23503") {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(500).json({ message: "Failed to add image" });
    }
};

export const editImage = async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid image ID" });
        }

        const { image_url, is_main_image, display_order } = req.body;

        if (!image_url) {
            return res.status(400).json({ message: "Image URL is required" });
        }

        const image = await imageService.updateImage(id, {
            image_url,
            is_main_image: is_main_image ?? false,
            display_order: display_order ?? 0
        });

        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        res.status(200).json({ message: "Image updated", image });
    } catch (error) {
        res.status(500).json({ message: "Failed to update image" });
    }
};

export const deleteImage = async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid image ID" });
        }

        const image = await imageService.removeImage(id);
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        res.status(200).json({ message: "Image deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete image" });
    }
};