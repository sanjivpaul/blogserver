// import { User, UserProfile } from "../../models/index.js";
import db from "../../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Model, Op } from "sequelize";
import sequelize from "../../db/index.js";

const { User, UserProfile } = db;

const registerUser = async (req, res) => {
  const transaction = await sequelize.transaction();

  const { email, password } = req.body;

  console.log(req.body);

  try {
    // Basic validation
    if (!email || !password) {
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
      z;
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
      // where: {
      //   [Op.or]: [{ email }, { username }],
      // },
      where: { email },
    });

    // if (existingUser) {
    //   const conflictField = existingUser.email === email ? "email" : "username";
    //   return res.status(409).json({
    //     success: false,
    //     message: `${conflictField} already exists`,
    //   });
    // }

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Create user and profile in transaction
    const user = await User.create(
      {
        email,
        password_hash: password,
        role: "user",
      },
      { transaction }
    );

    await UserProfile.create(
      {
        user_id: user.user_id,
        username: null,
        bio: "",
        profile_image_url: "",
      },
      { transaction }
    );

    await transaction.commit();

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
      // username: user.username,
      role: user.role,
      is_verified: user.is_verified,
      created_at: user.created_at,
    };

    // return res.status(201).json({
    //   success: true,
    //   message: "User registered successfully",
    //   user: userResponse,
    //   accessToken,
    // });

    return res.status(201).json({
      success: true,
      message:
        "User registered successfully. Complete your profile to set username.",
      user: {
        user_id: user.user_id,
        email: user.email,
        has_profile: false, // Add profile status
      },
      accessToken,
    });
  } catch (error) {
    await transaction.rollback();

    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      //   error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

// const loginUser = async (req, res) => {
//   const { emailOrUsername, password } = req.body;

//   try {
//     // Validate input
//     if (!emailOrUsername || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email/username and password are required",
//       });
//     }

//     // Find user by email or username
//     const user = await User.findOne({
//       where: {
//         [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
//       },
//     });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Verify password
//     const isPasswordValid = await user.isPasswordCorrect(password);
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     // Generate tokens
//     const accessToken = user.generateAccessToken();
//     const refreshToken = user.generateRefreshToken();

//     // Set refresh token in cookie
//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//       sameSite: "strict",
//     });

//     // Prepare user response
//     const userResponse = {
//       user_id: user.user_id,
//       email: user.email,
//       username: user.username,
//       role: user.role,
//       is_verified: user.is_verified,
//       last_login: user.last_login,
//     };

//     // Update last login
//     await user.update({ last_login: new Date() });

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       user: userResponse,
//       accessToken,
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       // error: process.env.NODE_ENV === "development" ? error : undefined,
//     });
//   }
// };

const loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    // Validate input
    if (!emailOrUsername || !password) {
      return res.status(400).json({
        success: false,
        message: "Email is required for login",
      });
    }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const isEmail = emailRegex.test(emailOrUsername);

    // if (isEmail) {
    //   // Find user by email
    //   const user = await User.findOne({
    //     where: { email: emailOrUsername },
    //   });
    // } else {
    //   // Login with username - check UserProfile
    //   const userProfile = await UserProfile.findOne({
    //     where: { username: emailOrUsername },
    //     include: [{ model: User }],
    //   });

    //   if (!userProfile?.User) {
    //     return res.status(404).json({
    //       success: false,
    //       message:
    //         "Username not set up yet. Please login with your email address.",
    //       hint: "Complete your profile setup to enable username login",
    //     });
    //   }

    // user = userProfile.User;
    // }

    // Always treat input as email first
    let user = await User.findOne({
      where: { email: emailOrUsername },
      include: [UserProfile], // Include profile
    });

    // if (!user) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "User not found",
    //   });
    // }

    // If no user found, check if identifier is username
    if (!user) {
      const profile = await UserProfile.findOne({
        where: { username: emailOrUsername },
        include: [User],
      });

      if (!profile?.User) {
        return res.status(404).json({
          success: false,
          message: "Account not found. Please use your email address to login.",
          hint: "Username login is only available after profile setup",
        });
      }

      user = profile.User;
      user.UserProfile = profile; // Attach profile to user instance
    }

    // Verify password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    // // Prepare user response
    // const userResponse = {
    //   user_id: user.user_id,
    //   email: user.email,
    //   // username: user.username,
    //   role: user.role,
    //   is_verified: user.is_verified,
    //   last_login: user.last_login,
    // };

    // // Include username if profile exists
    // if (user.UserProfile) {
    //   userResponse.username = user.UserProfile.username;
    // }

    // return res.status(200).json({
    //   success: true,
    //   message: "Login successful",
    //   user: userResponse,
    //   accessToken,
    // });

    // Response structure
    const responseData = {
      user_id: user.user_id,
      email: user.email,
      has_profile: !!user.UserProfile?.username,
      profile_complete: false,
    };

    if (user.UserProfile?.username) {
      responseData.profile_complete = true;
      responseData.username = user.UserProfile.username;
    }

    // Update last login
    await user.update({ last_login: new Date() });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: responseData,
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      // error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.user_id;

    const profile = await UserProfile.findByPk(userId, {
      include: [
        {
          model: User,
          attributes: ["email", "createdAt"],
          as: "user",
        },
      ],
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile: {
        username: profile.username,
        bio: profile.bio,
        profile_image_url: profile.profile_image_url,
        email: profile.user?.email,
        joined: profile.user?.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in getProfile:", error); // This helps debug

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, bio, profile_image_url } = req.body;
    const userId = req.user.user_id;

    console.log(req.body);
    console.log(userId);

    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Missing request body",
      });
    }

    // Validate username uniqueness
    if (username) {
      const existingProfile = await UserProfile.findOne({
        where: { username, user_id: { [Op.ne]: userId } },
      });

      if (existingProfile) {
        return res.status(409).json({
          success: false,
          message: "Username already taken",
        });
      }
    }

    let profile = await UserProfile.findByPk(userId);

    if (profile) {
      // Update existing profile
      await profile.update({ username, bio, profile_image_url });

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        username_set: !!username,
      });
    } else {
      // Create new profile
      profile = await UserProfile.create({
        user_id: userId,
        username,
        bio,
        profile_image_url,
      });

      return res.status(201).json({
        success: true,
        message: "Profile created successfully",
        username_set: !!username,
      });
    }

    // const [updated] = await UserProfile.update(
    //   { username, bio, profile_image_url },
    //   {
    //     where: { user_id: userId },
    //     returning: true,
    //   }
    // );

    // if (!updated) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Profile not found",
    //   });
    // }

    // return res.status(200).json({
    //   success: true,
    //   message: "Profile updated successfully",
    //   username_set: !!username, // Indicate if username was added
    // });
  } catch (error) {
    console.error("Error in update Profile:", error); // This helps debug

    return res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    await UserProfile.destroy({
      where: { user_id: userId },
    });

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete profile",
    });
  }
};

export { registerUser, loginUser, getProfile, updateProfile, deleteProfile };
