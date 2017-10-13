var mongoose = require('mongoose');
var Schema = mongoose.Schema
var UserSchema = Schema({
  _id_company: { type: Schema.ObjectId, ref: 'Company' },
  name:String,
  email: String, 
  address: String,
  phone: String, 
  cmnd: String, 
  _id_group: { type: Schema.ObjectId, ref: 'Group' },
  comment:String,
  birthplace: String,
  birthday:String,
  position:String,
  image:String,
  level: Number,
  name_level: String,
  create: { type: Date, default: Date.now }, 
  update: { type: Date, default: Date.now },
  user:String,
  pass: String,
  tokenfb: String,
  supper:  { type: Number, default: 0 },
  lastip: String, lastlogin: Date,
});

module.exports = mongoose.model('User', UserSchema);
