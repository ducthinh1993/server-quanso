var express = require('express');
var router = express.Router();
// var Log = require('../models/Log.js');
var User = require('../models/User.js');
var sha256 = require('crypto-js/sha256');
var md5 = require('crypto-js/md5');

var adminSecret = 'quanso123';

router.post('/resetsv', function(req, res, next){
        var secret = req.body.secret;
        if(secret == adminSecret){
          var mongoose = require('mongoose');
          /* Connect to the DB */
          mongoose.connect('mongodb://localhost/QSsoft',function(){
              /* Drop the DB */
              mongoose.connection.db.dropDatabase();
              res.json({message: 'deleted ok'});
          });
          }else{
            res.json({message: 'deleted error'});
          }
});
/* GET /admin */
router.get('/:secret', function(req, res, next) {
  var secret = req.params.secret;
  if(secret == adminSecret){
    User.find({},{idfb:1,name:1,email:1},function(err,user){
      if(err) next(err);
      res.json(user);
    });
  }else{
    res.json({success: false, message: "...!"});
  }
});

router.delete('/:user_id',function(req,res){
        var secret = req.body.secret;
        if(secret == adminSecret){
            User.remove({
                _id: req.params.user_id
            }, function(err, user) {
                if (err)
                    res.send(err);
                res.json({ message: 'Successfully deleted' });
            });
          }else{
            res.json({message: 'deleted all user ^^!'});
          }
        
});

// insert admin
router.post('/',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    var email = req.body.nt7_email;
    console.log(email);
    User.findOne({$or:[{email: email },{supper:1}] }, function(err, user){
    if(err) 
      res.json({success:false, message:"Lỗi hệ thống!"});
    if(!user){
      User.create( {
      name: req.body.nt7_name,
      email: req.body.nt7_email,
      user: req.body.nt7_user,
      pass:  sha256(md5(req.body.nt7_pass)),
      supper: 1,
      }, function (err, user2){
        if(err){                
          res.json({success:false, message:"Không thể tạo mới quản trị viên"});
        }
        else{
          // var token = jwt.sign({ key: user2._id, tid: now }, config.secret);
          // res.json({ success: true, message: 'Authentication success.', token: token, id: user2._id, name: user2.name, info: user2.info, lastip: user2.lastip, lastlogin: user2.lastlogin });
          res.json({ success: true, message: 'Đăng kí thành công!'});
        }
        
      });
    }else{
       res.json({ success: false, message: 'Không thể tạo mới Quản trị viên!'});
    }
  });

});

//---------------------------------------------------------

router.use(function(req, res, next) {
  var secret = req.body.secret || req.query.secret || req.headers['x-access-secret'];
  if (secret == adminSecret) {
    next();
  } else {
    return res.status(403).send({ success: false, message: 'No access.' });
  }
});

//---------------------------------------------------------

/* GET /admin/logs/:id -> List logs */


module.exports = router;
