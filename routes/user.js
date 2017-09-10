var express = require('express');
var router = express.Router();
var User = require('../models/User.js');
var Log = require('../models/Log.js');
var config = require('../config');
var jwt = require('jsonwebtoken');
var md5 = require('crypto-js/md5');
var sha256 = require('crypto-js/sha256');


// insert usert
router.post('/',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    var userid = req.userid;
    var idcompany = "";
    if(!req.body.nt7_id_company){
    	User.findOne({_id:userid},{_id_company:1},function(err,userkey){
	    	if(err){
		    	res.json({success:false, message:"Lỗi hệ thống!"});
	    	}else{
	    		idcompany = userkey._id_company;
	    	}
	    });
    }else{
    	idcompany = req.body.nt7_id_company;
    } 

    var email = req.body.nt7_email;
    User.findOne({ email: email }, function(err, user){
	  if(err) 
	    res.json({success:false, message:"Lỗi hệ thống!"});
	  if(!user){
	    User.create( {
		  name: req.body.nt7_name,
		  email: req.body.nt7_email,
		  address: req.body.nt7_address,
		  phone: req.body.nt7_phone,
		  cmnd: req.body.nt7_cmnd, 
		  comment: req.body.nt7_comment,
		  birthplace: req.body.nt7_birthplace,
		  birthday: req.body.nt7_birthday,
		  position: req.body.nt7_position,
		  image: req.body.nt7_image,
		  level:  req.body.nt7_level,
		  name_level:  req.body.nt7_name_level,
		  user: req.body.nt7_user,
		  pass:  sha256(md5(req.body.nt7_pass)),
		  lastip:  req.body.nt7_lastip,
		  // _id_company: req.body.nt7_id_company,
		  _id_company: idcompany,
		  _id_group: req.body.nt7_id_group,
	    }, function (err, user2){
	      if(err){                
	        res.json({success:false, message:"Không thể tạo mới nhân viên"});
	      }
	      else{
	        // var token = jwt.sign({ key: user2._id, tid: now }, config.secret);
	        // res.json({ success: true, message: 'Authentication success.', token: token, id: user2._id, name: user2.name, info: user2.info, lastip: user2.lastip, lastlogin: user2.lastlogin });
	        res.json({ success: true, message: 'Đăng kí thành công!'});
	      }
	      
	    });
	  }else{
	     res.json({ success: false, message: 'email đã được sử dụng!'});
	  }
	});

});

router.post('/update',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");

    var id = req.body.nt7_id;
    User.findOne({ _id: id }, function(err, user){
	  if(err) 
	    res.json({success:false, message:"Lỗi kết nối!"});
	  if(user){
        	user.name = req.body.nt7_name || user.name; 
		    user.email =  req.body.nt7_email || user.email; 
			user.address =  req.body.nt7_address || user.address; 
			user.phone =  req.body.nt7_phone || user.phone; 
			user.cmnd =  req.body.nt7_cmnd || user.cmnd; 
			user.comment =  req.body.nt7_comment || user.comment; 
			user.birthplace =  req.body.nt7_birthplace || user.birthplace; 
			user.birthday =  req.body.nt7_birthday || user.birthday; 
			user.position =  req.body.nt7_position || user.position; 
			user.image =  req.body.nt7_image || user.image; 
			user.level =   req.body.nt7_level || user.level; 
			user.name_level =   req.body.nt7_name_level || user.name_level; 
			user.user =  req.body.nt7_user || user.user;
			user.pass =   sha256(md5(req.body.nt7_pass)) || user.pass;
			user.lastip =   req.body.nt7_lastip || user.lastip;
			user._id_company = req.body.nt7_id_company || user._id_company;
		  	user._id_group = req.body.nt7_id_group || user._id_group;

        // Save the updated document back to the database
        user.save(function (err, user) {
            if (err) {
                res.json({success:false, message:"Lỗi kết nối!"});
            }
            res.json({ success: true, message: 'Cập nhật thành công!'});
        });
	  }else{
	     res.json({ success: false, message: 'User không tồn tại!'});
	  }
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
    				User.find({},function(err,user){
						if(err) 
					    	res.json({success:false, message:"Lỗi kết nối!"});
					    res.json(user);
					});
    			}else{
    				User.find({_id_company: idcompany},function(err,user){
						if(err) 
					    	res.json({success:false, message:"Lỗi kết nối!"});
					    res.json(user);
					});
    			}				
			}else
			res.json({ success: false, message: 'Lỗi bảo mật!'});
    	}
    });
});

router.post("/listC",function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
	var secret = req.body.secret;
    var idcompany = req.body.nt7_id_company;
	if(secret == config.secret){
		User.find({_id_company: idcompany},function(err,user){
			if(err) 
		    	res.json({success:false, message:"Lỗi kết nối!"});
		    res.json(user);
		});			
	}else
	res.json({ success: false, message: 'Lỗi bảo mật!'});
});

router.post('/item',function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
	var id = req.body.nt7_id;
	User.findOne({_id: id},function(err, user){
		if(err){
            res.json({success:false, message:"Lỗi kết nối!"});			
		}else if(user){
			res.json({success:true,message:"thành công", data:user });
		}else{
            res.json({success:false, message:"User không tồn tại"});	
		}
	});
});

router.post('/delete',function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
	var id = req.body.nt7_id;
	User.findByIdAndRemove({_id: id},function(err, user){
		if(err){
            res.json({success:false, message:"Lỗi kết nối!"});			
		}else if(user){
			res.json({success:true, message:"User xóa thành công"});
		}else{
            res.json({success:false, message:"User không tồn tại"});	
		}
	});
});

/* GET /:id/logs -> Lay danh sach hoat dong */
router.get('/:id/logs', function(req, res, next) {
  var cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  //cutoff.setDate(cutoff.getDate()-n);
  Nhatky.find({ user_id: req.params.id, time: {$gte: cutoff} }, {_id: 0, source: 1, type: 1, message: 1, time: 1 }, function (err, logs) {
    if (err) return next(err);
    res.json(logs);
  });
});

module.exports = router;
