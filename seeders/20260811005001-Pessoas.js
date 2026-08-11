'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
 await queryInterface.bulkInsert('Pessoas', 
  [{ nome: 'Lucas', cpf: '12345127689', telefone: '429429-000', createdAt: new Date(), updatedAt: new Date()},
   {nome: 'Isabelle', cpf:'43214432134', telefone: '429323-000', createdAt: new Date(), updatedAt: new Date()}
  ], {});
  },

  async down (queryInterface, Sequelize) {
  
    await queryInterface.bulkDelete('Pessoas', null, {});
  }
};
