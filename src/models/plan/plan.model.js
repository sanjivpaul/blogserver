// models/Plan.js
const Plan = (sequelize, DataTypes) => {
  const Plan = sequelize.define(
    "Plan",
    {
      plan_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      price: DataTypes.DECIMAL(10, 2),
      duration: DataTypes.ENUM("monthly", "yearly"),
    },
    { timestamps: false }
  );

  return Plan;
};

export default Plan;
