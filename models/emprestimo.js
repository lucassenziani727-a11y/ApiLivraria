'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Emprestimo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    Emprestimo.belongsTo(models.Pessoa, {foreignKey: 'pessoaId'});
    Emprestimo.belongsTo(models.Livro, {foreignKey: 'livroId'})
    }
  }
  Emprestimo.init({
    data_emprestimo: DataTypes.DATE,
    devolucao_prevista: DataTypes.DATE,
    devolucao_real: DataTypes.DATE,
    status: DataTypes.STRING,
    pessoaId: DataTypes.INTEGER,
    livroId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Emprestimo',
  });
  return Emprestimo;
};