const express = require('express');

const router = express.Router();

// controllers
const mpesaController = require('../controllers/mpesa');


// route to get access token
router.get('/access_token', mpesaController.getOAuthToken);

// lipa na mpesa online
router.post('/lipa_na_mpesa', mpesaController.getOAuthToken, mpesaController.lipaNaMpesaOnline);

// lipa na mpesa callback
router.post('/lipa_na_mpesa-callback', mpesaController.lipaNaMpesaCallback);

module.exports = router;