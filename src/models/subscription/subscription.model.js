// models/Subscription.js
const Subscription = (sequelize, DataTypes) => {
  const Subscription = sequelize.define(
    "Subscription",
    {
      subscription_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      status: DataTypes.ENUM("active", "canceled", "expired"),
    },
    { timestamps: true }
  );

  Subscription.associate = (models) => {
    Subscription.belongsTo(models.User, { foreignKey: "user_id" });
    Subscription.belongsTo(models.Plan, { foreignKey: "plan_id" });
  };

  return Subscription;
};

export default Subscription;
