'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Order, { foreignKey: 'userId' });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Add unique constraint
      },
      password: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
