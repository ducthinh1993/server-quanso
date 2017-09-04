var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ProductSchema = Schema({
	name: String,
	price_out: Number,
	price_in: Number,
	price_sale: Number,
	quantity: Number, 
	warning_quantity: Number, 
	
	name_type_product: String,
	name_unit: String,
	name_provider: String,
	content: String,

	_id_type_product: { type: Schema.ObjectId, ref: 'TypeProduct' },
	_id_unit: { type: Schema.ObjectId, ref: 'Unit' },
	_id_provider: { type: Schema.ObjectId, ref: 'Provider' },
	_id_company: { type: Schema.ObjectId, ref: 'Company' },
});

module.exports = mongoose.model('Product', ProductSchema);