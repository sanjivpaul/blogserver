import express from "express";
import {
  subscriptionValidationReceipt,
  validateIOSPurchase_test,
} from "../../controllers/subscription/subscription.controller.js";

const router = express.Router();

router.post("/validateiosreceipt/v1", subscriptionValidationReceipt);
router.post("/validateiosreceipt/v2", validateIOSPurchase_test);

export default router;
