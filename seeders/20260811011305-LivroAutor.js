'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
      await queryInterface.bulkInsert('LivroAutores', [
        {livroId: 1, autorId: 1, createdAt: new Date(), updatedAt: new Date()},
        {livroId: 1, autorId: 2, createdAt: new Date(), updatedAt: new Date()},
        {livroId: 2, autorId: 1, createdAt: new Date(), updatedAt: new Date()}], {});
    
  },

  async down (queryInterface, Sequelize) {

      await queryInterface.bulkDelete('LivroAutores', null, {});
    
  }
};
