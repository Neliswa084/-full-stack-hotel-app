import { Request, Response } from "express";
import * as userService from "../services/userService"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library";

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
    phone_number: user.phone_number,
    role: user.role
},
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
};

export const updateMyInfo = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, phone_number, profile_picture } = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({ message: "First name and last name are required" });
    }

    if (phone_number && phone_number.length > 20) {
      return res.status(400).json({ message: "Phone number is too long" });
    }

   
    const user = await userService.updateUserInfo(
    req.user!.id,
    first_name,
    last_name,
    phone_number || null,
    profile_picture || req.user!.profile_picture || null
)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: "Google credential is required" });
  }

  try {
    // Created here, not at the top of the file, so the .env value is already loaded
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.email_verified) {
      return res.status(401).json({ message: "Google account could not be verified" });
    }

    const email = payload.email.toLowerCase();
    let user = await userService.findUserByEmail(email);

    if (!user) {
      // First time with Google: create the account
      user = await userService.createGoogleUser(
        payload.given_name || "Google",
        payload.family_name || "",
        email,
        payload.sub,
        payload.picture || null
      );
    } else if (!user.google_id) {
      
      await userService.linkGoogleAccount(user.id, payload.sub, payload.picture || null);
    }

    if (user.account_status === "blocked") {
      return res.status(403).json({ message: "Your account has been blocked" });
    }

    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Google sign in failed" });
  }
};