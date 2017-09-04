var express = require('express');
var router = express.Router();
var Parner = require('../models/Parner.js');
var Log = require('../models/Log.js');
var config = require('../config');
var jwt = require('jsonwebtoken');

// insert usert
router.post('/par',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    var name = req.body.nt7_name;
    Product.findOne({ name: name }, function(err, product){
	  if(err) 
	    res.json({success:false, message:"Lỗi kết nối!"});
	  if(!product){
	    Product.create( {
		 	name: String,
			_id_company: { type: Schema.ObjectId, ref: 'Company' },
	    }, function (err, Product){
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

router.put('/',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    var name = req.body.nt7_name;
    Product.findOne({ name: name }, function(err, product){
	  if(err) 
	    res.json({success:false, message:"Lỗi kết nối!"});
	  if(product){
        	product.name = req.body.nt7_name || product.name; 
			product.price_out: req.body.nt7_price_out || product.price_out; 
			product.price_in: req.body.nt7_price_in || product.price_in; 
			product.price_sale: req.body.nt7_price_sale || product.price_sale; 
			product.quantity: req.body.nt7_quantity || product.quantity;  
			product.warning_quantity: req.body.nt7_warning_quantity || product.warning_quantity;  
			
			product.name_type_product: req.body.nt7_name_type_product || product.name_type_product; 
			product.name_unit: req.body.nt7_name_unit, || product.name_unit; 
			product.name_provider: req.body.nt7_name_provider || product.name_provider; 

			product._id_type_product: req.body.nt7_id_type_product || product._id_type_product; 
			product._id_unit: req.body.nt7__id_unit || product._id_unit; 
			product._id_provider: req.body.nt7_id_provider || product._id_provider; 
			product._id_company: req.body.nt7_id_company || product._id_company; 

        // Save the updated document back to the database
        Product.save(function (err, product) {
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
		Product.find({},function(err,product){
			if(err) 
		    	res.json({success:false, message:"Lỗi kết nối!"});
		    res.json(product);
		});
	}else
	res.json({ success: false, message: 'Lỗi bảo mật!'});
});

router.post('/item',function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
	var id = req.body.id;
	Product.findOne({_id: id},function(err, product){
		if(err){
            res.json({success:false, message:"Lỗi kết nối!"});			
		}else if(product){
			res.json(product);
		}else{
            res.json({success:false, message:"Tổ chức không tồn tại"});	
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
