const { wallet } = require('../models')
const { v4: uuidv4 } = require('uuid')


const createWallet = (wallet_type, currency='NGN', customer_id) => {

console.log("here")
    return wallet.create({
        wallet_id: uuidv4(),
        wallet_type: wallet_type, //1 = spend, 2 = save, 3 = borrow
        balance: 0.00,
        currency: currency,
        customer_id: customer_id
    })
}


module.exports = { createWallet }