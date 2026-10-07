'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {
      RefreshToken.belongsTo(models.RefreshToken, {foreignKey: 'pessoaId', onDelete: 'CASCADE'});
    }
  }
  RefreshToken.init({
    pessoaId: {type:DataTypes.INTEGER,
      allowNull: false
    },
    tokenHash: {type:DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    expiresAt: {type:DataTypes.DATE,
      allowNull: false
    },
    revokedAt:{
      type:DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'RefreshToken',
  });
  return RefreshToken;
};