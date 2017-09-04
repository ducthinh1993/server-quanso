var express = require('express');
var router = express.Router();
var config = require('../config');
var jwt = require('jsonwebtoken');

var User = require('../models/User.js');
var Log = require('../models/Log.js');

router.post("/list",function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
	var secret = req.body.secret;
	var userid = req.userid;
    User.findOne({_id:userid},{_id_company: 1,supper:1},function(err,userkey){
      if(err){
        res.json({success:false, message:"Lỗi hệ thống!"});
      }else{
        var idcompany = userkey._id_company;
        if(secret == config.secret){
          if(userkey.supper==1){
            Log.find({},function(err,log){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(log);
          });
          }else{
            Log.find({_id_company: idcompany},function(err,log){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(log);
          });
          }       
      }else
      res.json({ success: false, message: 'Lỗi bảo mật!'});
      }
    });
});
router.post("/category",function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
	var key = req.body.nt7_key;
	var secret = req.body.secret;
	var userid = req.userid;
    User.findOne({_id:userid},{_id_company: 1,supper:1},function(err,userkey){
      if(err){
        res.json({success:false, message:"Lỗi hệ thống!"});
      }else{
        var idcompany = userkey._id_company;
        if(secret == config.secret){
          if(userkey.supper==1){
            Log.find({type:key},function(err,log){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(log);
          });
          }else{
            Log.find({$and:[{_id_company: idcompany},{type:key}]},function(err,log){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(log);
          });
          }       
      }else
      res.json({ success: false, message: 'Lỗi bảo mật!'});
      }
    });
});
module.exports = router;

module.exports = router;