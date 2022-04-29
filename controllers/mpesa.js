const axios = require('axios').default()
require('dotenv').config()


/* 
	Generate OAuth token
*/

class MpesaController {

	async getOAuthToken(req, res, next){

	let consumer_key = process.env.CONSUMER_KEY;
	let consumer_secret = process.env.CONSUMER_SECRET_KEY;
	let url = process.env.OAUTH_TOKEN_URL;

	// form a buffer for the consumer key and secret

	let buffer = new Buffer.from(consumer_key+":"+consumer_secret);

	//  encode buffer to base64 string
	let auth = `Basic ${buffer.toString('base64')}`;

	// Use try catch block to communicate with daraja API
	try{

		let {data} = await axios.get(url, {
			"headers": {
				"Authorization": auth
			}
		});

		// If request is successful, set token on request object then execute the next middleware  

		req.token = data['access_token'];

		return next();

		// else return error
	}catch(err){
		return res.send({
			success:false,
			message:err['response']['statusText']
		});
	};
};

/* 
	Core functionality
*/

    async lipaNaMpesaOnline(req,res){

        // access token stored on the request object
        let token = req.token;

        // append Bearer before the token to create an authorization string
        let auth = `Bearer ${token}`;       

        //getting the timestamp
        let timestamp = require('../middleware/timestamp').timestamp;

        // Get url, bs short_code and pass_key from env file
        let url = process.env.LIPA_NA_MPESA_URL;
        let bs_short_code = process.env.LIPA_NA_MPESA_SHORTCODE ;
        let passkey = process.env.LIPA_NA_MPESA_PASSKEY;

        // Get passwrd generated from the buffer containing bs short_code, timestamp and pass_key then encode it to base64
        let password = new Buffer.from(`${bs_short_code}${passkey}${timestamp}`).toString('base64');
        
        // Set the transaction type to "CustomerPayBillOnline"
        let transcation_type = "CustomerPayBillOnline";

        //you can enter x amount
        let amount = "1"; 

        // phone number sending the funds & should follow the format:2547xxxxxxxx
        let partyA = "0796927065";

        // business short code.
        let partyB = process.env.LIPA_NA_MPESA_SHORTCODE;
        let phoneNumber = "0796927065"; 

        let callBackUrl = "your-ngrok-url/mpesa/lipa-na-mpesa-callback";

        let accountReference = "lipa-na-mpesa-tutorial";
        let transaction_desc = "Testing lipa na mpesa functionality";

        try {

            let {data} = await axios.post(url,{
                "BusinessShortCode":bs_short_code,
                "Password":password,
                "Timestamp":timestamp,
                "TransactionType":transcation_type,
                "Amount":amount,
                "PartyA":partyA,
                "PartyB":partyB,
                "PhoneNumber":phoneNumber,
                "CallBackURL":callBackUrl,
                "AccountReference":accountReference,
                "TransactionDesc":transaction_desc
            },{
                "headers":{
                    "Authorization":auth
                }
            }).catch(console.log);

            return res.send({
                success:true,
                message:data
            });

        }catch(err){
            return res.send({
                success:false,
                message:err['response']['statusText']
            });
        };
    };

    lipaNaMpesaOnlineCallback(req,res){

        //Get the transaction description
        let message = req.body.Body.stkCallback['ResultDesc'];

        return res.send({
            success:true,
            message
        });
    };

};