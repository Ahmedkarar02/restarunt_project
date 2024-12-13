'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MenuItem extends Model {
    static associate(models) {
      MenuItem.hasMany(models.OrderItem, { foreignKey: 'menuItemId' });
    }
  }
  MenuItem.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.DECIMAL,
      category: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'MenuItem',
    }
  );
  return MenuItem;
};
