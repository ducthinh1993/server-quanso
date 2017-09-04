var express = require('express');
var router = express.Router();
var User = require('../models/User.js');
var config = require('../config');
var jwt = require('jsonwebtoken');
var md5 = require('crypto-js/md5');
var sha256 = require('crypto-js/sha256');
// var Fund = require('../models/Fund.js');

var Parner = require('../models/Parner.js');
var Unit = require('../models/Unit.js');
var TypeProduct = require('../models/TypeProduct.js');
var TypeWork = require('../models/TypeWork.js');
var Provider = require('../models/Provider.js');
var StatusWork = require('../models/StatusWork.js');
var Group = require('../models/Group.js');
var Company = require('../models/Company.js');
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

var smtpTransport = nodemailer.createTransport(smtpTransport({
    host : "smtp-mail.outlook.com",
    secureConnection : false,
    port: 587,
    auth : {
        user : config.mail.user,
        pass : config.mail.pass
    }
}));

var multer  =   require('multer');

var imguser = "";
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    if(process.platform === 'win32'){
    callback(null, '../public/avatar');
    }else{
      callback(null, './public/avatar');
    }
    
  },
  filename: function (req, file, callback) {
    imguser = Date.now()+file.originalname;
    callback(null, imguser); 
    
  }  
});
var upload = multer({ storage : storage}).single('avatar');

function uploadfile(req,res){
  upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
};

function randcode()
      {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 25; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
      }


function SentMailer(req, res, Email, Active){
  var linkAc = config.linkWeb+"/v1/active/"+Active;
  var mailOptions={
    from: config.mail.from,
    to: Email,
    subject: 'Zomo App - Kích hoạt người dùng!',
    html: '<h3>Kích hoạt người dùng!</h3></br>Thân chào!</br><b><i>Click <a href="'+linkAc+'">vào đây!</a> để kích hoạt </i></b></br>Đây là Mail hệ thống, vui lòng ko  trả lời Mail này!'
    };    
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            res.end("error");
        }else{
            console.log(response.response.toString());
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
/* POST /register -> Register user */
router.get('/mahoa',function(req,res,next){
  var code = "nguyennam.90st";
  console.log(md5("nguyennam.90st"));
  res.json({ok : md5(code) });
});

router.post('/login',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    var user = req.body.user;
    var pass = sha256(md5(req.body.pass));
    // var pass = req.body.pass;
    var now = Date.now(); //new Date() 
    User.findOne({user: user}).populate("_id_company",{}).exec(function(err,user){
      if(err){
        res.json({success: false, message:"Lỗi hệ thống"});
      }else if(!user){
        res.json({success:false, message:"Tên đăng nhập không đúng!"});
      }else if(user.pass != pass){
        res.json({success:false, message:"Mật khẩu nhập không đúng!"});
      }else{
          var token = jwt.sign({ key: user._id, tid: now }, config.secret);          
          if(user.supper != 1 ){
          	  Group.findOne({_id:user._id_group},function(err, group){
	          	if(err){
			    	res.json({success: false, message:"Lỗi hệ thống"});
			    }else if(!group){
			        res.json({success:false, message:"không tồn tại nhóm!"});
			    }else{                
	          		res.json({ success: true, message: 'Đăng nhập thành công', token: token, data : user, permission:group.permission}); 
			    }
	          });
          }else{
	          	res.json({ success: true, message: 'Đăng nhập thành công', token: token, data : user, group:"all"}); 
          }
          
      }
    });
});



