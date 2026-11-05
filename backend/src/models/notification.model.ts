export type NotificationType = 'booking_confirmation' | 'booking_update' | 'promotion';

export interface Notification {
    id: number;
    user_id: number;
    type: NotificationType;
    title: string;
    message: string;
    is_read: boolean;
    created_at: Date;
}