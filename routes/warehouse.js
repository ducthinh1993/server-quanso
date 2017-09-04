var express = require('express');
var router = express.Router();
var Company = require('../models/Company.js');
var Log = require('../models/Log.js');
var config = require('../config');
var jwt = require('jsonwebtoken');
var Money = require('../models/Money.js');
var Warehouse = require('../models/Warehouse.js');
var Product = require('../models/Product.js');
var User = require('../models/User.js');

router.post("/in", function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");	
	var userid = req.userid;
	var id_product = req.body.nt7_id_product;
	var qty_in = Number(req.body.nt7_quantity_type.replace(/\./gi,''));
	var price_in = Number(req.body.nt7_price_type.replace(/\./gi,''));
	var money_out = Number(qty_in * price_in);
	User.findOne({_id:userid},function(err,user){
		if(err){
			res.json({success: false,message:"lỗi kết nối CSDL!"});
		}
		Money.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, money){
			if(err){
				res.json({success: false,message:"lỗi kết nối CSDL!"});
			}
			var money_start = 0;
				if(!money){
					money_start = 0;
				}else{
					money_start = money.money_end;
				}
			Product.findOne({_id:id_product}, function(err,product){
				if(err){
					res.json({success:false, message:"lỗi kết nối CSDL!"});
				}
				var newqty = Number(product.quantity) + Number(qty_in);
				product.quantity = newqty;
				product.save(function (err, uppro) {
		            if (err) {
		                res.json({success:false, message:"Lỗi kết nối!"});
		            }else{
				        Warehouse.create({
							type: 1, //===NHAP-XUAT-HIEUCHINH-XUABAN
							price_type: price_in, //===giá để NHAP-XUAT-XUABAN
							quantity_type: qty_in,  //=== số lượng NHAP-XUAT-HIEUCHINH-XUABAN
							content: req.body.nt7_content,
							name_user_created: user.name,
							name_product: product.name,
							_id_user_created: user._id,
							_id_product: product._id,
							_id_company: user._id_company,
							content:"Nhập hàng vào kho",
						},function(err, warehouse){
							if(err){
								console.log("tạo ware không thành công");
							}else{
								var endmoney = Number(money_start) - Number(money_out);
								Money.create({
									amount: money_out, //=== số lượng tiền có thể +(dương) hoặc -(âm)
									_id_company: user._id_company,
									type: "warehouse", // theo tên bảng
									content: user.name + " Nhập kho hàng",
									color: 1,// xác định màu nền 
									id_type: id_product,// có thể là công việc hay nhập xuất hoặc thu chi
									money_end: endmoney,
						    	},function(err, moneynew){
						    		if(err){
						    			res.json({success: false,message:"lỗi kết nối CSDL!"});
						    		}else{
						    			Log.create({
									     	_id_company: user._id_company,
											type: "warehouse", // theo  tên bảng
											content: user.name + "nhập hàng",
											id_type: warehouse._id,// có thể là công việc hay nhập xuất và log 
									     }, function (err, log){
									      	if(err){                
										       res.json({success:false, message:"Lỗi tạo nhật ký!",err:err});
										    }else{
										       res.json({success:true, message:"nhập hàng thành công"});
										    }
										});				    			
						    		}
								});
							}
						});	
		            }
		        });
							
			});
		});
	});
});
router.post("/out", function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
	var userid = req.userid;
	var id_product = req.body.nt7_id_product;
	var qty_out = Number(req.body.nt7_quantity_type.replace(/\./gi,''));
	var price_out = Number(req.body.nt7_price_type.replace(/\./gi,''));
	var money_in = Number(price_out * qty_out);
	User.findOne({_id:userid},function(err,user){
		if(err){
			res.json({success: false,message:"lỗi kết nối CSDL!"});
		}
		Money.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, money){
			if(err){
				res.json({success: false,message:"lỗi kết nối CSDL!"});
			}
			var money_start = 0;
				if(!money){
					money_start = 0;
				}else{
					money_start = money.money_end;
				}
			Product.findOne({_id:id_product}, function(err,product){
				if(err){
					res.json({success:false, message:"lỗi kết nối CSDL!"});
				}
				var newqty = Number(product.quantity) - Number(qty_out);
				product.quantity = newqty;
				product.save(function (err, uppro) {
		            if (err) {
		                res.json({success:false, message:"Lỗi kết nối!"});
		            }else{
				        Warehouse.create({
							type: 2, //===NHAP-XUAT-HIEUCHINH-XUABAN
							price_type: price_out, //===giá để NHAP-XUAT-XUABAN
							quantity_type: qty_out,  //=== số lượng NHAP-XUAT-HIEUCHINH-XUABAN
							content: req.body.nt7_content,
							name_user_created: user.name,
							name_product: product.name,
							_id_user_created: user._id,
							_id_product: product._id,
							_id_company: user._id_company,
							content:"Xuất hàng ra kho",
						},function(err, warehouse){
							if(err){
								console.log("tạo ware không thành công");
							}else{
								var endmoney = Number(money_start) + Number(money_in);
								Money.create({
									amount: money_in, 
									_id_company: user._id_company,
									type: "warehouse", 
									content: user.name + " Xuất kho hàng",
									color: 1,
									id_type: id_product,
									money_end: endmoney,
						    	},function(err, moneynew){
						    		if(err){
						    			res.json({success: false,message:"lỗi kết nối CSDL!"});
						    		}else{
						    			Log.create({
									     	_id_company: user._id_company,
											type: "warehouse", 
											content: user.name + "xuất hàng",
											id_type: warehouse._id,
									     }, function (err, log){
									      	if(err){                
										       res.json({success:false, message:"Lỗi tạo nhật ký!",err:err});
										    }else{
										       res.json({success:true, message:"Xuất hàng thành công"});
										    }
										});				    			
						    		}
								});
							}
						});    	
		            }
		        });
								
			});
		});
	});
});

