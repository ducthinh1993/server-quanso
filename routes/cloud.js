var express = require('express');
var router = express.Router();
var request = require('request');

module.exports =  function(type,mess,key,val,token){
  	var serverKey = "AAAAR5Bv4M0:APA91bFO98qkRmnH1NBtvxgtNKxoVUvkWZhCp1XSiPvOZmi0QrrZgUzHK3rPlS0SS5Dth1vZfApIMqLAn6OfUemjbwtzTmhCrRkZcXALr1KPo2R1afmriUGyDPGnz7F8emNFlYHI2ziU";
    // var clientToken= "c3SxhTV9wy8:APA91bFsl7ZwukPvp37MkNyKd1RLj2QZ37WRk6zKQjSGvprM4FcpBinnmZQwdfGFSbXkuOVnh99Wmxh0zY-CltOE9md8P5Tu3BRQCRz-hPlzfGA42HFhnMze2-RIbkwLwKK8nxoWSkI3"
    // var clientToken = "fLAnj4rgNBA:APA91bFjM9CsS1z_MhP08Bp0CBrysN9fxuTH25jbZUsHvFXg4AA8jLxYUzafuKMBS6RFPGlcHqGSd6bUF9uN0g52_m_vCdymQI2AG-XgbYVg9s0sK30FEDAlisJjWI7Po3rtlvEUuyIy";
    // Payload message data
    // var deviceId = req.query.deviceId;
    // var eventName = req.query.eventName;
    // var value = req.query.value;

    var options = {
      url: 'https://fcm.googleapis.com/fcm/send',
      headers: {
        'Authorization': 'key=' + serverKey
      },
      json: {
        "to": token,
        "data": {
            type: type,
            key: key,
            value: val,
            title: "NT7solution!",
            body: mess,
            icon: "https://nt7solution.com/public/img/logoNT7solution.png",
            click_action: "https://nt7solution.com",
        },
        'notification': {
             title: "NT7solution!",
             body: mess,
             icon: "https://nt7solution.com/public/img/logoNT7solution.png",
             click_action: "https://nt7solution.com",
           },
      }
    };

    request.post(options, function optionalCallback(err, httpResponse, body) {
        
      if (err) {
        return console.error('ERROR - FIREBASE POST failed:', err);
      }
      
      console.log("send notify ok");
      console.log(token);
        
    });
    
}