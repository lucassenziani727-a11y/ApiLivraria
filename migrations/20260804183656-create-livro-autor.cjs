'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LivroAutores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      livroId: {
        type: Sequelize.INTEGER,
        references: {
        model: 'Livros',
        key: 'id'
        },
        onDelete: 'CASCADE'
      },
      autorId: {
        type: Sequelize.INTEGER,
        references: {
         model: 'Autores',
         key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('LivroAutores');
  }
};