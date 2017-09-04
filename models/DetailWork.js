var mongoose = require('mongoose');
var Schema = mongoose.Schema
var DetailWorkSchema = Schema({
	_id_work: { type: Schema.ObjectId, ref: 'Work' },
	_id_product: { type: Schema.ObjectId, ref: 'Product' },
	_id_unit: { type: Schema.ObjectId, ref: 'Unit' },

	qty: Number, 
	price_out: Number,
	total: Number,
});

module.exports = mongoose.model('DetailWork', DetailWorkSchema); 