router.use('/', function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // console.log(req.body.token );
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if (decoded.key != req.params.id) return res.json({ success: false, message: 'Hack?' });
        req.userid = decoded.key;        
        next();
      }
    });
  } else {
    return res.status(403).send({ success: false, message: 'No token provided.' });
  }
});
router.post('/count',function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  var userid = req.userid;  
  User.findOne({_id:userid},function(err, user){    
      if (err || !user){
        res.json({success:false, message:"Lỗi!"});        
      }else{
        if(user.supper != 1){
          var count = [];
          var numco = 1;
          Group.count({_id_company: user._id_company}, function(err, group){
            var numgroup = group;
            User.count({_id_company: user._id_company}, function(err, user){
              var numuser = user;            
              count.push(numco,numgroup,numuser);
              console.log(count);
              res.json({ success: true, count: count});               
            });
          });
           
        }else{
            Company.count({}, function(err, company){
              var count = [];
              var numco = company;
              Group.count({}, function(err, group){
                  var numgroup = group;
                User.count({}, function(err, user){
                  var numuser = user;                
                  count.push(numco,numgroup,numuser);
                  console.log(count);
                  res.json({ success: true, count: count});               
                });
              });
            });
          }       
      }
    });
})
var permis =  function(userid, key,req ,res){
  var userid = req.userid;  
	User.findOne({_id:iduser},function(err, user){		
    	if (err || !user){
  			res.json({success:false, message:"Lỗi!"});    		
    	}else{
    		if(user.supper != 1){
				Group.findOne({_id:user._id_group},function(err, group){
		          	if(err || !group){
  						res.json({success:false, message:"Lỗi!"});    		
				    }else{
						var perlist = group.permission;
		          		if(perlist.indexOf(key)<0){
  							    res.json({success:false, message:"bạn không có quyền ở mục này!"});
		          		}
				    }
		          });
    		}   		
    	}
    });
}
// Parner start
router.post('/parner',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var userid = req.userid;  
  permis(userid, "con_nguoi",req ,res);
  var name = req.body.nt7_name;
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

  Parner.findOne({name:name},function(err,parner){
    if(err){
      res.json({success:false, message:"Lỗi truy suất csdl!"});
    }else if(!parner){
      Parner.create({
        name: name,
        _id_company:idcompany,
      },function(err, parnerok){
        if(err){                
          res.json({success:false, message:"Không thể tạo mới parner"});
        }
        else{
          res.json({ success: true, message: 'tạo mới thành công!'});
        }
      });
    }else{
      res.json({success:false, message:"Tên đối tác đã tồn tại!"});
    }
  });
});

router.post('/parner/update',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
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

  Parner.findOne({ _id: id }, function(err, parner){
    if(err) 
      res.json({success:false, message:"Lỗi kết nối!"});
    if(parner){
        parner.name = req.body.nt7_name || parner.name; 
        parner._id_company =  req.body.nt7__id_company || parner._id_company; 

        // Save the updated document back to the database
        parner.save(function (err, parner) {
            if (err) {
                res.json({success:false, message:"Lỗi kết nối!"});
            }
            res.json({ success: true, message: 'Cập nhật thành công!'});
        });
    }else{
       res.json({ success: false, message: 'Parner không tồn tại!'});
    }
  });
});

router.post("/parner/list",function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");  
  var userid = req.userid;  
  var key = "con_nguoi";
//   var check = permis(userid,key,req,res,next);
  	var secret = req.body.secret;
    User.findOne({_id:userid},{_id_company: 1,supper:1},function(err,userkey){
      if(err){
        res.json({success:false, message:"Lỗi hệ thống!"});
      }else{
        var idcompany = userkey._id_company;
        if(secret == config.secret){
          if(userkey.supper==1){
            Parner.find({},function(err,parner){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(parner);
          });
          }else{
            Parner.find({_id_company: idcompany},function(err,parner){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(parner);
          });
          }       
      }else
      res.json({ success: false, message: 'Lỗi bảo mật!'});
      }
    });
  
});

router.post('/parner/delete',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
  Parner.findByIdAndRemove({_id: id},function(err, parner){
    if(err){
            res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(parner){
      res.json({success:true, message:"User xóa thành công"});
    }else{
            res.json({success:false, message:"User không tồn tại"});  
    }
  });
});

