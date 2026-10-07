'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pessoa extends Model {
    
    static associate(models) {
      Pessoa.hasMany(models.Emprestimo,{foreignKey: 'pessoaId'})
      Pessoa.hasMany(models.RefreshToken, { foreignKey: 'pessoaId', onDelete: 'CASCADE' });
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
    },
    email: {type:DataTypes.STRING, 
      allowNull:false, 
      unique:true},
    senha: {type:DataTypes.STRING,
      allowNull:false
    }  
  }, {
    sequelize,
    modelName: 'Pessoa',
    defaultScope:{
      attributes: {exclude: ['senha']}
    },
    scopes:{
      comSenha:{
        attributes:{}
      }
    }
  });
  return Pessoa;
};