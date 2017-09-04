var express = require('express');
var router = express.Router();
var User = require('../models/User.js');
var Customer = require('../models/Customer.js');
var Parner = require('../models/Parner.js');
var Log = require('../models/Log.js');
var config = require('../config');
var jwt = require('jsonwebtoken');

// insert usert
router.post('/',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    var name = req.body.nt7_name;
    var idcompany = "";
    var name_parner = "";
	var userid = req.userid;
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
	  var idparner = req.body.nt7_id_parner;
	 Parner.findOne({_id:idparner},function(err,parner){
	 	if(err){
	    	res.json({success:false, message:"Lỗi kết nối!"});
	 	}else{
	 		if(!parner){
	 			res.json({success:false, message:"không tồn tại đối tác"})
	 		}else{
	 			name_parner = parner.name;
	 		}
	 	}
	 });
    Customer.findOne({ name: name }, function(err, customer){
	  if(err) 
	    res.json({success:false, message:"Lỗi kết nối!"});
	  if(!customer){
	    Customer.create( {
		 	name: req.body.nt7_name ,
			address: req.body.nt7_address ,
			city: req.body.nt7_city ,
			phone: req.body.nt7_phone ,
			email: req.body.nt7_email ,
			present: req.body.nt7_present ,
			comment: req.body.nt7_comment ,
			name_parner: name_parner,
			_id_parner: req.body.nt7_id_parner ,
			_id_company: idcompany ,
	    }, function (err, customer){
	      if(err){                
	        res.json({success:false, message:"Lỗi kết nối CSDL!"});
	      }
	      else{
	        // var token = jwt.sign({ key: user2._id, tid: now }, config.secret);
	        // res.json({ success: true, message: 'Authentication success.', token: token, id: user2._id, name: user2.name, info: user2.info, lastip: user2.lastip, lastlogin: user2.lastlogin });
	        res.json({ success: true, message: 'Tạo mới thành công!'});
	      }
	      
	    });
	  }else{
	     res.json({ success: false, message: 'Tên đã được sử dụng!'});
	  }
	});

});

router.post('/update',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    var idcustomer = req.body.nt7_id;
    var idcompany = "";
	var userid = req.userid;
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
	  var name_parner ="";
	  var idparner = req.body.nt7_id_parner;	  
	  Parner.findOne({_id:idparner},function(err,parner){
	 	if(err){
	    	res.json({success:false, message:"Lỗi kết nối!"});
	 	}else{
	 		if(!parner){
	 			res.json({success:false, message:"không tồn tại đối tác"})
	 		}else{
	 			name_parner = parner.name;
	 		}
	 	}
	 });
    Customer.findOne({ _id: idcustomer }, function(err, customer){
	  if(err) 
	    res.json({success:false, message:"Lỗi kết nối!"});
	  if(customer){
        	customer.name = req.body.nt7_name || customer.name; 
			customer.address = req.body.nt7_address || customer.address; 
			customer.phone = req.body.nt7_phone || customer.phone; 
			customer.email = req.body.nt7_email || customer.email;
			customer.website = req.body.nt7_website || customer.website;
			customer.slogan = req.body.nt7_slogan || customer.slogan;
			customer.logo = req.body.nt7_logo || customer.logo;
			customer.info = req.body.nt7_info || customer.info;
			customer.name_parner = req.body.name_parner || customer.name_parner;
			customer._id_parner = req.body.nt7_id_parner || customer._id_parner,
			customer._id_company = idcompany || customer._id_company ,
        // Save the updated document back to the database
        customer.save(function (err, customer) {
            if (err) {
                res.json({success:false, message:"Lỗi kết nối!"});
            }
            res.json({ success: true, message: 'Cập nhật thành công!'});
        });
	  }else{
	     res.json({ success: false, message: 'Tổ chức không tồn tại!'});
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
            Customer.find({},function(err,customer){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(customer);
          });
          }else{
            Customer.find({_id_company: idcompany},function(err,customer){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(customer);
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
	Customer.findOne({_id: id},function(err, customer){
		if(err){
            res.json({success:false, message:"Lỗi kết nối!"});			
		}else if(customer){
              res.json({success:true, message:"ok", data:customer});			
		}else{
            res.json({success:false, message:"Tổ chức không tồn tại"});	
		}
	});
});
router.post('/delete',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
  Customer.findByIdAndRemove({_id: id},function(err, customer){
    if(err){
            res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(customer){
      res.json({success:true, message:"Xóa thành công"});
    }else{
            res.json({success:false, message:"Khách hàng không tồn tại"});  
    }
  });
});

// /* GET /:id/logs -> Lay danh sach hoat dong */
// router.get('/:id/logs', function(req, res, next) {
//   var cutoff = new Date();
//   cutoff.setHours(0, 0, 0, 0);
//   //cutoff.setDate(cutoff.getDate()-n);
//   Nhatky.find({ user_id: req.params.id, time: {$gte: cutoff} }, {_id: 0, source: 1, type: 1, message: 1, time: 1 }, function (err, logs) {
//     if (err) return next(err);
//     res.json(logs);
//   });
// });

module.exports = router;
