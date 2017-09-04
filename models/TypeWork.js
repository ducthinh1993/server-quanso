var mongoose = require('mongoose');
var Schema = mongoose.Schema
var TypeWorkSchema = Schema({
	_id_company: { type: Schema.ObjectId, ref: 'Company' },
	name: String, 
	score: Number,
});

module.exports = mongoose.model('TypeWork', TypeWorkSchema);