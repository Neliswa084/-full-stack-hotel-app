 import {query} from "../config/database"
 import bcrypt from "bcryptjs"
 import {User} from "../models/user.model"

 export const findUserByEmail = async (email: string): Promise<User | null> => {
    const {rows} = await query("SELECT * FROM users WHERE email = $1",[email])
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





