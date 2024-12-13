'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'userId' });
      Order.hasMany(models.OrderItem, { foreignKey: 'orderId' });
    }
  }
  Order.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
    },
    {
      sequelize,
      modelName: 'Order',
    }
  );
  return Order;
};
