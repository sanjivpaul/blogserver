import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const User = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      role: {
        type: DataTypes.ENUM("user", "writer", "admin"),
        defaultValue: "user",
        validate: {
          isIn: [["user", "writer", "admin"]], // Explicit validation
        },
      },
      //   stripe_customer_id: DataTypes.STRING,
      last_login: DataTypes.DATE,
      //   social_links: DataTypes.JSONB,
      //   preferences: DataTypes.JSONB, // e.g., { notifications: true, theme: "dark" }
    },
    {
      paranoid: true, // Enables soft deletes (adds 'deleted_at')
      timestamps: true, // Adds 'created_at' and 'updated_at'
      indexes: [{ unique: true, fields: ["email"] }, { fields: ["role"] }],
    }
  );

  // Hook to hash password before saving
  User.beforeCreate(async (user, options) => {
    if (user.password_hash) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(user.password_hash, salt);
    }
  });

  User.beforeUpdate(async (user, options) => {
    if (user.changed("password_hash")) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(user.password_hash, salt);
    }
  });

  // Instance method to compare passwords
  User.prototype.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password_hash);
  };

  // Instance method to generate access token
  User.prototype.generateAccessToken = function () {
    return jwt.sign(
      {
        user_id: this.user_id,
        email: this.email,
        role: this.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
  };

  // Instance method to generate refresh token
  User.prototype.generateRefreshToken = function () {
    return jwt.sign(
      {
        user_id: this.user_id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
  };

  // Associations defined inside the model
  User.associate = (models) => {
    User.hasOne(models.UserProfile, {
      as: "userProfile",
      foreignKey: "user_id",
    });
    User.hasOne(models.UserSecurity, {
      as: "UserSecurity",
      foreignKey: "user_id",
    });
    User.hasOne(models.UserPreferences, {
      as: "userPreferences",
      foreignKey: "user_id",
    });
    User.hasMany(models.Article, { foreignKey: "author_id" });
    User.hasMany(models.Tag, { as: "author", foreignKey: "tag_id" });
    User.hasMany(models.Comment, { foreignKey: "user_id" });
    User.hasMany(models.Clap, { foreignKey: "user_id" });
    User.hasMany(models.Subscription, { foreignKey: "user_id" });
  };

  return User;
};

export default User;
