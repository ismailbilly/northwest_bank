'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  customer.init({

    sn:{
      type: DataTypes.INTEGER,
      
  },
    customer_id: {   
      primaryKey: true,
      type: DataTypes.STRING
      
  },
    title: DataTypes.STRING,
    lastname: DataTypes.STRING,
    othernames: DataTypes.STRING,
    email: DataTypes.STRING,
    is_email_verified: DataTypes.BOOLEAN,
    phone_number: DataTypes.STRING,
    is_phone_number_verified: DataTypes.BOOLEAN,
    gender: DataTypes.STRING,
    house_number: DataTypes.STRING,
    street: DataTypes.STRING,
    landmark: DataTypes.STRING,
    local_govt:DataTypes.STRING,
    dob: DataTypes.STRING,
    nin: DataTypes.STRING,
    is_nin_verified: DataTypes.BOOLEAN,
    bvn: DataTypes.BOOLEAN,
    is_bvn_verified: DataTypes.BOOLEAN,
    country: DataTypes.STRING,
    state_origin: DataTypes.STRING,
    local_govt_origin: DataTypes.STRING,
    means_of_id: DataTypes.STRING,
    means_of_id_number: DataTypes.STRING,
    is_means_of_id_number_verified: DataTypes.STRING,
    photo: DataTypes.STRING,
    marital_status: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    password_salt:DataTypes.STRING,
    is_disable: DataTypes.BOOLEAN,
    is_disable_reason:DataTypes.TEXT,
     createdAt: { //createdAt
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: { //updatedAt
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    sequelize,
    modelName: 'customer',
  });
  return customer;
};