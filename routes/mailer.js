var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var config = require('../config');

var smtpTransport = nodemailer.createTransport(smtpTransport({
    host : "smtp-mail.outlook.com",
    secureConnection : false,
    port: 587,
    auth : {
        user : config.mail.user,
        pass : config.mail.pass
    }
}));

router.get('/',function(req,res){
	var mailOptions={
        from: 'zomoapp@outlook.com',
		to: 'hoangnamg8@gmail.com',
		subject: 'Zomo App - Kích hoạt người dùng!',
		html: '<h3>Kích hoạt người dùng!</h3></br>Thân chào!</br><b><i>Click <a href="#">vào đây!</a> để kích hoạt </i></b></br>Đây là Mail hệ thống, vui lòng ko  trả lời Mail này!'
    };    
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            res.end("error");
        }else{
            console.log(response.response.toString());
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
});
module.exports = router;