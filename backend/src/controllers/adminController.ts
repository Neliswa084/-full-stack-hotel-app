import { Request, Response } from "express";
import * as adminService from "../services/adminService";

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const stats = await adminService.getStats();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch stats" });
    }
};

export const getAdminHotels = async (req: Request, res: Response) => {
    try {
        const hotels = await adminService.getAllHotels();
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch hotels" });
    }
};