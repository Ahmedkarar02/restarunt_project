'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    static associate(models) {
      Menu.hasMany(models.OrderItem, { foreignKey: 'menuId' });
      
    }
  }
  Menu.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      description: DataTypes.STRING,
      price: { type: DataTypes.FLOAT, allowNull: false },
      category: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Menu',
    }
  );
  return Menu;
};
