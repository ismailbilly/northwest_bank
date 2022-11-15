require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendEmail = (receipientEmail, title, details) => {

    const msg = {
        to: receipientEmail, // Change to your recipient
        from: process.env.EMAIL_SENDER, // Change to your verified sender
        subject: title,
        text: details
      }
      
      sgMail
        .send(msg)
        .then((response) => {
         // console.log(response[0].statusCode)
         // console.log(response[0].headers)
        })
        .catch((error) => {
          console.error(error)
        })
}


module.exports = { sendEmail }