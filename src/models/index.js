import sequelize from "../db/index.js";
import { DataTypes } from "sequelize";

import initUserModel from "./user/user.model.js";
import initUserProfileModel from "./user/userprofile.model.js";
import initUserSecurityModel from "./user/usersecurity.model.js";
import initUserPreferencesModel from "./user/user.preferences.model.js";
import initArticleModel from "./article/article.model.js";
import initTagModel from "./Tag/tag.model.js";
import initArticleTagModel from "./Tag/articletag.model.js";
import initCommentModel from "./comment/comment.model.js";
import initClapModel from "./clap/clap.model.js";
import initPlanModel from "./plan/plan.model.js";
import initSubscriptionModel from "./subscription/subscription.model.js";
import initWriterEarningModel from "./writerearnings/writerearning.model.js";

// Initialize models
const User = initUserModel(sequelize, DataTypes);
const UserProfile = initUserProfileModel(sequelize, DataTypes);
const UserSecurity = initUserSecurityModel(sequelize, DataTypes);
const UserPreferences = initUserPreferencesModel(sequelize, DataTypes);
const Article = initArticleModel(sequelize, DataTypes);
const Tag = initTagModel(sequelize, DataTypes);
const ArticleTag = initArticleTagModel(sequelize, DataTypes);
const Comment = initCommentModel(sequelize, DataTypes);
const Clap = initClapModel(sequelize, DataTypes);
const Plan = initPlanModel(sequelize, DataTypes);
const Subscription = initSubscriptionModel(sequelize, DataTypes);
const WriterEarning = initWriterEarningModel(sequelize, DataTypes);

// Define associations
// User.associate({ UserProfile, UserSecurity, UserPreferences, Article, Comment, Clap });
// UserProfile.associate({ User });
// UserSecurity.associate({ User });
// UserPreferences.associate({ User });
// Article.associate({ User, Comment, Clap });
// Comment.associate({ User, Article });
// Clap.associate({ User, Article });

export {
  User,
  UserProfile,
  UserSecurity,
  UserPreferences,
  Article,
  Tag,
  ArticleTag,
  Comment,
  Clap,
  Plan,
  Subscription,
  WriterEarning,
};
