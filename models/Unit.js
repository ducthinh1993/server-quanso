var mongoose = require('mongoose');
var Schema = mongoose.Schema
var UnitSchema = Schema({ 
	name: String,
	_id_company: { type: Schema.ObjectId, ref: 'Company' },
});

module.exports = mongoose.model('Unit', UnitSchema);