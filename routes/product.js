var express = require('express');
var router = express.Router();
var User = require('../models/User.js');
var Product = require('../models/Product.js');
var TypeProduct = require('../models/TypeProduct.js');
var Unit = require('../models/Unit.js');
var Provider = require('../models/Provider.js');
var Log = require('../models/Log.js');
var config = require('../config');
var jwt = require('jsonwebtoken');

// insert usert
router.post('/',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    var name = req.body.nt7_name;
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
	var typeproname = "";
	var idtypepro = req.body.nt7_id_type_product;
	TypeProduct.findOne({_id:idtypepro},function(err,typepro){
	 	if(err){
	    	res.json({success:false, message:"Lỗi kết nối!"});
	 	}else{
	 		if(!typepro){
	 			res.json({success:false, message:"không tồn tại loại sản phẩm/dịch vụ"})
	 		}else{
	 			typeproname = typepro.name;
	 		}
	 	}
	 });

	var nameunit = "";
	var idunit = req.body.nt7_id_unit;
	Unit.findOne({_id:idunit},function(err,unit){
	 	if(err){
	    	res.json({success:false, message:"Lỗi kết nối!"});
	 	}else{
	 		if(!unit){
	 			res.json({success:false, message:"không tồn tại đơn vị tính!"})
	 		}else{
	 			nameunit = unit.name;
	 		}
	 	}
	 });

	var name_provider = "";
	var idunit = req.body.nt7_id_provider;
	Provider.findOne({_id:idunit},function(err,provider){
	 	if(err){
	    	res.json({success:false, message:"Lỗi kết nối!"});
	 	}else{
	 		if(!provider){
	 			res.json({success:false, message:"không tồn tại nhà cung cấp"})
	 		}else{
	 			name_provider = provider.name;
	 		}
	 	}
	 });

    Product.findOne({ name: name }, function(err, product){
	  if(err) 
	    res.json({success:false, message:"Lỗi kết nối!"});
	  if(!product){
	    Product.create( {
		 		name: req.body.nt7_name,
				price_out: Number(req.body.nt7_price_out.replace(/\./gi,'')),
				price_in: Number(req.body.nt7_price_in.replace(/\./gi,'')),
				price_sale: Number(req.body.nt7_price_sale.replace(/\./gi,'')),
				quantity: Number(req.body.nt7_quantity.replace(/\./gi,'')), 
				warning_quantity: req.body.nt7_warning_quantity, 
				
				name_type_product: typeproname,
				name_unit: nameunit,
				name_provider: name_provider,
				content: req.body.nt7_content,

				_id_type_product: req.body.nt7_id_type_product,
				_id_unit: req.body.nt7_id_unit,
				_id_provider: req.body.nt7_id_provider,
				_id_company: idcompany,
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

router.post('/update',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    var name = req.body.nt7_name;
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
	var typeproname = "";
	var idtypepro = req.body.nt7_id_type_product;
	TypeProduct.findOne({_id:idtypepro},function(err,typepro){
	 	if(err){
	    	res.json({success:false, message:"Lỗi kết nối!"});
	 	}else{
	 		if(!typepro){
	 			res.json({success:false, message:"không tồn tại đối tác"})
	 		}else{
	 			typeproname = typepro.name;
	 		}
	 	}
	 });

	var nameunit = "";
	var idunit = req.body.nt7_id_unit;
	Unit.findOne({_id:idunit},function(err,unit){
	 	if(err){
	    	res.json({success:false, message:"Lỗi kết nối!"});
	 	}else{
	 		if(!unit){
	 			res.json({success:false, message:"không tồn tại đối tác"})
	 		}else{
	 			nameunit = unit.name;
	 		}
	 	}
	 });

	var name_provider = "";
	var idunit = req.body.nt7_id_provider;
	Provider.findOne({_id:idunit},function(err,provider){
	 	if(err){
	    	res.json({success:false, message:"Lỗi kết nối!"});
	 	}else{
	 		if(!provider){
	 			res.json({success:false, message:"không tồn tại đối tác"})
	 		}else{
	 			name_provider = provider.name;
	 		}
	 	}
	 });

    Product.findOne({ _id: req.body.nt7_id }, function(err, product){
	  if(err) 
	    res.json({success:false, message:"Lỗi kết nối!"});
	  if(product){
        	product.name = req.body.nt7_name || product.name; 
			product.price_out =  Number(req.body.nt7_price_out.replace(/\./gi,'')) || product.price_out; 
			product.price_in = Number(req.body.nt7_price_in.replace(/\./gi,'')) || product.price_in; 
			product.price_sale = Number(req.body.nt7_price_sale.replace(/\./gi,'')) || product.price_sale; 
			product.quantity = Number(req.body.nt7_quantity.replace(/\./gi,'')) || product.quantity;  
			product.warning_quantity = req.body.nt7_warning_quantity || product.warning_quantity;  
			
			product.name_type_product = typeproname || product.name_type_product; 
			product.name_unit = nameunit || product.name_unit; 
			product.name_provider = name_provider || product.name_provider; 
			product.content = req.body.nt7_content || product.content; 

			product._id_type_product = req.body.nt7_id_type_product || product._id_type_product; 
			product._id_unit = req.body.nt7_id_unit || product._id_unit; 
			product._id_provider = req.body.nt7_id_provider || product._id_provider; 
			product._id_company = idcompany || product._id_company; 

        // Save the updated document back to the database
        product.save(function (err, product) {
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
            Product.find({},function(err,product){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(product);
          });
          }else{
            Product.find({_id_company: idcompany},function(err,product){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(product);
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
	Product.findOne({_id: id},function(err, product){
		if(err){
            res.json({success:false, message:"Lỗi kết nối!"});			
		}else if(product){
			res.json({success:true, message:"ok", data:product} );
		}else{
            res.json({success:false, message:"Tổ chức không tồn tại"});	
		}
	});
});
router.post('/delete',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
  Product.findByIdAndRemove({_id: id},function(err, product){
    if(err){
        res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(product){
      res.json({success:true, message:"Xóa thành công"});
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
