
'use strict';

const { hash } = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const senhaLucas = await hash('Lucas123!', 10);
    const senhaIsabelle = await hash('Isabelle123!', 10);

    await queryInterface.bulkInsert('Pessoas', [
      {
        nome: 'Lucas',
        cpf: '12345127689',
        telefone: '429429-000',
        email: 'lucas.teste@example.com',
        senha: senhaLucas,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Isabelle',
        cpf: '43214432134',
        telefone: '429323-000',
        email: 'isabelle.teste@example.com',
        senha: senhaIsabelle,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Pessoas', {
      email: [
        'lucas.teste@example.com',
        'isabelle.teste@example.com'
      ]
    }, {});
  }
};