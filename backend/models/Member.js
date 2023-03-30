const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('member', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    account: {
      type: DataTypes.STRING(24),
      allowNull: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    salt: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    image: {
      type: DataTypes.BLOB,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'member',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "member_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
