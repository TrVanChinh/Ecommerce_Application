const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    idShop: String,
    idUser:String,
    status:String,
    address: [
        {
            name: String,
            street:String,
            Ward: String,
            District: String,
            city:String,
            mobileNo:String,
        }
    ],
    totalByShop:Number,
    idShippingUnit:String,
    nameShippingUnit:String,
    shippingCost: Number,
    createAt: { 
        type:Date,
        default:Date.now
    },
    option: [
        {
            name: String,
            idOption: String,
            idProduct: String,
            price: Number,
            quantity: Number,
            stock: Number
        }
    ]
})

const order = mongoose.model('order', OrderSchema)
module.exports = order