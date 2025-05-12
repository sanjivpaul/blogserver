import { UserProfile } from "../models/index.js";

// middlewares/eligibility.middleware.js
export const checkWriterEligibility = async (req, res, next) => {
  const profile = await UserProfile.findOne({
    where: { user_id: req.user.user_id },
  });

  if (!profile?.bio || !profile?.profile_image_url) {
    return res.status(403).json({
      success: false,
      message: "Complete profile (bio + profile image) to become a writer",
    });
  }

  next();
};
