import { Request, Response } from "express";
import * as adminService from "../services/adminService";
import * as userService from "../services/userService"

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

export const getAdminUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

export const changeUserStatus = async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const { account_status } = req.body;
        if (account_status !== "active" && account_status !== "blocked") {
            return res.status(400).json({ message: "Status must be active or blocked" });
        }

        if (id === req.user!.id) {
            return res.status(400).json({ message: "You can't change your own account status" });
        }

        const user = await userService.updateUserStatus(id, account_status);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User status updated", user });
    } catch (error) {
        res.status(500).json({ message: "Failed to update user status" });
    }
};