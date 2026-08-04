'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Emprestimos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      data_emprestimo: {
        type: Sequelize.DATE
      },
      devolucao_prevista: {
        type: Sequelize.DATE
      },
      devolucao_real: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING
      },
      pessoaId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Pessoas',
          key: 'id'
        },
        onDelete: 'RESTRICT'
      },
      livroId: {
        type: Sequelize.INTEGER,
        references:{
          model:'Livros',
          key:'id'
        },
        onDelete: 'RESTRICT'
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
    await queryInterface.dropTable('Emprestimos');
  }
};