const express = require('express');
const router = express.Router();
const {register,verifyEmailOtpAndSendPhoneOtp} = require('../controllers/customer.controller')


router.post('/register', register)

router.get('/verify-email-otp/:_otp/:email/:phone', verifyEmailOtpAndSendPhoneOtp)
module.exports = router;