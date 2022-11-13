'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
      sn: { 
        autoIncrement: true,
        unique: true,
        type: Sequelize.INTEGER
      
      },
      customer_id: {
           primaryKey: true,
          type: Sequelize.STRING
          
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      othernames: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        uniqueKey:true
      },
      is_email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      phone_number: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null
      },
      is_phone_number_verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      house_number: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      street: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      landmark: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      local_govt: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      dob: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      nin: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      is_nin_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: null
      },
      bvn: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: null
       },
      is_bvn_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: null
       },
    country: {
        type: Sequelize.STRING,
        defaultValue: null
    },
        state_origin: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        local_govt_origin: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        means_of_id: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        means_of_id_number: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        is_means_of_id_number_verified: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        photo: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        photo: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        marital_status: {
            type: Sequelize.STRING,
            defaultValue: null
        },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password_salt: {
        type: Sequelize.STRING,
        allowNull: false,
        },
        is_disable: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        is_disable_reason: {
            type: Sequelize.TEXT,
            defaultValue: null
        },
        createdAt: { //createdAt
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: { //updatedAt
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    })
  },
   
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customers');
  }
};