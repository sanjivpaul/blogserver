import express from "express";
import {
  loginUser,
  registerUser,
  upgradeToWriter,
} from "../../controllers/user/user.controller.js";
import { checkWriterEligibility } from "../../middlewares/eligibility.middleware.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch(
  "/upgrade-role",
  verifyJwt,
  checkWriterEligibility,
  upgradeToWriter
);

export default router;
