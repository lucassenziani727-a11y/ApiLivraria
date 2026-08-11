'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

      await queryInterface.bulkInsert('Emprestimos', [{data_emprestimo: '2026-09-10', devolucao_prevista:'2026-09-17',devolucao_real: null, status:'Em andamento', pessoaId:1,livroId:1, createdAt: new Date(), updatedAt: new Date() },
        {data_emprestimo: '2026-09-15', devolucao_prevista:'2026-09-22',devolucao_real: null, status:'Em andamento', pessoaId:2,livroId:2, createdAt: new Date(), updatedAt: new Date() }
      ], {});
    
  },

  async down (queryInterface, Sequelize) {

      await queryInterface.bulkDelete('Emprestimos', null, {});
     
  }
};
