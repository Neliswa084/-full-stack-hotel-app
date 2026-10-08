 import {query} from "../config/database"
 import bcrypt from "bcryptjs"
 import {User} from "../models/user.model"

 export const findUserByEmail = async (email: string): Promise<User | null> => {
    const {rows} = await query("SELECT * FROM users WHERE email = $1",[email])
    return rows[0] || null
 }


 export const createUser = async (
    first_name: string, last_name: string, email: string,
     phone_number: string, password: string, 
    role: string, account_status: string): Promise<User> => {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const { rows } = await query("INSERT INTO users (first_name, last_name, email, phone_number,  password_hash, role, account_status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", 
        [first_name, last_name, email, phone_number, password_hash, role, account_status]);
    return rows[0];
}





