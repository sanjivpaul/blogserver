// models/UserProfile.js

const UserProfile = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define(
    "UserProfile",
    {
      user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: "Users",
          key: "user_id",
        },
      },
      username: {
        type: DataTypes.STRING(50),
        unique: true,
      },
      bio: DataTypes.TEXT,
      profile_image_url: DataTypes.STRING,
    },
    {
      timestamps: false, // Profile doesn't need its own timestamps
    }
  );

  UserProfile.associate = (models) => {
    UserProfile.belongsTo(models.User, { foreignKey: "user_id" });
  };
};

export default UserProfile;
