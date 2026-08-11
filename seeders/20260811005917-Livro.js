'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert('Livros', 
        [{titulo: 'Senhor dos Aneis', ano_lancamento: 2000, genero: 'Ação', status: 'Alugado', createdAt: new Date(), updatedAt: new Date()},
        {titulo: 'Hary Potter', ano_lancamento: 2004, genero: 'Mistério', status: 'Pendente', createdAt: new Date(), updatedAt: new Date()}
        ], {});
  },

  async down (queryInterface, Sequelize) {
 
    await queryInterface.bulkDelete('Livros', null, {});
  }
};
