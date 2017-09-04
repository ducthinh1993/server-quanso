var express = require('express');
var router = express.Router();
var config = require('../config');
var jwt = require('jsonwebtoken');

var User = require('../models/User.js');
var Delivery = require('../models/Delivery.js');
var Log = require('../models/Log.js');
var DTP = require('../models/DeliveryToProduct.js');


// insert usert
router.post('/',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
	var idcompany = "";
	var userid = req.userid;
	  if(!req.body.nt7_id_company){
	    User.findOne({_id:userid},{_id_company:1},function(err,userkey){
	      if(err){
	        res.json({success:false, message:"Lỗi hệ thống!"});
	      }else{
	        idcompany = userkey._id_company;
	Delivery.create({
		_id_company:idcompany,

		payer: req.body.nt7_payer, 
		address: req.body.nt7_address,
		phone: req.body.nt7_phone,

		confirm_amount: req.body.nt7_confirm_amount, // ưu tiên
		sign_payer:  req.body.nt7_sign_payer, 
		sign_director: req.body.nt7_sign_director,
		created_at: req.body.nt7_created_at,

		_id_user_created: userid,
		all_total: Number(req.body.nt7_all_total.replace(/\./gi,'')),

    }, function (err, delivery){
      if(err){                
        res.json({success:false, message:"Lỗi tạo phiếu giao nhận hàng!",err:err});
      }
      else{
      	var product = req.body.nt7_id_product;
      	var unit = req.body.nt7_id_unit;
      	if(Array.isArray(product) == true){
      		for (var i = 0; i < product.length; i++) {
			 	DTP.create({
			 		_id_delivery: delivery._id,
					_id_product:  product[i],
					_id_unit: unit[i],

					qty:  Number(req.body.nt7_qty[i].replace(/\./gi,'')),
					price_out:   Number(req.body.nt7_price_out[i].replace(/\./gi,'')),
					total:  Number(req.body.nt7_total[i].replace(/\./gi,'')),

		      	 }, function (err,dtp){
			      if(err){                
			        res.json({success:false, message:"Lỗi tạo chi tiết giao nhận hàng!",err:err});
			      }
			  	});
			} 
      	}else{
      		DTP.create({
		 		_id_delivery: delivery._id,
				_id_product:  product,
				_id_unit: unit,

				qty:  Number(req.body.nt7_qty.replace(/\./gi,'')),
				price_out:   Number(req.body.nt7_price_out.replace(/\./gi,'')),
				total:  Number(req.body.nt7_total.replace(/\./gi,'')),

	      	 }, function (err,dtp){
		      if(err){                
		        res.json({success:false, message:"Lỗi tạo chi tiết giao nhận hàng!",err:err});
		      }
		  	});
      	}
      	     	  
	  	Log.create({
	     	_id_company: idcompany,
			type: "delivery", // theo  tên bảng
			content: "tạo phiếu giao nhận",
			id_type: delivery._id,// có thể là công việc hay nhập xuất và log 
	     }, function (err, log){
	      	if(err){                
		       res.json({success:false, message:"Lỗi tạo nhật ký!",err:err});
		    }else{
		       res.json({success:true, message:"Tạo mới thành công!"});
		    }
		}); 	    
         
      }
      
    });

	      }
	    });
	  }else{
	    idcompany = req.body.nt7_id_company;


		Delivery.create({
		_id_company:idcompany,

		payer: req.body.nt7_payer, 
		address: req.body.nt7_address,
		phone: req.body.nt7_phone,

		confirm_amount: req.body.nt7_confirm_amount, // ưu tiên
		sign_payer:  req.body.nt7_sign_payer, 
		sign_director: req.body.nt7_sign_director,
		created_at: req.body.nt7_created_at,

		_id_user_created: userid,
		all_total: Number(req.body.nt7_all_total.replace(/\./gi,'')),

    }, function (err, delivery){
      if(err){                
        res.json({success:false, message:"Lỗi tạo phiếu giao nhận hàng!",err:err});
      }
      else{
      	var product = req.body.nt7_id_product;
      	var unit = req.body.nt7_id_unit;
      	if(Array.isArray(product) == true){
      		for (var i = 0; i < product.length; i++) {
			 	DTP.create({
			 		_id_delivery: delivery._id,
					_id_product:  product[i],
					_id_unit: unit[i],

					qty:  Number(req.body.nt7_qty[i].replace(/\./gi,'')),
					price_out:   Number(req.body.nt7_price_out[i].replace(/\./gi,'')),
					total:  Number(req.body.nt7_total[i].replace(/\./gi,'')),

		      	 }, function (err,dtp){
			      if(err){                
			        res.json({success:false, message:"Lỗi tạo chi tiết giao nhận hàng!",err:err});
			      }
			  	});
			} 
      	}else{
      		DTP.create({
		 		_id_delivery: delivery._id,
				_id_product:  product,
				_id_unit: unit,

				qty:  Number(req.body.nt7_qty.replace(/\./gi,'')),
				price_out:   Number(req.body.nt7_price_out.replace(/\./gi,'')),
				total:  Number(req.body.nt7_total.replace(/\./gi,'')),

	      	 }, function (err,dtp){
		      if(err){                
		        res.json({success:false, message:"Lỗi tạo chi tiết giao nhận hàng!",err:err});
		      }
		  	});
      	}
      	     	  
	  	Log.create({
	     	_id_company: idcompany,
			type: "delivery", // theo  tên bảng
			content: "tạo phiếu giao nhận",
			id_type: delivery._id,// có thể là công việc hay nhập xuất và log 
	     }, function (err, log){
	      	if(err){                
		       res.json({success:false, message:"Lỗi tạo nhật ký!",err:err});
		    }else{
		       res.json({success:true, message:"Tạo mới thành công!"});
		    }
		}); 	    
         
      }
      
    });
		
	  } 

	

});

