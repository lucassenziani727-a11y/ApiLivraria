'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Livro extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Livro.hasMany(models.Emprestimo, {foreignKey: 'livroId'});
      Livro.belongsToMany(models.Autor, {through: models.LivroAutor, foreignKey: 'livroId', as:'autores'})
    }
  }
  Livro.init({
    titulo: {type:DataTypes.STRING,
      allowNull: false
    },
    ano_lancamento: {type:DataTypes.INTEGER,
      allowNull: false
    },
    genero:{type:DataTypes.STRING,
      allowNull: false
    },
    status:{type:DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Livro',
  });
  return Livro;
};