router.post("/fix",function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
		var userid = req.userid;
	var id_product = req.body.nt7_id_product;
	var qty_fix = Number(req.body.nt7_quantity_type.replace(/\./gi,''));
	var price_in = 0;
	User.findOne({_id:userid},function(err,user){
		if(err){
			res.json({success: false,message:"lỗi kết nối CSDL!"});
		}			
		Product.findByIdAndUpdate(id_product, {quantity:qty_fix}, function(err,product){
			if(err)
				res.json({success:false, message:"lỗi kết nối CSDL!"});
			Warehouse.create({
				type: 3, 
				price_type: price_in,
				quantity_type: qty_fix,
				name_user_created: user.name,
				name_product: product.name,
				_id_user_created: user._id,
				_id_product: product._id,
				_id_company: user._id_company,
				content:"Hiệu chỉnh kho hàng",
			},function(err, warehouse){
				if(err){
					console.log("tạo ware không thành công");
				}else{
	    			Log.create({
				     	_id_company: user._id_company,
						type: "warehouse", // theo  tên bảng
						content: user.name + "hiệu chỉnh kho hàng",
						id_type: warehouse._id,// có thể là công việc hay nhập xuất và log 
				     }, function (err, log){
				      	if(err){                
					       res.json({success:false, message:"Lỗi tạo nhật ký!",err:err});
					    }else{
					       res.json({success:true, message:"hiệu chỉnh kho hàng thành công"});
					    }
					});	
				}
			});				
		});
	});
});

router.post('/item',function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
	var id = req.body.nt7_id;
	Warehouse.find({_id:id}).populate("_id_product",{}).exec(function(err, ware){
		if(err){
			throw err;
		}else if(!ware){
			res.json({success:false, message:"Không tồn tại lịch sử này"});			
		}
		else{  
			res.json({success:true, message:"Ok!",data:ware});
		}
	});
});

router.post('/history',function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");  
	var type  = req.body.nt7_type;
	var idpro = req.body.nt7_id_product;
  	var userid = req.userid; 
    User.findOne({_id:userid},{_id_company: 1,supper:1},function(err,userkey){
      if(err){
        res.json({success:false, message:"Lỗi hệ thống!"});
      }else{
        var idcompany = userkey._id_company;
          if(userkey.supper==1){
          	Product.find({_id:idpro},function(err,pro){
          		if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});

            	Warehouse.find({$and:[{type:type},{_id_product:idpro}]},function(err,ware){	            
	            if(err) 
	                res.json({success:false, message:"Lỗi kết nối!"});
	              res.json({data:ware, product:pro});
	          	});
        	});
          }else{
          	Product.find({_id:idpro},function(err,pro){
          		if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});

	            Warehouse.find({$and:[{type:type},{_id_product:idpro},{_id_company: idcompany}]},function(err,ware){
	            if(err) 
	                res.json({success:false, message:"Lỗi kết nối!"});
	              res.json({data:ware, product:pro});
	          	});
        	});
          }  
      }
    });
});

module.exports = router;