router.post('/update',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    var idwork = req.body.nt7_id;
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
	
	var name_status = "";
	var idstt = req.body.nt7_id_status_work;
	StatusWork.findOne({_id:idstt},function(err,status){
	 	if(err){
	    	res.json({success:false, message:"Lỗi kết nối!"});
	 	}else{
	 		if(!status){
	 			res.json({success:false, message:"không tồn tại tình trạng công việc"})
	 		}else{
	 			name_status = status.name;
	 		}
	 	}
	 });

	var name_customer = "";
	var idcus = req.body.nt7_id_customer;
	Customer.findOne({_id:idcus},function(err,customer){
	 	if(err){
	    	res.json({success:false, message:"Lỗi kết nối!"});
	 	}else{
	 		if(!customer){
	 			res.json({success:false, message:"không tồn tại khách hàng!"})
	 		}else{
	 			name_customer = customer.name;
	 		}
	 	}
	 });

	var name_received = "";
	var idreceived = req.body.nt7_id_user_received;
	User.findOne({_id:idreceived},function(err,user){
	 	if(err){
	    	res.json({success:false, message:"Lỗi kết nối!"});
	 	}else{
	 		if(!user){
	 			res.json({success:false, message:"không tồn tại nhà cung cấp"})
	 		}else{
	 			name_received = user.name;
	 		}
	 	}
	 });
	
	var name_created = "";
	User.findOne({_id:userid},function(err,user){
	 	if(err){
	    	res.json({success:false, message:"Lỗi kết nối!"});
	 	}else{
	 		if(!user){
	 			res.json({success:false, message:"không tồn tại user cập nhật"})
	 		}else{
	 			name_created = user.name;
	 		}
	 	}
	 });
	
	var priority = "";
	if(!req.body.nt7_priority){
		priority = false;
	}else{
		priority = req.body.nt7_priority;
	}
    Work.findOne({ _id: idwork}, function(err, work){
	  if(err) 
	    res.json({success:false, message:"Lỗi kết nối!"});
	  if(work){
        	work.name = req.body.nt7_name || work.name; 
			work.comment = req.body.nt7_comment || work.comment; 
			work.date_start =  req.body.nt7_date_start || work.date_start; 
			work.date_end = req.body.nt7_date_end || work.date_end;
			work.time_start = req.body.nt7_time_start || work.time_start;  
			work.time_end = req.body.nt7_time_end || work.time_end;  
			work.fee_work = Number(req.body.nt7_fee_work.replace(/\./g,'')) || work.fee_work; 
			work.priority = priority;  // ưu tiên

			work.name_customer = name_customer || work.name_customer; 
			work.name_user_created = name_created || work.name_user_created ; 
			work.name_status_work = name_status || work.name_user_created ; 
			work.name_user_received = name_received || work.name_user_received; 

		 	work._id_company = req.body.nt7_id_company || work._id_company; 
			work._id_customer = req.body.nt7_id_customer || work._id_customer; 
			work._id_user_received = req.body.nt7_id_user_received || work._id_user_received; 
			work._id_user_created = req.body.nt7_id_user_created || work._id_user_created; 
			work._id_status_work = req.body.nt7_id_status_work || work._id_status_work; 
		
        // Save the updated document back to the database
        work.save(function (err, work) {
            if (err) {
                res.json({success:false, message:"Lỗi kết nối!"});
            }
            res.json({ success: true, message: 'Cập nhật thành công!'});
        });
	  }else{
	     res.json({ success: false, message: 'Sản phẩm không tồn tại!'});
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
            Delivery.find({}).populate("_id_user_created",{}).exec(function(err, delivery){
				if(err){
					throw err;
				}else
				res.json(delivery);
			});
          }else{
            Delivery.find({_id_company: idcompany}).populate("_id_user_created",{}).exec(function(err, delivery){
				if(err){
					throw err;
				}else{
					res.json(delivery);					
				}
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
    Delivery.findOne({_id: id}).populate("_id_user_created",{}).exec(function(err, delivery){
		if(err){
			throw err;
		}else{
			DTP.find({_id_delivery: delivery._id}).populate("_id_product",{}).populate("_id_unit",{}).exec(function(err, dtp){
				if(err){
      				res.json({ success: false, message: 'Lỗi truy cập CSDL!'});					
				}else{
					res.json({success:true,message:"Lấy dữ liệu thành công", delivery:delivery,detail: dtp});
				}
			});
		}
	});
});
router.post('/delete',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
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
	  
  var id = req.body.nt7_id;
  Delivery.findByIdAndRemove({_id: id},function(err, delivery){
    if(err){
        res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(delivery){
    	var id_delivery = delivery._id;
    	DTP.findByIdAndRemove({_id_delivery: delivery._id},function(err, delivery){
    		Log.create({
		     	_id_company: idcompany,
				type: "delivery", // theo  tên bảng
				content: "Xóa phiếu giao nhận",
				id_type: id_delivery,// có thể là công việc hay nhập xuất và log 
		     }, function (err, log){
		      	if(err){                
			       res.json({success:false, message:"Lỗi tạo nhật ký!",err:err});
			    }else{
			       res.json({success:true, message:"Xóa thành công"});
			    }
			}); 
    		
    	});      
    }else{
        res.json({success:false, message:"Sản phẩm không tồn tại"});  
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
