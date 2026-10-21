export interface AdminUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  role: 'guest' | 'admin';
  account_status: 'active' | 'blocked';
  created_at: string;
}