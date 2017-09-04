var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ProviderSchema = Schema({
	name: String,
	_id_company: { type: Schema.ObjectId, ref: 'Company' },
});

module.exports = mongoose.model('Provider', ProviderSchema);