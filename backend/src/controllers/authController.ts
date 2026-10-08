import { Request, Response } from "express";
import * as userService from "../services/userService"
import brcypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerUser = async (req: Request, res: Response) => {
    const {first_name, last_name, email, phone_number, password, role, account_status} = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = await userService.createUser(first_name, last_name, email, phone_number, password, role, account_status);
        res.status(201).json({ message: "User registered successfully", userId : newUser.id });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
}

