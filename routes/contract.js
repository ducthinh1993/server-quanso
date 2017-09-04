var express = require('express');
var router = express.Router();
var Company = require('../models/Company.js');
var Log = require('../models/Log.js');

var config = require('../config');
var jwt = require('jsonwebtoken');

var User = require('../models/User.js');
var Contract = require('../models/Contract.js');

router.post("/", function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");	
	var userid = req.userid;
	User.findOne({_id:userid},function(err,user){
		if(err){
			res.json({success: false,message:"lỗi kết nối CSDL!"});
		}
		Contract.create({
			link_image: req.body.link_image,
			_id_company: user._id_company,
			_id_user_created: user._id,
			name_user_created: user.name,
		},function(err, contract){
			if(err){
				res.json({success: false,message:"lỗi kết nối CSDL!"});					
			}else if(!contract){
				res.json({success: false,message:"Tạo hợp đồng không thành công!"});					
			}else{
				res.json({success: true,message:"Tạo hợp đồng thành công!",data: contract});
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
            Contract.find({}).populate("_id_user_created",{}).exec(function(err,contract){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(contract);
          });
          }else{
            Contract.find({_id_company: idcompany}).populate("_id_user_created",{}).exec(function(err,contract){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(contract);
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
	Contract.findOne({_id: id},function(err, contract){
		if(err){
            res.json({success:false, message:"Lỗi kết nối!"});			
		}else if(contract){
              res.json({success:true, message:"ok", data:contract});			
		}else{
            res.json({success:false, message:"hợp đồng không tồn tại"});	
		}
	});
});

router.post('/delete',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
  Contract.findByIdAndRemove({_id: id},function(err, contract){
    if(err){
            res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(contract){
      res.json({success:true, message:"Xóa thành công"});
    }else{
            res.json({success:false, message:"hợp đồng không tồn tại"});  
    }
  });
});

module.exports = router;
