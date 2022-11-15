
require('dotenv').config()
const axios = require('axios');
const fetch = require('node-fetch')
var formData = require('form-data');


const sendSms = (phone, message) => { 

    let type = 0 //enums exist in docs 
    let routing = 3 //enums exist in docs 
    let bodyFormData = new formData()
    bodyFormData.append('token', process.env.SMS_TOKEN)
    bodyFormData.append('sender', process.env.SMS_SENDER)
    bodyFormData.append('to', phone)
    bodyFormData.append('message', message)
    bodyFormData.append('type', type)
    bodyFormData.append('routing', routing)
    // bodyFormData.append('ref_id', uuidv4())
    // bodyFormData.append('simserver_token', 'simserver-token');
    // bodyFormData.append('dlr_timeout', 'dlr-timeout');
    // bodyFormData.append('schedule', 'time-in-future');

    return fetch(`${process.env.SMS_API_BASE_URL}/sms/`, {
        body: bodyFormData,
        method: 'POST'
      })

}


module.exports = { sendSms }