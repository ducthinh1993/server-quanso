var express = require('express');
var router = express.Router();
var Company = require('../models/Company.js');
var Log = require('../models/Log.js');
var config = require('../config');
var jwt = require('jsonwebtoken');
var Money = require('../models/Money.js');
var User = require('../models/User.js');
var Bill = require('../models/Bill.js');
var Money = require('../models/Money.js');

var notify = require('./cloud.js');

router.post("/", function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
	
	var userid = req.userid;
	var amount = Number(req.body.nt7_amount.replace(/\./gi,''));
	User.findOne({_id:userid},function(err,user){
		if(err){
			res.json({success: false,message:"lỗi kết nối CSDL!"});
		}
		Bill.create({
			type: req.body.nt7_type, //0 thu - 1chi
			created_at: req.body.nt7_created_at, 
			payer_receiver: req.body.nt7_payer_receiver, 
			address: req.body.nt7_address, 
			reason: req.body.nt7_reason,
			amount: Number(req.body.nt7_amount.replace(/\./gi,'')),
			amount_text: req.body.nt7_amount_text,
			sign_payer_receiver:req.body.nt7_sign_payer_receiver,
			sign_created: req.body.nt7_sign_created,
			sign_treasurer: req.body.nt7_sign_treasurer,
			sign_accountant: req.body.nt7_sign_accountant,
			sign_director: req.body.nt7_sign_director,
			confirm_amount: req.body.nt7_confirm_amount,
			rate: req.body.nt7_rate,
			converted: req.body.nt7_converted,
			_id_company: user._id_company,
			_id_user_created: user._id,
		},function(err, bill){
			if(err){
				res.json({success: false,message:"lỗi kết nối CSDL!"});					
			}else if(!bill){
				res.json({success: false,message:"Tạo phiếu không thành công!"});					
			}else{
				// notify
				if(bill.type ==0){
            		var name_w = user.name + " Vừa lập phiếu thu";
				}else{
            		var name_w = user.name + " Vừa lập phiếu Chi";
				}
				notify(2,name_w,"bill",bill._id);
				// notify
				res.json({success: true,message:"Tạo phiếu thành công!",data: bill});
			}
		});	
	});
});

router.post("/update", function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");

	var userid = req.userid;
	var idbill = req.userid;
	User.findOne({_id:userid},function(err,user){
		if(err){
			res.json({success: false,message:"lỗi kết nối CSDL!"});
		}
		Bill.findOne({_id:idbill},function(err,bill){
			if(err) 
			    res.json({success:false, message:"Lỗi kết nối!"});
		  	if(bill && bill.confirm_bill === false){
				bill.type = req.body.nt7_type || bill.type;  //0 thu - 1chi
				bill.created_at = req.body.nt7_created_at || bill.created_at; 
				bill.payer_receiver = req.body.nt7_payer_receiver || bill.payer_receiver;  
				bill.address = req.body.nt7_address || bill.address; 
				bill.reason = req.body.nt7_reason || bill.reason; 
				bill.amount = Number(req.body.nt7_amount.replace(/\./gi,'')) || bill.amount; 
				bill.amount_text = req.body.nt7_amount_text || bill.amount_text; 
				bill.sign_payer_receiver = req.body.nt7_sign_payer_receiver || bill.sign_payer_receiver; 
				bill.sign_created = req.body.nt7_sign_created || bill.sign_created; 
				bill.sign_treasurer = req.body.nt7_sign_treasurer || bill.sign_accountant; 
				bill.sign_accountant = req.body.nt7_sign_accountant || bill.sign_director; 
				bill.sign_director = req.body.nt7_sign_director || bill.confirm_amount; 
				bill.confirm_amount = req.body.nt7_confirm_amount || bill.confirm_amount; 
				bill.rate = req.body.nt7_rate || bill.rate; 
				bill.converted = req.body.nt7_converted || bill.converted; 
				bill._id_company = user._id_company || bill._id_company; 
				bill._id_user_created = user._id || bill._id_user_created; 
 			
	        	// Save the updated document back to the database
		        bill.save(function (err, bills) {
		            if (err) {
		                res.json({success:false, message:"Lỗi kết nối!"});
		            }
		            // notify
					if(bill.type ==0){
	            		var name_w = user.name + " Vừa sửa phiếu thu";
					}else{
	            		var name_w = user.name + " Vừa sửa phiếu Chi";
					}
					notify(2,name_w,"bill",bills._id);
					// notify
		            res.json({ success: true, message: 'Cập nhật thành công!'});
		        });
		  	}else{
		    	res.json({ success: false, message: 'Hóa đơn đã xác nhận thanh toán hoặc không tồn tại !'});
		  	}
		});

	});
});

router.post("/comfirm",function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");

	var userid = req.userid;
	var idbill = req.userid;
	User.findOne({_id:userid},function(err,user){
		if(err){
			res.json({success: false,message:"lỗi kết nối CSDL!"});
		}
		Bill.findOne({_id:idbill},function(err,bill){
			if(err) {
			    res.json({success:false, message:"Lỗi kết nối!"});
			}else if(!bill){
				res.json({success:false, message:"Hóa đơn không tồn tại!"});
			}else{
				bill.confirm_bill = true; 
				bill._id_user_confirm = userid ; 
				bill.save(function (err, bills) {
		            if (err) {
		                res.json({success:false, message:"Lỗi kết nối!"});
		            }else{

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
			    			var endmoney = Number(money_start) - Number(bill.amount);
			    			var note = "";
			    			if(bill.type == 0){
			    				note = " xác nhận thu";
			    			}else{
			    				note = " xác nhận chi";
			    			}
			    			Money.create({
								amount: bill.amount, //=== số lượng tiền có thể +(dương) hoặc -(âm)
								_id_company: user._id_company,
								type: "bill", // theo tên bảng
								content: user.name + note,
								color: 1,// xác định màu nền 
								id_type: bill._id,// có thể là công việc hay nhập xuất hoặc thu chi
								money_end: endmoney,
					    	},function(err, moneynew){
					    		if(err){
					    			res.json({success: false,message:"lỗi kết nối CSDL!"});
					    		}
					    		Log.create({
							     	_id_company: user._id_company,
									type: "bill", // theo  tên bảng
									content: user.name + note,
									id_type: bill._id,// có thể là công việc hay nhập xuất và log 
							     }, function (err, log){
							      	if(err){                
								       res.json({success:false, message:"Lỗi tạo nhật ký!",err:err});
								    }else{
								       res.json({success:true, message:note+"thành công",data:bill});
								    }
								});	
					    	});
			    		});

		            }
		            // res.json({ success: true, message: 'Cập nhật thành công!'});
		        });
			}


		});

	});
})

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
            Bill.find({}).populate("_id_user_created",{}).exec(function(err,bill){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(bill);
          });
          }else{
            Bill.find({_id_company: idcompany}).populate("_id_user_created",{}).exec(function(err,bill){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(bill);
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
	Bill.findOne({_id: id},function(err, bill){
		if(err){
            res.json({success:false, message:"Lỗi kết nối!"});			
		}else if(bill){
              res.json({success:true, message:"ok", data:bill});			
		}else{
            res.json({success:false, message:"Hóa đơn không tồn tại"});	
		}
	});
});

router.post('/delete',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
  Bill.findByIdAndRemove({_id: id},function(err, bill){
    if(err){
            res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(bill){
      res.json({success:true, message:"Xóa thành công"});
    }else{
            res.json({success:false, message:"Hóa đơn không tồn tại"});  
    }
  });
});

module.exports = router;
