import { query } from "../config/database"
import bcrypt from "bcryptjs"
import { User } from "../models/user.model"

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const { rows } = await query("SELECT * FROM users WHERE email = $1", [email])
  return rows[0] || null
}

export const createUser = async (
  first_name: string, last_name: string, email: string,
  phone_number: string | null, password: string
): Promise<User> => {
  const password_hash = await bcrypt.hash(password, 10);
  const { rows } = await query(
    `INSERT INTO users (first_name, last_name, email, phone_number, password_hash)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, first_name, last_name, email, phone_number, role, account_status, created_at`,
    [first_name, last_name, email, phone_number, password_hash]
  );
  return rows[0];
};

export const getAllUsers = async () => {
  const { rows } = await query(
    `SELECT id, first_name, last_name, email, phone_number, role, account_status, created_at
         FROM users
         ORDER BY id`
  );
  return rows;
};

export const updateUserStatus = async (id: number, status: string) => {
  const { rows } = await query(
    `UPDATE users SET account_status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING id, first_name, last_name, email, account_status`,
    [status, id]
  );
  return rows[0] || null;
};

export const updateUserInfo = async (
  id: number,
  first_name: string,
  last_name: string,
  phone_number: string | null,
  profile_picture: string | null
) => {
  const { rows } = await query(
    `UPDATE users SET
            first_name = $1, last_name = $2, phone_number = $3,
            profile_picture = $4, updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING id, first_name, last_name, email, phone_number, profile_picture, role, account_status`,
    [first_name, last_name, phone_number, profile_picture, id]
  );
  return rows[0] || null;
};

