var express = require('express');
var router = express.Router();
var gcm = require('node-gcm');
var constants = require('../constants.json');


router.post('/send',function(req,res){
	var message = req.body.message;
	var registrationId = req.body.registrationId;
	res.send(sendnotify(message,registrationId));
});

function sendnotify(message,registrationId){

	var message = new gcm.Message({data: {message: message}});
	var regTokens = [registrationId];
	var sender = new gcm.Sender(constants.gcm_api_key);
	sender.send(message, { registrationTokens: regTokens }, function (err, response) {

		if (err){

			console.error(err);
			return (constants.error.msg_send_failure);

		} else 	{

			console.log(response);
			return (constants.success.msg_send_success);
		}

	});

}

var FCM = require('fcm-node');
// var serverKey = 'AIzaSyDbTvny4gJVI67EDP17cM0Gcd1XXasNfbg';
var serverKey = 'AIzaSyA5e-cUOe785bgc6YNMHG2lhOXAr-oy-B8';
var fcm = new FCM(serverKey);
// var m1 = 'eB4893d2-Vc:APA91bHdGOVIK1W1tJckbLn2hQhgKePuOVXPR84nNDPqIvXN2pFzujzOhNetOtxQ67JFM7xm2VwpuDwjvP3acqYeRpDhRpDLec6wIn7XlGrbCDeupRErDExEjVrfuQJFSKHX7wMkN2Fh';
var m1 = 'ej7jS1yi-nQ:APA91bEoNyvUkMB2RuHqC8YyJMXe-q3ik94Udda0mQiigzjDcUcZRwGFvOtsc3W7kQjuAeUNLeOGVqn7D427FXQjSMeWdCL9jVLgA2P-ecc-WbgZl36vJF4ZihSmrz12YUzSxYp2b2BR';
var message = { 
	to: m1,
    //to: 'eB4893d2-Vc:APA91bHdGOVIK1W1tJckbLn2hQhgKePuOVXPR84nNDPqIvXN2pFzujzOhNetOtxQ67JFM7xm2VwpuDwjvP3acqYeRpDhRpDLec6wIn7XlGrbCDeupRErDExEjVrfuQJFSKHX7wMkN2Fh', 
    //to: 'dOxb67xBJ7s:APA91bHkfKtpmTKPGXEUkC031sWbk8_CdHs52zOgDPH0NSrSsOeXL3umXcjcWbcuZR1I_e30YTQ9nUnDxz7TOgHbGZWFUtq61QFlupfBhW0Ff-ZDt5nBqzPkj80X1K_sz3v2fDvSFVI7', 
    // category:"com.example.yourapp",
    notification: {
        title: 'Quán số - Zomo App', 
        body: 'Được gửi từ quán số.' 
    },
    
    data: {  
        type: 1,
        api: 'notify'
    }
};


router.post('/sendfcm1',function(req,res){
	fcm.send(message, function(err, response){
		if (err) {
		    console.log("notify err!");
		    res.json({success: 'error'});
		} else {
		    console.log("notify success", response);
		    res.json({success: 'ok'});
		}
	});
});
module.exports = router;