const {  mongoose } = require("mongoose");

const Order = new mongoose.Schema({
    orderId:{type: String, required: true},
    userId:{type: String, required: true},
    amount:{type: String, required: true},
    add:{type: String, required: true},
    con:{type: String, required: true}
})

module.exports = mongoose.models.order || mongoose.model('order', Order)