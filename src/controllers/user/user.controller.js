import { User } from "../../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // Basic validation
    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: "All fields (email, password, username) are required",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Password strength check
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      const conflictField = existingUser.email === email ? "email" : "username";
      return res.status(409).json({
        success: false,
        message: `${conflictField} already exists`,
      });
    }

    // Create user
    const user = await User.create({
      email,
      password_hash: password, // Will be hashed by model hook
      username,
      role: "user", // Default role
    });

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
    });

    // Omit sensitive fields from response
    const userResponse = {
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      role: user.role,
      is_verified: user.is_verified,
      created_at: user.created_at,
    };

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
      accessToken,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      //   error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export { registerUser };
