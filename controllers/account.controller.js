const { account } = require('../models')

const generateAccountNumber = (sn) => { 
//000000DDYY 
let day = new Date().getDate()
let year = ((new Date().getFullYear()).toString()).slice(2) //give only the last 2 digits of the year
let others = sn.toString().padStart(6, '0') //completes to make 6 digits
    
 return `${others}${day}${year}`
}


const createAccountNumber = (customer_id, customer_fullname, sn) => {


    return account.create({
        account_number: generateAccountNumber(sn),
        account_name: customer_fullname,
        customer_id: customer_id,
        balance: 0.00,
        lien: 'none'
    })
}


module.exports = { createAccountNumber }