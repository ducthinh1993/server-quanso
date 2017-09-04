var mongoose = require('mongoose');
var Schema = mongoose.Schema
var CustomerSchema = Schema({ 
	name: String,
	address: String,
	city: String,
	phone: String,
	email: String,
	present: String,
	comment: String,
	created_at: { type: Date, default: Date.now },
	name_parner: String,
	_id_parner: { type: Schema.ObjectId, ref: 'Parner' },
	_id_company: { type: Schema.ObjectId, ref: 'Company' },
});

module.exports = mongoose.model('Customer', CustomerSchema);