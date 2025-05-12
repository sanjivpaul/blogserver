// models/UserSecurity.js
export default (sequelize, DataTypes) => {
  const UserSecurity = sequelize.define(
    "UserSecurity",
    {
      user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: "Users",
          key: "user_id",
        },
      },
      password_reset_token: DataTypes.STRING,
      two_factor_secret: DataTypes.STRING,
      failed_login_attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      paranoid: true, // Optional soft deletes
    }
  );

  UserSecurity.associate = (models) => {
    UserSecurity.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user", // This must match what you use in the include
    });
  };

  return UserSecurity;
};
