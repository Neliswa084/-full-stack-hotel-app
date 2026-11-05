import { query } from "../config/database";
import { Notification, NotificationType } from "../models/notification.model";

export const createNotification = async (
    userId: number,
    type: NotificationType,
    title: string,
    message: string
): Promise<Notification> => {
    const { rows } = await query(
        `INSERT INTO notifications (user_id, type, title, message)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userId, type, title, message]
    );
    return rows[0];
};

export const findNotificationsByUser = async (userId: number): Promise<Notification[]> => {
    const { rows } = await query(
        "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
    );
    return rows;
};

export const markAsRead = async (id: number, userId: number): Promise<Notification | null> => {
    const { rows } = await query(
        "UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *",
        [id, userId]
    );
    return rows[0] || null;
};

export const markAllAsRead = async (userId: number): Promise<void> => {
    await query(
        "UPDATE notifications SET is_read = true WHERE user_id = $1",
        [userId]
    );
};