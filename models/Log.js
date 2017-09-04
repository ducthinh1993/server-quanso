var mongoose = require('mongoose');
var Schema = mongoose.Schema
var LogSchema = Schema({
	_id_company: { type: Schema.ObjectId, ref: 'Company' },
	type: String, // theo  tên bảng
	content: String,
	color: Number,// xác định màu nền 
	time: { type: Date, default: Date.now },
	id_type: String,// có thể là công việc hay nhập xuất
});

module.exports = mongoose.model('Log', LogSchema);