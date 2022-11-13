'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  account.init({
    account_number: DataTypes.STRING,
    account_name: DataTypes.STRING,
    customer_id: DataTypes.STRING,
    balance: DataTypes.DECIMAL,
    lien: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'account',
  });
  return account;
};