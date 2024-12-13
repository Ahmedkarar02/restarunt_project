module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('OrderItems', 'menuId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Menus',
        key: 'id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('OrderItems', 'menuId');
  },
};
