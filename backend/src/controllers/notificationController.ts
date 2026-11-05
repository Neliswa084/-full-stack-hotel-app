import { Request, Response } from "express";
import * as notificationService from "../services/notificationService";

export const getMyNotifications = async (req: Request, res: Response) => {
    try {
        const notifications = await notificationService.findNotificationsByUser(req.user!.id);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch notifications" });
    }
};

export const readNotification = async (req: Request, res: Response) => {
    try {
        const id = parseInt(String(req.params.id));
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid notification ID" });
        }

        const notification = await notificationService.markAsRead(id, req.user!.id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: "Failed to update notification" });
    }
};

export const readAllNotifications = async (req: Request, res: Response) => {
    try {
        await notificationService.markAllAsRead(req.user!.id);
        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update notifications" });
    }
};