var mongoose = require('mongoose');
var Schema = mongoose.Schema
var PricenotifySchema = Schema({
	link_image: String, 
	_id_company: { type: Schema.ObjectId, ref: 'Company' },
	_id_user_created: { type: Schema.ObjectId, ref: 'User' },
	name_user_created: String,
	created_at: { type: Date, default: Date.now },	
});

module.exports = mongoose.model('Pricenotify', PricenotifySchema);