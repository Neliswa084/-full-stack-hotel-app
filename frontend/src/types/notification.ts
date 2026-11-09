export interface Notification {
  id: number;
  user_id: number;
  type: 'booking_confirmation' | 'booking_update' | 'promotion';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}