
var mongoose = require('mongoose');
var Schema = mongoose.Schema
var WorkToTypeWorkSchema = Schema({
	_id_work: { type: Schema.ObjectId, ref: 'Work' },
	name_work: String,
	_id_type_work: { type: Schema.ObjectId, ref: 'TypeWork' },
});

module.exports = mongoose.model('WorkToTypeWork', WorkToTypeWorkSchema);