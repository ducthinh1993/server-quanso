var mongoose = require('mongoose');
var Schema = mongoose.Schema
var DTPSchema = Schema({
	_id_delivery: { type: Schema.ObjectId, ref: 'Delivery' },
	_id_product: { type: Schema.ObjectId, ref: 'Product' },
	_id_unit: { type: Schema.ObjectId, ref: 'Unit' },

	qty: Number, 
	price_out: Number,
	total: Number,

});

module.exports = mongoose.model('DTP', DTPSchema);