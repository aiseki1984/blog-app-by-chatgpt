import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const prisma = new PrismaClient();

export const createRegisterHandler =
  (prisma: PrismaClient) => async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use." });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Create JWT token
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      // Set token in httpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
      });

      res
        .status(201)
        .json({ message: "User registered successfully.", user: newUser });
    } catch (error) {
      console.error(error); // 追加
      res.status(500).json({ message: "Server error.", error });
    }
  };

export const register = createRegisterHandler(prisma);

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare password with hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    // Set token in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(200).json({ message: "Logged in successfully.", user });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Clear token in httpOnly cookie
    res.clearCookie("token");

    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from httpOnly cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    // Verify JWT token and get user ID
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decodedToken as any).userId;

    // Find user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    res.status(500).json({ message: "Server error.", error });
  }
};
