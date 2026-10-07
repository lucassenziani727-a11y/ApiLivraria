'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('RefreshTokens', {
      id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pessoaId:{
      type: Sequelize.INTEGER,
      allowNull: false,
      references:{model: 'Pessoas', key: 'id'},
      onDelete:'CASCADE'
      },
      tokenHash:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      expiresAt:{
        type: Sequelize.DATE,
        allowNull:false
      },
      revokedAt:{
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt:{ allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('RefreshTokens');
    await queryInterface.dropTable('RefreshToken');
  }
};
