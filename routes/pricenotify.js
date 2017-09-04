var express = require('express');
var router = express.Router();
var Company = require('../models/Company.js');
var Log = require('../models/Log.js');

var config = require('../config');
var jwt = require('jsonwebtoken');

var User = require('../models/User.js');
var Pricenotify = require('../models/Pricenotify.js');

router.post("/", function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");	
	var userid = req.userid;
	User.findOne({_id:userid},function(err,user){
		if(err){
			res.json({success: false,message:"lỗi kết nối CSDL!"});
		}
		Pricenotify.create({
			link_image: req.body.link_image,
			_id_company: user._id_company,
			_id_user_created: user._id,
			name_user_created: user.name,
		},function(err, prno){
			if(err){
				res.json({success: false,message:"lỗi kết nối CSDL!"});					
			}else if(!prno){
				res.json({success: false,message:"Tạo Báo Giá không thành công!"});					
			}else{
				res.json({success: true,message:"Tạo Báo Giá thành công!",data: prno});
			}
		});	
	});
});

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
            Pricenotify.find({}).populate("_id_user_created",{}).exec(function(err,prno){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(prno);
          });
          }else{
            Pricenotify.find({_id_company: idcompany}).populate("_id_user_created",{}).exec(function(err,prno){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(prno);
          });
          }       
      }else
      res.json({ success: false, message: 'Lỗi bảo mật!'});
      }
    });
});

router.post('/item',function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
	var id = req.body.nt7_id;
	Pricenotify.findOne({_id: id},function(err, prno){
		if(err){
            res.json({success:false, message:"Lỗi kết nối!"});			
		}else if(prno){
              res.json({success:true, message:"ok", data:prno});			
		}else{
            res.json({success:false, message:"Báo giá không tồn tại"});	
		}
	});
});

router.post('/delete',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
  Pricenotify.findByIdAndRemove({_id: id},function(err, prno){
    if(err){
            res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(prno){
      res.json({success:true, message:"Xóa thành công"});
    }else{
            res.json({success:false, message:"Báo giá không tồn tại"});  
    }
  });
});

module.exports = router;
