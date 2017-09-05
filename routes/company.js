var express = require('express');
var router = express.Router();
var Company = require('../models/Company.js');
var Log = require('../models/Log.js');
var config = require('../config');
var jwt = require('jsonwebtoken');

// insert usert
router.post('/',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    var name = req.body.nt7_name;
    Company.findOne({ name: name }, function(err, company){
	  if(err) 
	    res.json({success:false, message:"Lỗi kết nối!"});
	  if(!company){
	    Company.create( {
		 	name: name, 
			address: req.body.nt7_address,
			phone: req.body.nt7_phone,
			email: req.body.nt7_email,
			website: req.body.nt7_website,
			slogan: req.body.nt7_slogan,
			logo: req.body.nt7_logo,
			info: req.body.nt7_info,
			mst: req.body.nt7_mst,
			name_user_leader: req.body.nt7_name_user_leader,
			_id_user_leader: req.body.nt7_id_user_leader,
	    }, function (err, company){
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
    var name = req.body.nt7_name;
    Company.findOne({ name: name }, function(err, company){
	  if(err) 
	    res.json({success:false, message:"Lỗi kết nối!"});
	  if(company){
        	company.name = req.body.nt7_name || company.name; 
			company.address = req.body.nt7_address || company.address; 
			company.phone = req.body.nt7_phone || company.phone; 
			company.email = req.body.nt7_email || company.email;
			company.website = req.body.nt7_website || company.website;
			company.slogan = req.body.nt7_slogan || company.slogan;
			company.logo = req.body.nt7_logo || company.logo;
			company.info = req.body.nt7_info || company.info;
			company.mst = req.body.nt7_mst || company.mst,
			company.name_user_leader = req.body.nt7_name_user_leader || company.name_user_leader,
			company._id_user_leader = req.body.nt7_id_user_leader || company._id_user_leader,
        // Save the updated document back to the database
        company.save(function (err, company) {
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
	if(secret == config.secret){
		Company.find({},function(err,company){
			if(err) 
		    	res.json({success:false, message:"Lỗi kết nối!"});
		    res.json(company);
		});
	}else
	res.json({ success: false, message: 'Lỗi bảo mật!'});
});

router.post('/item',function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
	var id = req.body.nt7_id;
	Company.findOne({_id: id}).populate("_id_user_leader",{}).exec(function(err, company){
		if(err){
            res.json({success:false, message:"Lỗi kết nối!"});			
		}else if(company){
			res.json({success:true,message:"",data: company});
		}else{
            res.json({success:false, message:"Tổ chức không tồn tại"});	
		}
	});
});

router.post('/delete',function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
	var id = req.body.nt7_id;
	Company.findByIdAndRemove({_id: id},function(err, company){
		if(err){
            res.json({success:false, message:"Lỗi kết nối!"});			
		}else if(company){
			res.json({success:true, message:"Xóa thành công"});
		}else{
            res.json({success:false, message:"Company không tồn tại"});	
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
