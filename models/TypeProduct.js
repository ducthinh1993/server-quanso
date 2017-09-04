var mongoose = require('mongoose');
var Schema = mongoose.Schema
var TypeProductSchema = Schema({
	name: String, 
	money: Boolean, //===tính theo tiền hay không(để tính vào bảng money khi công việc hoàn thành)
	_id_company: { type: Schema.ObjectId, ref: 'Company' },
});

module.exports = mongoose.model('TypeProduct', TypeProductSchema);