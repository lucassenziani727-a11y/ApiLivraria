'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('Autores', [
        {nome: 'John Doe', data_nascimento:'1902-08-21', createdAt: new Date(), updatedAt: new Date()},
        {nome: 'Jane Doe',data_nascimento: '1903-09-22', createdAt: new Date(), updatedAt: new Date()}
      ], {});
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('Autores', null, {});
     
  }
};
