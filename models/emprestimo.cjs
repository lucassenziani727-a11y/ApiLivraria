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
    data_emprestimo:{type:DataTypes.DATE,
      allowNull: false
    },
    devolucao_prevista:{type:DataTypes.DATE,
      allowNull: false
    },
    devolucao_real: DataTypes.DATE
    ,
    status: {type:DataTypes.STRING,
      allowNull: false
    },
    pessoaId: {type:DataTypes.INTEGER,
      allowNull: false
    },
    livroId: {type:DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Emprestimo',
  });
  return Emprestimo;
};