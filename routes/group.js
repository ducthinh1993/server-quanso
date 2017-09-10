var express = require('express');
var router = express.Router();
var User = require('../models/User.js');
var Log = require('../models/Log.js');
var config = require('../config');
var jwt = require('jsonwebtoken');
var md5 = require('crypto-js/md5');
var sha256 = require('crypto-js/sha256');

var Group = require('../models/Group.js');

// Parner start
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
  	// var fruits = ["Banana", "Orange", "Apple", "Mango"];
   console.log(JSON.stringify(req.body.nt7_permission));
   // $.each(req.body.nt7_permission, function( index, value ) {
   //    console.log( index + ": " + value );
   //  });

  Group.findOne({name:name},function(err,group){
    if(err){
      res.json({success:false, message:"Lỗi truy suất csdl!"});
    }else if(!group){
      Group.create({
        name: name,
        _id_user_leader: req.body.nt7_id_user_leader,
        _id_company: idcompany,
        permission:  req.body.nt7_permission,
        // permission:  fruits,
		info:  req.body.nt7_info,
      },function(err, group){
        if(err){                
          res.json({success:false, message:"Không thể tạo mới group"});
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

router.post('/update',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
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

  Group.findOne({ _id: id }, function(err, group){
    if(err) 
      res.json({success:false, message:"Lỗi kết nối!"});
    if(group){
        group.name = req.body.nt7_name || group.name; 
        group.permission = req.body.nt7_permission || group.permission;
		  group.info = req.body.nt7_info || group.info;
        group._id_user_leader =  req.body.nt7_id_user_leader || group._id_user_leader; 
        group._id_company =  req.body.nt7_id_company || group._id_company; 

        // Save the updated document back to the database
        group.save(function (err, group) {
            if (err) {
                res.json({success:false, message:"Lỗi kết nối!"});
            }
            res.json({ success: true, message: 'Cập nhật thành công!'});
        });
    }else{
       res.json({ success: false, message: 'Group không tồn tại!'});
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
            Group.find({},function(err,group){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(group);
          });
          }else{
            Group.find({_id_company: idcompany},function(err,group){
            if(err) 
                res.json({success:false, message:"Lỗi kết nối!"});
              res.json(group);
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
      Group.find({_id_company: idcompany},function(err,group){
      if(err) 
          res.json({success:false, message:"Lỗi kết nối!"});
        res.json(group);
      });      
  }else
  res.json({ success: false, message: 'Lỗi bảo mật!'});
});

router.post('/delete',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
  Group.findByIdAndRemove({_id: id},function(err, group){
    if(err){
            res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(group){
      res.json({success:true, message:"User xóa thành công"});
    }else{
            res.json({success:false, message:"User không tồn tại"});  
    }
  });
});

router.post('/item',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  var id = req.body.nt7_id;
  Group.findOne({_id: id},function(err, group){
    if(err){
      res.json({success:false, message:"Lỗi kết nối!"});      
    }else if(group){
      res.json({success:true,message:"thành công", data:group });
    }else{
      res.json({success:false, message:"Đối tác không tồn tại"});  
    }
  });
});
//parner end

module.exports = router;
