var mongoose = require('mongoose');
var Schema = mongoose.Schema
var BillSchema = Schema({
	type:Number, //0 thu - 1chi
	created_at: String, 
	payer_receiver: String, 
	address: String, 
	reason: String,
	amount: String,
	amount_text: String,
	sign_payer_receiver:String,
	sign_created: String,
	sign_treasurer: String,
	sign_accountant: String,
	sign_director: String,
	confirm_amount: String,
	rate: String,
	converted: String,
	_id_company: { type: Schema.ObjectId, ref: 'Company' },
	_id_user_created: { type: Schema.ObjectId, ref: 'User' },
	confirm_bill: { type: Boolean, default: false }, 
	_id_user_confirm: { type: Schema.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Bill', BillSchema);