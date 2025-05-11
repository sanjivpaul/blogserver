import express from "express";
import {
  createPreferences,
  deletePreferences,
  getPreferences,
  updatePreferences,
} from "../../controllers/user/user.controller.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Get preferences (public if userId provided)
router.get("/:userId", getPreferences);

// // Protected routes
router.use(verifyJwt);
router.post("/", createPreferences);
router.patch("/", updatePreferences);
router.delete("/", deletePreferences);

export default router;
