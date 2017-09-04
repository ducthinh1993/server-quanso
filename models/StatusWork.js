var mongoose = require('mongoose');
var Schema = mongoose.Schema
var StatusWorkSchema = Schema({ 
	name: String,
	name_2: String,
	color: String,
	icon: String,
	type: Number, // 1 đang chờ, 2 đã nhận, 3 đang thực hiện, 4 đã xong, 5 hoàn tất, 6 hủy
  	_id_company: { type: Schema.ObjectId, ref: 'Company' },
});

module.exports = mongoose.model('StatusWork', StatusWorkSchema);