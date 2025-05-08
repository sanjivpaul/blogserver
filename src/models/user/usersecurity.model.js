// models/UserSecurity.js
export default (sequelize, DataTypes) => {
  return sequelize.define(
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
};
