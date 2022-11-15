'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  wallet.init({
    sn: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    wallet_id: DataTypes.STRING,
    wallet_type: DataTypes.ENUM(1, 2, 3),
    balance: DataTypes.DECIMAL,
    currency: DataTypes.ENUM('NGN', 'USD'),
    customer_id: DataTypes.STRING,
   
  }, {
    sequelize,
    modelName: 'wallet',
  });
  return wallet;
};