router.post('/parner/item',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
  Parner.findOne({_id: id},function(err, parner){
    if(err){
            res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(parner){
      res.json({success:true,message:"thành công", data:parner });
    }else{
            res.json({success:false, message:"Đối tác không tồn tại"});  
    }
  });
});
//parner end
// Unit start
router.post('/unit',function(req,res,next){
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
        Unit.findOne({$and:[{name:name},{_id_company:idcompany}]},function(err,unit){
          if(err){
            res.json({success:false, message:"Lỗi truy suất csdl!"});
          }else if(!unit){
            Unit.create({
              name: name,
              _id_company:idcompany,
            },function(err, unitok){
              if(err){                
                res.json({success:false, message:"Không thể tạo mới unit"});
              }
              else{
                res.json({ success: true, message: 'tạo mới thành công!'});
              }
            });
          }else{
            res.json({success:false, message:"Tên đối tác đã tồn tại!"});
          }
        });
      }
    });
  }else{
    idcompany = req.body.nt7_id_company;
        Unit.findOne({$and:[{name:name},{_id_company:idcompany}]},function(err,unit){
          if(err){
            res.json({success:false, message:"Lỗi truy suất csdl!"});
          }else if(!unit){
            Unit.create({
              name: name,
              _id_company:idcompany,
            },function(err, unitok){
              if(err){                
                res.json({success:false, message:"Không thể tạo mới unit"});
              }
              else{
                res.json({ success: true, message: 'tạo mới thành công!'});
              }
            });
          }else{
            res.json({success:false, message:"Tên đối tác đã tồn tại!"});
          }
        });
  } 

  
});

router.post('/unit/update',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
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

  Unit.findOne({ _id: id }, function(err, unit){
    if(err) 
      res.json({success:false, message:"Lỗi kết nối!"});
    if(unit){
        unit.name = req.body.nt7_name || unit.name; 
        unit._id_company =  req.body.nt7_id_company || unit._id_company; 

        // Save the updated document back to the database
        unit.save(function (err, unit) {
            if (err) {
                res.json({success:false, message:"Lỗi kết nối!"});
            }
            res.json({ success: true, message: 'Cập nhật thành công!'});
        });
    }else{
       res.json({ success: false, message: 'Đơn vị tính không tồn tại!'});
    }
  });
});

router.post("/unit/list",function(req,res,next){
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
            Unit.find({},function(err,unit){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(unit);
          });
          }else{
            Unit.find({_id_company: idcompany},function(err,unit){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(unit);
          });
          }       
      }else
      res.json({ success: false, message: 'Lỗi bảo mật!'});
      }
    });
});

router.post('/unit/delete',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
  Unit.findByIdAndRemove({_id: id},function(err, unit){
    if(err){
            res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(unit){
      res.json({success:true, message:"User xóa thành công"});
    }else{
            res.json({success:false, message:"User không tồn tại"});  
    }
  });
});

router.post('/unit/item',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
  Unit.findOne({_id: id},function(err, unit){
    if(err){
      res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(unit){
      res.json({success:true,message:"thành công", data:unit });
    }else{
      res.json({success:false, message:"Đối tác không tồn tại"});  
    }
  });
});
// unit end
// Type Product start
router.post('/typeproduct',function(req,res,next){
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
        TypeProduct.findOne({$and:[{name:name},{_id_company:idcompany}]},function(err,typepro){
          if(err){
            res.json({success:false, message:"Lỗi truy suất csdl!"});
          }else if(!typepro){
            TypeProduct.create({
              name: name, 
              money: req.body.nt7_money, //===tính theo tiền hay không(để tính vào bảng money khi công việc hoàn thành)
              _id_company: idcompany,
            },function(err, typepro){
              if(err){                
                res.json({success:false, message:"Không thể tạo mới loại công việc điểm thưởng"});
              }
              else{
                res.json({ success: true, message: 'tạo mới thành công!'});
              }
            });
          }else{
            res.json({success:false, message:"Tên điểm thưởng đã tồn tại!"});
          }
        });
      }
    });
  }else{
    idcompany = req.body.nt7_id_company;
    TypeProduct.findOne({$and:[{name:name},{_id_company:idcompany}]},function(err,typepro){
      if(err){
        res.json({success:false, message:"Lỗi truy suất csdl!"});
      }else if(!typepro){
        TypeProduct.create({
          name: name, 
          money: req.body.nt7_money, //===tính theo tiền hay không(để tính vào bảng money khi công việc hoàn thành)
          _id_company: idcompany,
        },function(err, typepro){
          if(err){                
            res.json({success:false, message:"Không thể tạo mới loại công việc điểm thưởng"});
          }
          else{
            res.json({ success: true, message: 'tạo mới thành công!'});
          }
        });
      }else{
        res.json({success:false, message:"Tên điểm thưởng đã tồn tại!"});
      }
    });
  } 

  
});

