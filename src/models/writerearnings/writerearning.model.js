// models/WriterEarning.js
const WriterEarning = (sequelize, DataTypes) => {
  const WriterEarning = sequelize.define(
    "WriterEarning",
    {
      earning_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      month: DataTypes.DATEONLY,
      total_reading_time: DataTypes.BIGINT, // in seconds
      earnings: DataTypes.DECIMAL(10, 2),
      paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    { timestamps: true }
  );

  WriterEarning.associate = (models) => {
    WriterEarning.belongsTo(models.User, {
      foreignKey: "writer_id",
      as: "writer",
    });
  };

  return WriterEarning;
};

export default WriterEarning;
