const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ShippingUnitSchema = new Schema({
    deliveryTime: String,
    name: String,
    price: String,
})

const ShippingUnit = mongoose.model('ShippingUnit', ShippingUnitSchema)
module.exports = ShippingUnit