const { customer, otp } = require('../models'); 
const { createAccountNumber } = require('./account.controller')
const { createWallet } =require('./wallet.controller')
const {v4: uuidv4} =require('uuid')
const {Op}= require('sequelize')
const {registerValidation} = require('../validations/register.validation')
const {updateValidation} = require('../validations/update.validation')
const  {hashMyPassword, generateOtp} = require('../utils/index')
const { sendEmail } = require('../services/email')
const { sendSms } =require('../services/sms')

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
                    //console.log(createCustomerdata)
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
                }).then((data3)=>{
                    sendEmail(email, 'OTP', ` Hello  ${surname} ${othernames},\n Your OTP is ${_otp}`)

                    res.status(200).send({
                        status: true,
                        message: 'Registration successful, An otp has been sent to your email'
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

const verifyEmailOtpAndSendPhoneOtp= ((req,res)=>{
    const phone_otp = generateOtp()
    const {email, phone, _otp} = req.params
    try {
        return otp.findAll({
            where:{
                email:email,
                otp:_otp
            },
            attributes: [ 'otp', 'email', 'phone', 'createdAt'],
        }).then(otpDataFetched=>{
            if (otpDataFetched.length == 0) throw new Error('Invalid OTP')
            console.log("otpdataFetched: ", otpDataFetched[0])

            const timeOtpWasSent = Date.now() - new Date(otpDataFetched[0].dataValues.createdAt)
        
            const convertToMin = Math.floor(timeOtpWasSent / 60000) // 60000 is the number of milliseconds in a minute

            if (convertToMin > process.env.OTPExpirationTime) throw new Error('OTP has expired')

            return customer.update({ is_email_verified: true }, {
                where: {
                  email: email
                }
        })
    }).then((emailverifiedData) => { 
        return otp.destroy({
            where: {
                otp: _otp,
                email: email
            }
        })
    })
    .then((data3) => { 

        return otp.create({
            otp: phone_otp,
            phone: phone,
            email: email
        })
       
    }) .then((data4) => {
            
        //send an otp to the phone number
        sendSms(phone, `Hello, your otp is ${phone_otp}`)
        sendEmail(email, 'Email Verification Successful', ` Hello  ${email},\n Thank you for verifying your email. An otp has been sent to your phone number, kindly use this otp to also verify your phone number`)

    })
     .then((data5) => {
        res.status(200).send({
            status: true,
            message: 'Email verification successful, An otp has been sent to your phone number'
        })
    }).catch((err) => {
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
})

const verifyPhoneOtp = (req, res) => { 

    const { phone, phone_otp } = req.params
    try {
        otp.findAll({
            where: {
                phone: phone,
                otp: phone_otp
            },
            attributes: [ 'otp', 'phone', 'createdAt'], 
        })
        .then((otpDataFetched) => {
            if (otpDataFetched.length == 0) throw new Error('Invalid OTP')

            const timeOtpWasSent = Date.now() - new Date(otpDataFetched[0].dataValues.createdAt)
        
            const convertToMin = Math.floor(timeOtpWasSent / 60000) // 60000 is the number of milliseconds in a minute

            if (convertToMin > process.env.OTPExpirationTime) throw new Error('OTP has expired')

            return customer.update({ is_phone_number_verified: true }, {
                where: {
                    phone_number: phone
                }
              })
            

        
        })
        .then((phoneverifiedData) => { 
            return otp.destroy({
                where: {
                    otp: phone_otp,
                    phone: phone
                }
            })
        })
        .then((data5) => {
                res.status(200).send({
                    status: true,
                    message: 'Phone successfuly verified. Welcome onboard'
                })
        })
        .catch((err) => {
            res.status(400).json({
                status: false,
                message: err.message || "Some error occurred"
            })
        })
        
    } catch (err) {
        res.status(400).json({
            status: false,
            message: err.message || "Some error occurred"
        })

    }

}

const resendPhoneOtp = async (req, res) => {

    const { phone } = req.params
    const newOtp = generateOtp()

    try { 

        const findOtpWithPhone =   await otp.findAll({ where: { phone: phone } })
        
        if (findOtpWithPhone.length == 0) throw new Error('Phone number does not exist')
   
        await otp.destroy({  where: {  phone: phone } })

        await otp.create({ otp: newOtp, phone: phone })
        
        sendSms(phone, `Hello, your new otp is ${newOtp}`)

        res.status(200).send({
            status: true,
            message: 'otp resent to phone number'
        })


        // otp.findAll({
        //     where: {
        //         phone: phone
        //     }
        // })
        // .then(data => {
        //         if (data.length == 0) throw new Error('Phone number does not exist')
              
        //     return otp.destroy({
        //             where: {
        //                 phone: phone
        //             }
        //     })
        // })
        // .then(data2 => {

        //         return otp.create({
        //             otp: newOtp,
        //             phone: phone
        //         })
        //     })
        // .then(data3 => { 
        //         sendSms(phone, `Hello, your new otp is ${newOtp}`)
        //         res.status(200).send({
        //             status: true,
        //             message: 'otp resent to  phone number'
        //         })
        // })

    } catch (e) {
        res.status(400).json({
            status: false,
            message: e.message || "Some error occurred"
        })
    }




}

const resendEmailOtp = async (req, res) => {

    const { email } = req.params
    const newOtp = generateOtp()

    try { 

        const findOtpWithEmail =   await otp.findAll({ where: { email: email } })
        
        if (findOtpWithEmail.length == 0) throw new Error('Email does not exist')
   
        await otp.destroy({  where: {  email: email } })

        await otp.create({ otp: newOtp, email: email })
        
        sendEmail(email, 'RESEND OTP', `Hello, your new otp is ${newOtp}`)  

        res.status(200).send({
            status: true,
            message: 'otp resent to email'
        })


     

    } catch (e) {
        console.log(e)
        res.status(400).json({
            status: false,
            message: e.message || "Some error occurred"
        })
    }




}


const updateCustomer = async (req, res) => {  
    // joi validation
const { error, value } = updateValidation(req.body)

if (error != undefined) {
      
    res.status(400).json({
        status: false,
        message: error.details[0].message
    })
} else {
    const { customer_id } = req.params
    const { title, lastname, othernames, gender, house_number, street, landmark, local_govt, dob,
        country, state_origin, local_govt_origin, means_of_id, means_of_id_number, photo,
        marital_status } = req.body

    try {

        await customer.update({
            title: title,
            lastname: lastname,
            othernames: othernames,
            gender: gender,
            house_number: house_number,
            street: street,
            landmark: landmark,
            local_govt: local_govt,
            dob: dob,
            country: country,
            state_origin: state_origin,
            local_govt_origin: local_govt_origin,
            means_of_id: means_of_id,
            means_of_id_number: means_of_id_number,
            marital_status: marital_status
        }, { where: { customer_id: customer_id } })

        res.status(200).send({
            status: true,
            message: 'Customer updated successfully'
        })

    } catch (e) {
        res.status(400).json({
            status: false,
            message: e.message || "Some error occurred"
        })
    }
}


}

module.exports = {register, verifyEmailOtpAndSendPhoneOtp, verifyPhoneOtp,
    resendPhoneOtp, resendEmailOtp, updateCustomer}