'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Autor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Autor.belongsToMany(models.Livro, { through: models.LivroAutor, foreignKey: 'autorId', as: 'livros' })
    }
  }
  Autor.init({
    nome: DataTypes.STRING,
    data_nascimento: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Autor',
    tableName: 'Autores'
  });
  return Autor;
};