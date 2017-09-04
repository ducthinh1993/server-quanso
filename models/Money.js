var mongoose = require('mongoose');
var Schema = mongoose.Schema
var MoneySchema = Schema({ 
	amount: Number, //=== số lượng tiền có thể +(dương) hoặc -(âm)
	_id_company: { type: Schema.ObjectId, ref: 'Company' },
	type: String, // theo tên bảng
	content: String,
	color: Number,// xác định màu nền 1 - thu  0 - chi
	time: { type: Date, default: Date.now },
	id_type: String,// có thể là công việc hay nhập xuất hoặc thu chi
	money_end: Number,
	time: { type: Date, default: Date.now },
	
});

module.exports = mongoose.model('Money', MoneySchema);