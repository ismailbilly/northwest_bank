const express = require('express');
const displayRoutes =require('express-routemap')
const registerRoute = require('./routes/customer.route')
const app = express();

const port = process.env.PORT || 3000;
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(registerRoute)

app.listen(port, ()=>{console.log('Server is Running')})
displayRoutes(app)