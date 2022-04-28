const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || process.env.APP_PORT;

//app configurations
app.use(express.json());

app.use(express.urlencoded({extended:false}));

//import route.js
const mpesa = require('./routes/route');

//listening for an mpesa route
app.use('/api',mpesa);


//listening for incoming requests on port.
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
});