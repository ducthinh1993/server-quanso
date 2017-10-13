var express = require('express');
var router = express.Router();
var config = require('../config');
var jwt = require('jsonwebtoken');

var Work = require('../models/Work.js');
var User = require('../models/User.js');
var Product = require('../models/Product.js');
var TypeProduct = require('../models/TypeProduct.js');
var Unit = require('../models/Unit.js');
var StatusWork = require('../models/StatusWork.js');
var Customer = require('../models/Customer.js');
var Provider = require('../models/Provider.js');
var Log = require('../models/Log.js');
var DetailWork = require('../models/DetailWork.js');
var Money = require('../models/Money.js');
var WorkToTypeWork = require('../models/WorkToTypeWork.js');
var Warehouse = require('../models/Warehouse.js');

var notify = require('./cloud.js');

// insert usert
router.post('/',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
	var idcompany = "";
	var userid = req.userid;
	  if(!req.body.nt7_id_company){
	    User.findOne({_id:userid},function(err,userkey){
	      if(err){
	        res.json({success:false, message:"Lỗi hệ thống!"});
	      }else{
	        idcompany = userkey._id_company;
	      }
	    });
	  }else{
	    idcompany = req.body.nt7_id_company;
	  } 
	// var namestatus = "s";
	// var idstt = req.body.nt7_id_status_work;
	// StatusWork.findOne({_id:idstt},function(err,status){
	//  	if(err){
	//     	res.json({success:false, message:"Lỗi kết nối!"});
	//  	}else{
	//  		if(!status){
	//  			res.json({success:false, message:"không tồn tại loại sản phẩm/dịch vụ"})
	//  		}else{
	//  			namestatus = status.name;
	//  		}
	//  	}
	// });

	var namecustomer = "c";
	var idcus = req.body.nt7_id_customer;
	Customer.findOne({_id:idcus},function(err,customer){
	 	if(err){
	    	res.json({success:false, message:"Lỗi kết nối!"});
	 	}else{
	 		if(!customer){
	 			res.json({success:false, message:"không tồn tại khách hàng!"})
	 		}else{
	 			namecustomer = customer.name;
	 		}
	 	}
	});

	var namereceived = "r";
	if(req.body.nt7_id_user_received){
		var idreceived = req.body.nt7_id_user_received;
		User.findOne({_id:idreceived},function(err,user2){
		 	if(err){
		    	res.json({success:false, message:"Lỗi kết nối!"});
		 	}else{
		 		if(!user2){
		 			res.json({success:false, message:"không tồn tại người nhận việc"})
		 		}else{
		 			namereceived = user2.name;
		 		}
		 	}
		});	
	}else{
		namereceived = "Mọi người";
	}
	

	
	var namecreated = "ed";
	var idcre = req.userid;
	User.findOne({_id:idcre},function(err,user1){
	 	if(err){
	    	res.json({success:false, message:"Lỗi kết nối!"});
	 	}else{
	 		if(!user1){
	 			res.json({success:false, message:"không tồn tại nhà cung cấp"})
	 		}else{
	 			namecreated = user1.name;
	 			if(!req.body.nt7_priority){
					var priority = false;
				}else{
					var priority = req.body.nt7_priority;
				}
				StatusWork.findOne({type:1},function(err,status){
					if(err){						
	    				res.json({success:false, message:"Lỗi kết nối!"});
					}else if(!status){
	    				res.json({success:false, message:"Không tồn tại trạng thái đang chờ"});						
					}else{
						var total_money = Number(req.body.nt7_total_all_product.replace(/\./gi,'')) - Number(req.body.nt7_fee_work.replace(/\./gi,''));
						Work.create({
							name: req.body.nt7_name, 
							comment: req.body.nt7_comment,
							date_start:  req.body.nt7_date_start, 
							date_end: req.body.nt7_date_end,
							fee_work: Number(req.body.nt7_fee_work.replace(/\./gi,'')),
							priority: priority, // ưu tiên

							name_customer: namecustomer,
							name_user_created: namecreated,
							name_user_received: namereceived,
							name_status_work: status.name,

							total_all_product: Number(req.body.nt7_total_all_product.replace(/\./gi,'')),

							total: Number(total_money),

						 	_id_company: idcompany,
							_id_customer: req.body.nt7_id_customer,
							_id_user_received: req.body.nt7_id_user_received,
							_id_user_created: req.userid,
							_id_status_work: status._id,

					    }, function (err, work){
					      if(err){                
					        res.json({success:false, message:"Lỗi kết nối CSDL!",err:err});
					      }
					      else{
					      	var name_w = namecreated + " tạo mới công việc " +work.name;
					      	User.findOne({_id:req.body.nt7_id_user_received},function(err,usertk){
					      		if(usertk){
					      			notify(1,name_w,"work",work._id,usertk.tokenfb);
					      		}
					      	});
 							// notify(1,name_w,"work",work._id);
					      	var wttypework = req.body.nt7_id_type_work;
					      	if(Array.isArray(wttypework) == true){
					      		for (var i = 0; i < wttypework.length; i++) {
								 	WorkToTypeWork.create({
								 		_id_work: work._id,
										name_work: work.name,
										_id_type_work: wttypework[i],

							      	 }, function (err,wttw){
								      if(err){                
								        res.json({success:false, message:"Lỗi tạo chi tiết loại công việc!",err:err});
								      }
								  	});
								} 
					      	}else{
					      		WorkToTypeWork.create({
							 		_id_work: work._id,
									name_work: work.name,
									_id_type_work: wttypework,

						      	 }, function (err,wttw){
							      if(err){                
							        res.json({success:false, message:"Lỗi tạo chi tiết loại công việc!",err:err});
							      }
							  	});
					      	}

					      	var product = req.body.nt7_id_product;
					      	var unit = req.body.nt7_id_unit;
					      	if(Array.isArray(product) == true){
					      		for (var i = 0; i < product.length; i++) {
								 	DetailWork.create({
								 		_id_work: work._id,
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
					      		DetailWork.create({
							 		_id_work: work._id,
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
								type: "work", // theo  tên bảng
								content: "tạo công việc",
								color: 1,
								id_type: work._id,// có thể là công việc hay nhập xuất và log 
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
	 		}
	 	}
	});
	

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
	
	// var name_status = "";
	// var idstt = req.body.nt7_id_status_work;
	// StatusWork.findOne({_id:idstt},function(err,status){
	//  	if(err){
	//     	res.json({success:false, message:"Lỗi kết nối!"});
	//  	}else{
	//  		if(!status){
	//  			res.json({success:false, message:"không tồn tại tình trạng công việc"})
	//  		}else{
	//  			name_status = status.name;
	//  		}
	//  	}
	//  });

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
	if(req.body.nt7_id_user_received){
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
	}else{
		namereceived = "Mọi người";
	}
	
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

		var total_money = Number(req.body.nt7_total_all_product.replace(/\./gi,'')) - Number(req.body.nt7_fee_work.replace(/\./gi,''));

        	work.name = req.body.nt7_name || work.name; 
			work.comment = req.body.nt7_comment || work.comment; 
			work.date_start =  req.body.nt7_date_start || work.date_start; 
			work.date_end = req.body.nt7_date_end || work.date_end;
			work.time_start = req.body.nt7_time_start || work.time_start;  
			work.time_end = req.body.nt7_time_end || work.time_end;  
			work.fee_work = Number(req.body.nt7_fee_work.replace(/\./gi,'')) || work.fee_work; 
			work.priority = priority;  // ưu tiên

			work.total_all_product = Number(req.body.nt7_total_all_product.replace(/\./gi,'')) || work.total_all_product;

			work.total = Number(total_money) || work.total; 

			work.name_customer = name_customer || work.name_customer; 
			work.name_user_created = name_created || work.name_user_created ; 
			// work.name_status_work = name_status || work.name_user_created ; 
			work.name_user_received = name_received || work.name_user_received; 

		 	work._id_company = req.body.nt7_id_company || work._id_company; 
			work._id_customer = req.body.nt7_id_customer || work._id_customer; 
			work._id_user_received = req.body.nt7_id_user_received || work._id_user_received; 
			work._id_user_created = req.body.nt7_id_user_created || work._id_user_created; 
			// work._id_status_work = req.body.nt7_id_status_work || work._id_status_work; 
		
        // Save the updated document back to the database
        	work.save(function (err, work) {
	            if (err) {
	                res.json({success:false, message:"Lỗi kết nối!"});
	            }else{
	            	// notify
	            	var name_w = name_created + " cập nhật công việc " +work.name;
	            	User.findOne({_id:work._id_user_received},function(err,usertk){
			      		if(usertk){
			      			notify(1,name_w,"work",work._id,usertk.tokenfb);
			      		}
			      	});	
 					// notify(1,name_w,"work",work._id);
 					// notify
		            WorkToTypeWork.remove({_id_work: work._id},function(err){
	        			if(err) {
			                res.json({success:false, message:"Lỗi kết nối!"});
			            }		                
	        		});
        			var wttypework = req.body.nt7_id_type_work;
			      	if(Array.isArray(wttypework) == true){
			      		for (var i = 0; i < wttypework.length; i++) {
						 	WorkToTypeWork.create({
						 		_id_work: work._id,
								name_work: work.name,
								_id_type_work: wttypework[i],

					      	 }, function (err,wttw){
						      if(err){                
						        res.json({success:false, message:"Lỗi cập nhật loại công việc!",err:err});
						      }
						  	});
						} 
			      	}else{
			      		WorkToTypeWork.create({
					 		_id_work: work._id,
							name_work: work.name,
							_id_type_work: wttypework,

				      	 }, function (err,wttw){
					      if(err){                
					        res.json({success:false, message:"Lỗi cập nhật loại công việc!",err:err});
					      }
					  	});
			      	}
	        		DetailWork.remove({_id_work: work._id},function(err){
	        			if(err) {
			                res.json({success:false, message:"Lỗi kết nối!"});
			            }	
	        		});	
					var product = req.body.nt7_id_product;
			      	var unit = req.body.nt7_id_unit;
			      	if(Array.isArray(product) == true){
			      		for (var i = 0; i < product.length; i++) {
						 	DetailWork.create({
						 		_id_work: work._id,
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
			      		DetailWork.create({
					 		_id_work: work._id,
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
						type: "work", // theo  tên bảng
						color: 0,
						content: "Sữa công việc",
						id_type: work._id,// có thể là công việc hay nhập xuất và log 
				     }, function (err, log){
				      	if(err){                
					       res.json({success:false, message:"Lỗi tạo nhật ký!",err:err});
					    }else{
					       res.json({success:true, message:"Cập nhật thành công!"});
					    }
					});
	            }
	            
        });
	  }else{
	     res.json({ success: false, message: 'Sản phẩm không tồn tại!'});
	  }
	});

});

router.post("/change",function(req, res,next){
	res.header("Access-Control-Allow-Origin", "*");

	var userid = req.userid;
	var idwork = req.body.nt7_id;
	var oldstt = req.body.nt7_id_status_work_old;
	var newstt = req.body.nt7_id_status_work_new;


	StatusWork.findOne({_id:oldstt},function(err, oldstt){
		if(err || !oldstt){
        	res.json({success:false, message:"Trạng thái sản phẩm không tồn tại"});  
		}else{
			StatusWork.findOne({_id:newstt},function(err,newstt){
        		if(err || !newstt){
		        	res.json({success:false, message:"Trạng thái sản phẩm không tồn tại"});  
				}else{
					if(newstt.type < oldstt.type){
		        		res.json({success:false, message:"Không thể quay lại trạng thái trước đó"});
					}else{
						User.findOne({_id:userid},function(err,user){
				    		if(err){
				    			res.json({success: false,message:"lỗi kết nối CSDL!"});
				    		}
							Work.findOneAndUpdate({_id: idwork}, {$set:{_id_status_work: newstt._id, name_status_work: newstt.name,name_user_received:user.name,_id_user_received:userid}}, {new: true}, function(err, work){
							    if(err){
			        				res.json({success:false, message:"Lỗi kết nối CSDL"});
							    }
					    	
					    		// notify
				            	var name_w = user.name + " cập nhật trạng thái công việc " +work.name;
				            	User.findOne({_id:work._id_user_created},function(err,usertk){
						      		if(usertk){
						      			notify(1,name_w,"work",work._id,usertk.tokenfb);
						      		}
						      	});				            	
			 					// notify(1,name_w,"work",work._id);
			 					// notify
					    		console.log(newstt.type +"====="+ oldstt.type);
					    		if(newstt.type == "5"){
						    		Money.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, money) {
						    			if(err){
						    				res.json({success: false,message:"lỗi tìm kiếm 2!"});
						    			}
						    			var money_start = 0;
						    			if(!money){
						    				money_start = 0;
						    			}else{
						    				money_start = money.money_end;
						    			}
						    			var endmoney = Number(money_start) + Number(work.total);
						    			Money.create({
											amount: Number(work.total), //=== số lượng tiền có thể +(dương) hoặc -(âm)
											_id_company: user._id_company,
											type: "work", // theo tên bảng
											content: user.name + " hoàn thành công việc",
											color: 1,// xác định màu nền 
											id_type: work._id,// có thể là công việc hay nhập xuất hoặc thu chi
											money_end: Number(endmoney),
								    	},function(err, moneynew){
								    		if(err){
								    			res.json({success: false,message:"lỗi kết nối CSDL!"});
								    		}
								    	console.log("đâdf");

								    		DetailWork.find({_id_work:work._id}).stream().on('data',function(detailwork){
												Product.findOne({_id:detailwork._id_product}, function(err,product){
													if(err){														
														res.json({success:false, message:"lỗi kết nối CSDL product!"});
													}
													var newqty = Number(product.quantity) - Number(detailwork.qty);
													product.quantity = newqty;
													product.save(function (err, uppro) {
											            if (err) {
											                res.json({success:false, message:"Lỗi kết nối!"});
											            }
											        });
														Warehouse.create({
															type: 4, //===NHAP-XUAT-HIEUCHINH-XUABAN
															price_type: detailwork.price_out, //===giá để NHAP-XUAT-XUABAN
															quantity_type: Number(detailwork.qty),  //===giá để NHAP-XUAT-HIEUCHINH-XUABAN
															name_user_created: user.name,
															name_product: product.name,
															_id_user_created: user._id,
															_id_product: product._id,
															_id_company: user._id_company,
															content:"Xuất bán theo đơn hàng "+work.name,
														},function(err, Warehouse){
																if(err){
																	console.log("tạo ware không thành công");
																}else{
																	console.log("tạo ware ok");
																}
														});
												});
											}).on('error', function(err){
												res.json({success:false,message:"err"});
											}).on('end',function(){
												Log.create({
											     	_id_company: user._id_company,
													type: "work", // theo  tên bảng
													content: user.name + " chuyển trạng thái công việc",
													id_type: work._id,// có thể là công việc hay nhập xuất và log 
											     }, function (err, log){
											      	if(err){                
												       res.json({success:false, message:"Lỗi tạo nhật ký!",err:err});
												    }else{
												       res.json({success:true, message:"Chuyển trạng thái thành công"});
												    }
												});	
											});
								    	});
						    		});
					    		}else if(oldstt.type == "5" && newstt.type == "6"){
					    			Money.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, money)  {
						    			if(err){
						    				res.json({success: false,message:"lỗi tìm kiếm 1!"});
						    			}
						    			var money_start = 0;
						    			if(!money){
						    				money_start = 0;
						    			}else{
						    				money_start = money.money_end;
						    			}
						    			var endmoney = Number(money_start) - Number(work.total);
						    			Money.create({
											amount: Number(work.total), //=== số lượng tiền có thể +(dương) hoặc -(âm)
											_id_company: user._id_company,
											type: "work", // theo tên bảng
											content: user.name + " hủy công việc",
											color: 1,// xác định màu nền 
											id_type: work._id,// có thể là công việc hay nhập xuất hoặc thu chi
											money_end: Number(endmoney),
								    	},function(err, moneynew){
								    		if(err){
								    			res.json({success: false,message:"lỗi kết nối CSDL money0!"});
								    		}
								    		console.log("đâ");
								    		DetailWork.find({_id_work:work._id}).stream().on('data',function(detailwork){
												Product.findOne({_id:detailwork._id_product}, function(err,product){													
													var newqty = Number(product.quantity) + Number(detailwork.qty);
													product.quantity = newqty;
													product.save(function (err, uppro) {
											            if (err) {
											                res.json({success:false, message:"Lỗi kết nối!"});
											            }
											        });
													if(err){
															res.json({success:false, message:"lỗi kết nối CSDL product 56!"});
														}
														Warehouse.create({
															type: 4, //===NHAP-XUAT-HIEUCHINH-XUABAN
															price_type: detailwork.price_out, //===giá để NHAP-XUAT-XUABAN
															quantity_type: Number(detailwork.qty),  //===giá để NHAP-XUAT-HIEUCHINH-XUABAN
															name_user_created: user.name,
															name_product: product.name,
															_id_user_created: user._id,
															_id_product: product._id,
															_id_company: user._id_company,
															content:"Nhập hủy theo đơn hàng "+work.name,
														},function(err, Warehouse){
																if(err){
																	console.log("tạo ware không thành công");
																}else{
																	console.log("tạo ware ok");
																}
														});
												});
											}).on('error', function(err){
												res.json({success:false,message:"err"});
											}).on('end',function(){
												Log.create({
											     	_id_company: user._id_company,
													type: "work", // theo  tên bảng
													content: user.name + " chuyển trạng thái công việc",
													id_type: work._id,// có thể là công việc hay nhập xuất và log 
											     }, function (err, log){
											      	if(err){                
												       res.json({success:false, message:"Lỗi tạo nhật ký!",err:err});
												    }else{
												       res.json({success:true, message:"Chuyển trạng thái thành công"});
												    }
												});	
											});
								    	});

						    		});
					    		}else{
					    			Log.create({
								     	_id_company: user._id_company,
										type: "work", // theo  tên bảng
										content: user.name + " chuyển trạng thái công việc",
										id_type: work._id,// có thể là công việc hay nhập xuất và log 
								     }, function (err, log){
								      	if(err){                
									       res.json({success:false, message:"Lỗi tạo nhật ký!",err:err});
									    }else{
									       res.json({success:true, message:"Chuyển trạng thái thành công"});
									    }
									});	
					    		}
							    	
					    	});
						});
					}
				}
			});
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
            Work.find({}).populate("_id_status_work",{}).exec(function(err, work){
				if(err){
					throw err;
				}else
				res.json(work);
			});
          }else{
            Work.find({_id_company: idcompany}).populate("_id_status_work",{}).exec(function(err, work){
				if(err){
					throw err;
				}else
				res.json(work);
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
	Work.findOne({_id: id}).populate("_id_customer",{}).populate("_id_status_work",{}).populate("id_type_work",{}).exec(function(err, work){
		if(err){
            res.json({success:false, message:"Lỗi kết nối!"});			
		}else if(work){
			DetailWork.find({_id_work:work._id}).populate("_id_product",{}).exec(function(err, detail){
				if(err){
					throw err;
				}else{ 
					WorkToTypeWork.find({_id_work:work._id},function(err,wttwork){
						if(err){
							throw err;
						}else{ 
							res.json({success:true, message:"Ok!",data:work, detail:detail ,typework: wttwork});
						}
					});
				}
			});
		}else{
            res.json({success:false, message:"Công việc không tồn tại"});	
		}
	});
	// Work.findOne({_id: id},function(err, work){
	// 	if(err){
 //            res.json({success:false, message:"Lỗi kết nối!"});			
	// 	}else if(work){
	// 		DetailWork.find({_id_work:work._id},function(err,detail){
	// 			if(err){
	// 				throw err;
	// 			}else{ 
	// 				res.json({success:true, message:"Ok!",data:work, detail:detail});
	// 			}
	// 		});
	// 	}else{
 //            res.json({success:false, message:"Công việc không tồn tại"});	
	// 	}
	// });
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
  Work.findOneAndRemove({_id: id},function(err, work){
    if(err){
        res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(work){
    	DetailWork.findAndRemove({_id_delivery: work._id},function(err, detailwork){
    		Log.create({
		     	_id_company: idcompany,
				type: "work", // theo  tên bảng
				content: "Xóa công việc",
				id_type: work._id,// có thể là công việc hay nhập xuất và log 
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

router.post("/userlist",function(req,res,next){
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
            Work.find({}).populate("_id_status_work",{}).sort({'date_end': -1}).exec(function(err, work){
				if(err){
					throw err;
				}else
				res.json(work);
			});
          }else{
            Work.find({$or:[{_id_user_received: userid}, {$and:[{_id_company: idcompany},{name_user_received:"Mọi người"}]}]}).populate("_id_status_work",{}).sort({'date_end': -1}).exec(function(err, work){
				if(err){
					throw err;
				}else
				res.json(work);
			});
          }       
      }else
      res.json({ success: false, message: 'Lỗi bảo mật!'});
      }
    });
});

router.post("/typelist",function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
	var secret = req.body.secret;
	var userid = req.userid;
	var idstatust= req.body.nt7_id_status_work;
    User.findOne({_id:userid},{_id_company: 1,supper:1},function(err,userkey){
      if(err){
        res.json({success:false, message:"Lỗi hệ thống!"});
      }else{
        var idcompany = userkey._id_company;
        if(secret == config.secret){
          if(userkey.supper==1){
            Work.find({_id_status_work: idstatust}).populate("_id_status_work",{}).sort({'date_end': -1}).exec(function(err, work){
				if(err){
					throw err;
				}else
				res.json(work);
			});
          }else{
            Work.find({$or:[{$and:[{_id_user_received: userid},{_id_status_work: idstatust}]}, {$and:[{_id_company: idcompany},{_id_status_work: idstatust},{name_user_received:"Mọi người"}]}]}).populate("_id_status_work",{}).sort({'date_end': -1}).exec(function(err, work){
				if(err){
					throw err;
				}else
				res.json(work);
			});
          }       
      }else
      res.json({ success: false, message: 'Lỗi bảo mật!'});
      }
    });
});

router.post("/cuslist",function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
	var secret = req.body.secret;
	var cusid = req.body.nt7_id_customer;
	var userid = req.userid;
    User.findOne({_id:userid},{_id_company: 1,supper:1},function(err,userkey){
      if(err){
        res.json({success:false, message:"Lỗi hệ thống!"});
      }else{
        if(secret == config.secret){
          	Work.find({_id_customer: cusid}).populate("_id_status_work",{}).sort({'date_end': -1}).limit(5).exec(function(err, work){
				if(err){
					throw err;
				}else
				res.json(work);
			});       
      }else
      res.json({ success: false, message: 'Lỗi bảo mật!'});
      }
    });
});

router.post("/timelist",function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
	var secret = req.body.secret;
	var userid = req.userid;
    User.findOne({_id:userid},{_id_company: 1,supper:1},function(err,userkey){
      if(err){
        res.json({success:false, message:"Lỗi hệ thống!"});
      }else{
        var idcompany = userkey._id_company;        
        if(secret == config.secret){
        	StatusWork.find({$and:[{_id_company:idcompany},{type:{"$gte": 1, "$lte": 4}}]},{_id:1},function(err,stt){
        	if(err)
        		res.json({success:false, message:"Lỗi hệ thống!"});
	        	Work.find({$and:[{_id_user_received: userid}, {_id_status_work:{ $in : stt }}]}).populate("_id_status_work",{}).sort({'date_end': -1}).exec(function(err, work){
					if(err){
						throw err;
					}else
					res.json(work);
				});
        	});
                
      }else
      res.json({ success: false, message: 'Lỗi bảo mật!'});
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
