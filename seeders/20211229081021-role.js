'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'player',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const { sequelize } = queryInterface;
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await queryInterface.bulkDelete('roles', null, { truncate: true, restartIdentity: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
  }
};
