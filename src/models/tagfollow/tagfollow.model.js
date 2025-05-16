// models/TagFollow.js

const TagFollow = (sequelize, DataTypes) => {
  const TagFollow = sequelize.define(
    "TagFollow",
    {
      user_id: {
        type: DataTypes.UUID, // ✅ Match User's UUID PK
        allowNull: false,
      },
      tag_id: {
        type: DataTypes.UUID, // ✅ Match Tag's UUID PK
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
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

  TagFollow.associate = (models) => {
    TagFollow.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
    TagFollow.belongsTo(models.Tag, {
      foreignKey: "tag_id",
      as: "tag", // <--- This is key
      onDelete: "CASCADE",
    });
  };

  return TagFollow;
};

export default TagFollow;
