export interface User {
id: number;
first_name: string;
last_name: string;
email: string;
phone_number: string;
profile_picture: string | null;
password_hash: string;
 google_id: string | null;
role: 'guest' | 'admin'
account_status: 'active' | 'blocked';
created_at: Date;
updated_at: Date;

}

        