router.post('/typeproduct/update',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
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
  var checkmoney = "";
  if(!req.body.nt7_money){
    checkmoney = false;
  }else{
    checkmoney = req.body.nt7_money;    
  }
  TypeProduct.findOne({ _id: id }, function(err, typepro){
    if(err) 
      res.json({success:false, message:"Lỗi kết nối!"});
    if(typepro){
        typepro.name = req.body.nt7_name || typepro.name; 
        typepro.money = checkmoney ; 
        typepro._id_company =  req.body.nt7_id_company || typepro._id_company; 

        // Save the updated document back to the database
        typepro.save(function (err, typepro) {
            if (err) {
                res.json({success:false, message:"Lỗi kết nối!"});
            }
            res.json({ success: true, message: 'Cập nhật thành công!'});
        });
    }else{
       res.json({ success: false, message: 'Loại sản phẩm không tồn tại!'});
    }
  });
});

router.post("/typeproduct/list",function(req,res,next){
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
            TypeProduct.find({},function(err,typepro){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(typepro);
          });
          }else{
            TypeProduct.find({_id_company: idcompany},function(err,typepro){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(typepro);
          });
          }       
      }else
      res.json({ success: false, message: 'Lỗi bảo mật!'});
      }
    });
});

router.post('/typeproduct/delete',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
  TypeProduct.findByIdAndRemove({_id: id},function(err, typepro){
    if(err){
      res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(typepro){
      res.json({success:true, message:"Loại sản phẩm xóa thành công"});
    }else{
      res.json({success:false, message:"Loại sản phẩm không tồn tại"});  
    }
  });
});

router.post('/typeproduct/item',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
  TypeProduct.findOne({_id: id},function(err, typepro){
    if(err){
            res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(typepro){
      res.json({success:true,message:"thành công", data:typepro });
    }else{
            res.json({success:false, message:"Loại sản phẩm không tồn tại"});  
    }
  });
});
//Type Product end
// Type Product start
router.post('/typework',function(req,res,next){
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
        TypeWork.findOne({$and:[{name:name},{_id_company:idcompany}]},function(err,typework){
          if(err){
            res.json({success:false, message:"Lỗi truy suất csdl!"});
          }else if(!typework){
            TypeWork.create({
              name: name, 
              score: req.body.nt7_score, 
              _id_company: idcompany,
            },function(err, typework){
              if(err){                
                res.json({success:false, message:"Không thể tạo mới loại công việc"});
              }
              else{
                res.json({ success: true, message: 'tạo mới thành công!'});
              }
            });
          }else{
            res.json({success:false, message:"Tên đối tác đã tồn tại!"});
          }
        });
      }
    });
  }else{
    idcompany = req.body.nt7_id_company;
    TypeWork.findOne({$and:[{name:name},{_id_company:idcompany}]},function(err,typework){
      if(err){
        res.json({success:false, message:"Lỗi truy suất csdl!"});
      }else if(!typework){
        TypeWork.create({
          name: name, 
          score: req.body.nt7_score, 
          _id_company: idcompany,
        },function(err, typework){
          if(err){                
            res.json({success:false, message:"Không thể tạo mới loại công việc"});
          }
          else{
            res.json({ success: true, message: 'tạo mới thành công!'});
          }
        });
      }else{
        res.json({success:false, message:"Tên đối tác đã tồn tại!"});
      }
    });
  } 

  
});

