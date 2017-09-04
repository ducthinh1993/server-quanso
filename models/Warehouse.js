var mongoose = require('mongoose');
var Schema = mongoose.Schema
var WarehouseSchema = Schema({
	type: String, //===NHAP-XUAT-HIEUCHINH-XUABAN
	price_type: Number, //===giá để NHAP-XUAT-XUABAN
	quantity_type: Number,  //===số lượng để NHAP-XUAT-HIEUCHINH-XUABAN
	created_at: { type: Date, default: Date.now },
	name_user_created: String,
	name_product: String,
	content:String,
	_id_user_created: { type: Schema.ObjectId, ref: 'User' },
	_id_product: { type: Schema.ObjectId, ref: 'Product' },
	_id_company: { type: Schema.ObjectId, ref: 'Company' },
});

module.exports = mongoose.model('Warehouse', WarehouseSchema);