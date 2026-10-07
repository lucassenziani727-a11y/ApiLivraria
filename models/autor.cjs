'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Autor extends Model {
    
    static associate(models) {
      Autor.belongsToMany(models.Livro, { through: models.LivroAutor, foreignKey: 'autorId', as: 'livros' })
    }
  }
  Autor.init({
    nome: {type:DataTypes.STRING,
      allowNull: false
    },
    data_nascimento: {type:DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Autor',
    tableName: 'Autores'
  });
  return Autor;
};