router.post('/typework/update',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
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

  TypeWork.findOne({ _id: id }, function(err, typework){
    if(err) 
      res.json({success:false, message:"Lỗi kết nối!"});
    if(typework){
        typework.name = req.body.nt7_name || typework.name; 
        typework.score = req.body.nt7_score || typework.score; 
        typework._id_company =  req.body.nt7_id_company || typework._id_company; 

        // Save the updated document back to the database
        typework.save(function (err, typework) {
            if (err) {
                res.json({success:false, message:"Lỗi kết nối!"});
            }
            res.json({ success: true, message: 'Cập nhật thành công!'});
        });
    }else{
       res.json({ success: false, message: 'Loại công việc không tồn tại!'});
    }
  });
});

router.post("/typework/list",function(req,res,next){
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
            TypeWork.find({},function(err,typework){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(typework);
          });
          }else{
            TypeWork.find({_id_company: idcompany},function(err,typework){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(typework);
          });
          }       
      }else
      res.json({ success: false, message: 'Lỗi bảo mật!'});
      }
    });
});

router.post('/typework/delete',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
  TypeWork.findByIdAndRemove({_id: id},function(err, typework){
    if(err){
            res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(typework){
      res.json({success:true, message:"Loại việc xóa thành công"});
    }else{
            res.json({success:false, message:"Loại việc không tồn tại"});  
    }
  });
});

router.post('/typework/item',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
  TypeWork.findOne({_id: id},function(err, typework){
    if(err){
            res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(typework){
      res.json({success:true,message:"thành công", data:typework });
    }else{
            res.json({success:false, message:"Loại việc không tồn tại"});  
    }
  });
});
//Type Product end
// Type Product start
router.post('/provider',function(req,res,next){
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
        Provider.findOne({$and:[{name:name},{_id_company:idcompany}]},function(err,provider){
          if(err){
            res.json({success:false, message:"Lỗi truy suất csdl!"});
          }else if(!provider){
            Provider.create({
              name: name, 
              _id_company: idcompany,
            },function(err, provider){
              if(err){                
                res.json({success:false, message:"Không thể tạo mới nhà cung cấp"});
              }
              else{
                res.json({ success: true, message: 'tạo mới thành công!'});
              }
            });
          }else{
            res.json({success:false, message:"Tên nhà cung cấp đã tồn tại!"});
          }
        });
      }
    });
  }else{
    idcompany = req.body.nt7_id_company;
    Provider.findOne({$and:[{name:name},{_id_company:idcompany}]},function(err,provider){
      if(err){
        res.json({success:false, message:"Lỗi truy suất csdl!"});
      }else if(!provider){
        Provider.create({
          name: name, 
          _id_company: idcompany,
        },function(err, provider){
          if(err){                
            res.json({success:false, message:"Không thể tạo mới nhà cung cấp"});
          }
          else{
            res.json({ success: true, message: 'tạo mới thành công!'});
          }
        });
      }else{
        res.json({success:false, message:"Tên nhà cung cấp đã tồn tại!"});
      }
    });
  } 

  
});

router.post('/provider/update',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
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

  Provider.findOne({ _id: id }, function(err, provider){
    if(err) 
      res.json({success:false, message:"Lỗi kết nối!"});
    if(provider){
        provider.name = req.body.nt7_name || provider.name;  
        provider._id_company =  req.body.nt7_id_company || provider._id_company; 

        // Save the updated document back to the database
        provider.save(function (err, provider) {
            if (err) {
                res.json({success:false, message:"Lỗi kết nối!"});
            }
            res.json({ success: true, message: 'Cập nhật thành công!'});
        });
    }else{
       res.json({ success: false, message: 'nhà cung cấp không tồn tại!'});
    }
  });
});

router.post("/provider/list",function(req,res,next){
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
            Provider.find({},function(err,provider){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(provider);
          });
          }else{
            Provider.find({_id_company: idcompany},function(err,provider){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(provider);
          });
          }       
      }else
      res.json({ success: false, message: 'Lỗi bảo mật!'});
      }
    });
});

router.post('/provider/delete',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
  Provider.findByIdAndRemove({_id: id},function(err, provider){
    if(err){
            res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(provider){
      res.json({success:true, message:"Nhà cung cấp xóa thành công"});
    }else{
            res.json({success:false, message:"Nhà cung cấp không tồn tại"});  
    }
  });
});

