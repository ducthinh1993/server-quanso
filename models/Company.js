var mongoose = require('mongoose');
var Schema = mongoose.Schema
var CompanySchema = Schema({
	name: String, 
	address: String,
	phone: String,
	email: String,
	website: String,
	slogan: String,
	logo: String,
	info: String,
	mst: String,
	_id_user_leader: { type: Schema.ObjectId, ref: 'User' },
	name_user_leader:String,
	_id_nguoitao: { type: Schema.ObjectId, ref: 'User' },
	create_at: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model('Company', CompanySchema);