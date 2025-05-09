// models/UserPreferences.js
export default (sequelize, DataTypes) => {
  const UserPreferences = sequelize.define(
    "UserPreferences",
    {
      user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: "Users",
          key: "user_id",
        },
      },
      preferences: {
        type: DataTypes.JSON,
        defaultValue: {
          notifications: true,
          theme: "light",
        },
      },
      social_links: DataTypes.JSON,
    },
    {
      timestamps: false,
    }
  );

  return UserPreferences;
};
