import { Request, Response } from "express";
import * as userService from "../services/userService"
import brcypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerUser = async (req: Request, res: Response) => {
  const { first_name, last_name, phone_number, password } = req.body;
  const email = String(req.body.email || "").trim().toLowerCase();   

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "First name, last name, email and password are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }
  try {
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
    const newUser = await userService.createUser(first_name, last_name, email, phone_number || null, password);
    res.status(201).json({ message: "User registered successfully", userId: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
};

