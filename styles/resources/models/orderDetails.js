const mongoose = require('mongoose');

const orderDetail = new mongoose.Schema({
    orderId:{type: String},
    productId:{type: Number},
    quantity:{type: Number},
    price:{type: Number}
});
module.exports = mongoose.models.orderDetail || mongoose.model('orderDetail', orderDetail);