router.post('/provider/item',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
  Provider.findOne({_id: id},function(err, provider){
    if(err){
            res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(provider){
      res.json({success:true,message:"thành công", data:provider });
    }else{
            res.json({success:false, message:"Nhà cung cấp không tồn tại"});  
    }
  });
});
//Provider end
// Type status work start
router.post('/statuswork',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var type = req.body.nt7_type;
  var idcompany = "fff";
  var userid = req.userid;

  if(!req.body.nt7_id_company){
    User.findOne({_id:userid},{_id_company:1},function(err,userkey){
      if(err){
        res.json({success:false, message:"Lỗi hệ thống!"});
      }else{
        idcompany = userkey._id_company;
        StatusWork.findOne({$and:[{_id_company:idcompany},{type:type}]},function(err,status){
          if(err){
            res.json({success:false, message:"Lỗi truy suất csdl!"});
          }else if(!status){
            StatusWork.create({
              name: req.body.nt7_name,
              name_2: req.body.nt7_name_2,
              color: req.body.nt7_color,
              icon: req.body.nt7_icon,
              type: type,
              _id_company:idcompany,
            },function(err, status){
              if(err){                
                res.json({success:false, message:"Không thể tạo mới "});
              }
              else{
                res.json({ success: true, message: 'tạo mới thành công!'});
              }
            });
          }else{
            res.json({success:false, message:"Ý nghĩa trạng thái đã tồn tại!"});
          }
        });

      }
    });
  }else{
    idcompany = req.body.nt7_id_company;
    StatusWork.findOne({$and:[{_id_company:idcompany},{type:type}]},function(err,status){
      if(err){
        res.json({success:false, message:"Lỗi truy suất csdl!"});
      }else if(!status){
        StatusWork.create({
          name: req.body.nt7_name,
          name_2: req.body.nt7_name_2,
          color: req.body.nt7_color,
          icon: req.body.nt7_icon,
          type: type,
          _id_company:idcompany,
        },function(err, status){
          if(err){                
            res.json({success:false, message:"Không thể tạo mới "});
          }
          else{
            res.json({ success: true, message: 'tạo mới thành công!'});
          }
        });
      }else{
        res.json({success:false, message:"Ý nghĩa trạng thái đã tồn tại!"});
      }
    });
  } 
  
});

router.post('/statuswork/update',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
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

  StatusWork.findOne({ _id: id }, function(err, status){
    if(err) 
      res.json({success:false, message:"Lỗi kết nối!"});
    if(status){
        status.name = req.body.nt7_name || status.name;  
        status.name_2 = req.body.nt7_name_2 || status.name_2;  
        status.color = req.body.nt7_color || status.color;  
        status.icon = req.body.nt7_icon || status.icon;  
        status.type = req.body.nt7_type || status.type;  
        status._id_company =  req.body.nt7_id_company || status._id_company; 

        // Save the updated document back to the database
        status.save(function (err, status) {
            if (err) {
                res.json({success:false, message:"Lỗi kết nối!"});
            }
            res.json({ success: true, message: 'Cập nhật thành công!'});
        });
    }else{
       res.json({ success: false, message: 'trạng thái công việc không tồn tại!'});
    }
  });
});

router.post("/statuswork/list",function(req,res,next){
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
            StatusWork.find({},function(err,status){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(status);
          });
          }else{
            StatusWork.find({_id_company: idcompany},function(err,status){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(status);
          });
          }       
      }else
      res.json({ success: false, message: 'Lỗi bảo mật!'});
      }
    });
});

router.post('/statuswork/delete',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
  StatusWork.findByIdAndRemove({_id: id},function(err, status){
    if(err){
            res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(status){
      res.json({success:true, message:"Trang thái công việc xóa thành công"});
    }else{
            res.json({success:false, message:"Trạng thái công việc không tồn tại"});  
    }
  });
});

router.post('/statuswork/item',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
  StatusWork.findOne({_id: id},function(err, status){
    if(err){
            res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(status){
      res.json({success:true,message:"thành công", data:status });
    }else{
            res.json({success:false, message:"Trạng thái công việc không tồn tại"});  
    }
  });
});
//status work end

module.exports = router;
