import express from "express";
import {
  deleteProfile,
  getProfile,
  loginUser,
  registerUser,
  updateProfile,
} from "../../controllers/user/user.controller.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// profile
router.get("/me", verifyJwt, getProfile);
router.get("/:userId", getProfile);
router.patch("/me", verifyJwt, updateProfile);
router.delete("/me", verifyJwt, deleteProfile);

export default router;
