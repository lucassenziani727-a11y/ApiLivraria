'use strict';
const { model } = require('mongoose');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pessoa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pessoa.hasMany(models.Emprestimo,{foreignKey: 'pessoaId'})
    }
  }
  Pessoa.init({
    nome: {type:DataTypes.STRING,
      allowNull: false
    },
    cpf: {type:DataTypes.STRING,
      allowNull: false
    },
    telefone: {type:DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Pessoa',
  });
  return Pessoa;
};