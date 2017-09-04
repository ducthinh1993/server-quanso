var mongoose = require('mongoose');
var Schema = mongoose.Schema
var GroupSchema = Schema({
	name: String, 
	permission: Array,
	info: String,
	_id_user_leader: { type: Schema.ObjectId, ref: 'User' },
	_id_company: { type: Schema.ObjectId, ref: 'Company' },
});

module.exports = mongoose.model('Group', GroupSchema);