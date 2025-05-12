const TagFollow = (sequelize, DataTypes) => {
  const TagFollow = sequelize.define(
    "TagFollow",
    {
      created_at: DataTypes.DATE,
    },
    {
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["user_id", "tag_id"],
        },
      ],
    }
  );

  return TagFollow;
};
