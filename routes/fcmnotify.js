var FCM = require('fcm-node');
var express = require('express');
var router = express.Router();
var FCM = require('fcm').FCM;
var request = require('request');

var notify = require('./cloud.js');

router.post('/',function(req,res){
    var serverKey = 'AIzaSyC5JXbR_LQt_EDRIldLXstQEoxY9oZulUc'; //put your server key here 
    var fcm = new FCM(serverKey);
 
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera) 
        // to: 'c3SxhTV9wy8:APA91bFsl7ZwukPvp37MkNyKd1RLj2QZ37WRk6zKQjSGvprM4FcpBinnmZQwdfGFSbXkuOVnh99Wmxh0zY-CltOE9md8P5Tu3BRQCRz-hPlzfGA42HFhnMze2-RIbkwLwKK8nxoWSkI3', 
        // collapse_key: 'demopushnt7.appspot.com',
        // category : 'demopushnt7.firebaseapp.com',
        to: '/topics/matchday',
        
        notification: {
             title: "NT7solution!",
             body: "Thay đổi dòng tiền",
             icon: "https://nt7solution.com/public/img/logoNT7solution.png",
             click_action: "https://nt7solution.com",
           },
        // to: 'eF4-HR-ij6o:APA91bE6xiGB74yf5LFvWACfz9WFP5-VwZI-tdK2tIsI8iktebVJOo3lSi3hk0P-4jJKSUEHrWTMjPoHoo5veVMoU44S_fzCYMM-N5p7TZwdF6wzUFpazSplRpIto5GiL64I4UCV2fqX', 
           
    };
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log(err);
            res.json({mes:"lỗi", err: err});
        } else {
            console.log("Successfully sent with response: ", response);
            res.json({mes:"ok"});

        }
    });
});
router.post('/k',function(req,res){
    // Firebase auth key
    var serverKey = "AIzaSyC5JXbR_LQt_EDRIldLXstQEoxY9oZulUc";
    var clientToken= "c3SxhTV9wy8:APA91bFsl7ZwukPvp37MkNyKd1RLj2QZ37WRk6zKQjSGvprM4FcpBinnmZQwdfGFSbXkuOVnh99Wmxh0zY-CltOE9md8P5Tu3BRQCRz-hPlzfGA42HFhnMze2-RIbkwLwKK8nxoWSkI3"

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
        "to": clientToken,
        "data": {
            deviceId: "deviceId",
            eventName: "eventName",
            value: "value"
        },
        'notification': {
             title: "NT7solution!",
             body: "Có công việc mới được tạo!",
             icon: "https://nt7solution.com/public/img/logoNT7solution.png",
             click_action: "https://nt7solution.com",
           },
      }
    };

    request.post(options, function optionalCallback(err, httpResponse, body) {
        
      if (err) {
        return console.error('ERROR - FIREBASE POST failed:', err);
      }
      
      // console.log("ok");
      res.json({success: true, message:"ok"});
        
    });
});
router.post('/ts',function(req,res){
  var type = "work";
  var mess = "Công việc mới";
  var key = "sdadfsadfsa";
  var val = "val";
  notify(type,mess,key,val);
  res.json({success: true, message:"ok"});

});
module.exports = router;