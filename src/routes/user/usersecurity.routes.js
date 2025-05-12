// routes/security.route.js
import express from "express";
import {
  getSecurity,
  updateSecurity,
} from "../../controllers/user/user.controller.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJwt);
router.get("/", getSecurity);
router.patch("/", updateSecurity);

export default router;
