'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Pessoas', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    });
    await queryInterface.addColumn('Pessoas', 'senha', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    });
    await queryInterface.addIndex('Pessoas', ['email'], {
      unique: true,
      name: 'pessoas_email_unique'
    });
  },

  async down (queryInterface) {
    await queryInterface.removeIndex('Pessoas', 'pessoas_email_unique');
    await queryInterface.removeColumn('Pessoas', 'email');
    await queryInterface.removeColumn('Pessoas', 'senha');
  }
};
