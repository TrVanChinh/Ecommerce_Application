const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ShippingUnitSchema = new Schema({
    deliveryTime: Number,
    name: String,
    price: Number,
})

const ShippingUnit = mongoose.model('ShippingUnit', ShippingUnitSchema)
module.exports = ShippingUnit