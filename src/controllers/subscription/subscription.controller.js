import axios from "axios";
// 1. Environment Configuration (Production vs Sandbox)
const getValidationURL = (environment) => {
  return environment === "production"
    ? "https://buy.itunes.apple.com/verifyReceipt"
    : "https://sandbox.itunes.apple.com/verifyReceipt";
};

// 2. Receipt Status Mapping (Matches your Swift enum)
const ReceiptStatus = {
  unknown: -2,
  none: -1,
  valid: 0,
  jsonNotReadable: 21000,
  malformedOrMissingData: 21002,
  receiptCouldNotBeAuthenticated: 21003,
  secretNotMatching: 21004,
  receiptServerUnavailable: 21005,
  subscriptionExpired: 21006,
  testReceipt: 21007,
  productionEnvironment: 21008,

  getStatus: function (code) {
    return (
      Object.entries(this).find(([key, value]) => value === code)?.[0] ||
      "unknown"
    );
  },
};

const subscriptionValidationReceipt = async (req, res) => {
  const { purchaseToken } = req.body;
  //   console.log("purchaseToken===>", purchaseToken);

  try {
    // First try production environment
    let response = await validateWithApple(purchaseToken, "production");

    // Handle sandbox receipt in production environment case
    if (response.status === ReceiptStatus.testReceipt) {
      response = await validateWithApple(purchaseToken, "sandbox");
    }

    res.status(200).json({
      status: response.status,
      statusMessage: ReceiptStatus.getStatus(response.status),
      environment: response.environment,
      latestReceiptInfo: response.latest_receipt_info,
      pendingRenewalInfo: response.pending_renewal_info,
    });
  } catch (error) {
    console.error("Error validating receipt:", error);
    res.status(500).json({
      status: ReceiptStatus.unknown,
      statusMessage: "validation_failed",
      error: error.message,
    });
  }
};

// Helper function for Apple communication
async function validateWithApple(receiptData, environment) {
  const payload = {
    "receipt-data": receiptData,
    // password: process.env.APPLE_SHARED_SECRET,
    password: "e37b307f8e084f1d9e046ed90ea70f29",
    "exclude-old-transactions": true,
  };

  const { data } = await axios.post(getValidationURL(environment), payload, {
    timeout: 10000,
  });

  return {
    ...data,
    environment, // Track which environment was used
  };
}

const validateIOSPurchase_test = async (req, res) => {
  const { purchaseToken } = req.body;

  const payload = {
    "receipt-data": purchaseToken,
    password: "e37b307f8e084f1d9e046ed90ea70f29",
    "exclude-old-transactions": true,
  };

  try {
    // 1. Try Production endpoint first
    let response = await axios.post(
      "https://buy.itunes.apple.com/verifyReceipt",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // 2. If receipt is from Sandbox, retry with Sandbox endpoint
    if (response.data.status === 21007) {
      response = await axios.post(
        "https://sandbox.itunes.apple.com/verifyReceipt",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // 3. Return final response
    // return response.data;
    res.status(200).json({
      response: response.data,
    });
  } catch (error) {
    // Return error details for debugging/logging
    res.status(500).json({
      error: error.message,
    });
    // return error.response?.data || { error: error.message };
  }
};

export { subscriptionValidationReceipt, validateIOSPurchase_test };
