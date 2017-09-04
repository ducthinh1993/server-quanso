var mongoose = require('mongoose');
var Schema = mongoose.Schema
var WorkSchema = Schema({
	_id_company: { type: Schema.ObjectId, ref: 'Company' },
	
	name: String, 
	comment: String,
	fee_work: Number,
	priority: Boolean, // ưu tiên
	date_start:  String, 
	date_end: String,
	
	name_status_work: String,
	name_user_received: String,
	name_user_created: String,
	name_customer: String,

	total_all_typework: Number,
	total_all_product: Number,

	total:Number,

	_id_status_work: { type: Schema.ObjectId, ref: 'StatusWork' },
	_id_user_received: { type: Schema.ObjectId, ref: 'User' },
	_id_user_created: { type: Schema.ObjectId, ref: 'User' },
	_id_customer: { type: Schema.ObjectId, ref: 'Customer' },

	created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Work', WorkSchema);