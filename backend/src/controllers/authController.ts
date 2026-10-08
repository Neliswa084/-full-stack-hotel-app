import { Request, Response } from "express";
import * as userService from "../services/userService"
import bcrypt from "bcryptjs";
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

export const loginUser = async (req: Request, res: Response) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const { password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await userService.findUserByEmail(email);

   
    if (!user || !user.password_hash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

  
    if (user.account_status === "blocked") {
      return res.status(403).json({ message: "Your account has been blocked" });
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
};