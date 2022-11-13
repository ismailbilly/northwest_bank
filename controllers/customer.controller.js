const { customer, otp } = require('../models'); 
const { createAccountNumber } = require('./account.controller')
const { createWallet } =require('./wallet.controller')
const {v4: uuidv4} =require('uuid')
const {Op}= require('sequelize')
const {registerValidation} = require('../validations/register.validation')
const  {hashMyPassword, generateOtp} = require('../utils/index')

const register  = (req,res)=>{
    //JOI Validating request body
   const {error, value} = registerValidation(req.body)
        if(error != undefined){
            res.status(400).json({
                status: false,
                message: error.details[0].message
            })
        }else{
            const { surname, othernames, email, phone, password, repeat_password}= req.body
            const customer_id = uuidv4()
            const _otp = generateOtp()

            try {// Check DB if user already exist
                customer.findAll({
                    where: {
                        [Op.or]: [
                            { email: email },
                            { phone_number: phone }
                        ]
                    }

                }).then((data)=>{
                  
                    if(data.length > 0) {throw new Error('Email or Phone already exist')}
                    return hashMyPassword(password)
                }).then(([hash,salt])=>{
                   
                    return  customer.create({//create the customers table
                                customer_id: customer_id,
                                lastname: surname,
                                othernames: othernames,
                                email: email,
                                phone_number: phone,
                                password_hash: hash,
                                password_salt: salt,
                    })
                  
                }).then((createCustomerdata)=>{
                    console.log(createCustomerdata)
                    const customer_fullname = `${surname} ${othernames}`
                    const sn = createCustomerdata.sn
                    return createAccountNumber(customer_id,customer_fullname,sn)   
            
                }).then(createWalletData=>{
                    return createWallet (1, 'NGN', customer_id)
                }).then(insertIntoOtpTable=>{
                    return otp.create({
                        otp: _otp,
                        email: email,
                        phone: phone,
                    })
                })
                .catch((err)=>{
                    res.status(400).json({
                        status: false,
                        message: err.message || "Some error occurred while verifying OTP."
                    })
                })
            } catch (error) {
                res.status(400).json({
                    status: false,
                    message: error.message || "Some error occurred while verifying OTP."
                })
            }
        }
   
}


module.exports = {register}