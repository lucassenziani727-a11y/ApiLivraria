'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LivroAutor extends Model {
    
    static associate(models) {
      
    }
  }
  LivroAutor.init({
    livroId: {type:DataTypes.INTEGER,
      allowNull: false
    },
    autorId: {type:DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'LivroAutor',
    tableName: 'Livroautores'
  });
  return LivroAutor;
};