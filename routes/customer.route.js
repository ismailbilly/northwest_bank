const express = require('express');
const router = express.Router();
const {register} = require('../controllers/customer.controller')


router.post('/register', register)


module.exports = router;