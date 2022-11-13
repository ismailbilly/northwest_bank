'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('wallets', {
      sn: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      wallet_id: {
        type: Sequelize.STRING,
        unique: true
      },
      wallet_type: {
        type: Sequelize.ENUM('1', '2', '3'), //1- spent, 2-save, 3-borrow
      },
      balance: {
        type: Sequelize.DECIMAL(20, 2)
      },
      currency: {
        type: Sequelize.ENUM('NGN', 'USD')
      },
      customer_id: {
        type: Sequelize.STRING,
        references: {
          model: 'customers',
          key: 'customer_id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('wallets');
  }
};