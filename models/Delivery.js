var mongoose = require('mongoose');
var Schema = mongoose.Schema
var DeliverySchema = Schema({
	_id_company: { type: Schema.ObjectId, ref: 'Company' },

	created_at: String,	
	payer: String, 
	address: String,
	phone: String,

	confirm_amount: String, // ưu tiên
	sign_payer:  String, 
	sign_director: String,
	all_total: Number,

	_id_user_created: { type: Schema.ObjectId, ref: 'User' },

});

module.exports = mongoose.model('Delivery', DeliverySchema);