// models/Clap.js
const Clap = (sequelize, DataTypes) => {
  const Clap = sequelize.define(
    "Clap",
    {
      count: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: { min: 1 },
      },
    },
    { timestamps: true }
  );

  Clap.associate = (models) => {
    Clap.belongsTo(models.User, { foreignKey: "user_id" });
    Clap.belongsTo(models.Article, { foreignKey: "article_id" });
  };

  return Clap;
};

export default Clap;
