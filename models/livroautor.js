'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LivroAutor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LivroAutor.init({
    livroId: DataTypes.INTEGER,
    autorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LivroAutor',
    tableName: 'Livroautores'
  });
  return LivroAutor;
};