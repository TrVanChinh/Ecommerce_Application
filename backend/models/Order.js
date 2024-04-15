const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    idShop: String,
    idUser:String,
    status:String,
    totalByShop:Number,
    idShippingUnit:String,
    createAt: { 
        type:Date,
        default:Date.now
    },
    option: [
        {
            idOption: String,
            idProduct: String,
            price: Number,
            quantily: Number,
        }
    ]
})

const order = mongoose.model('order', OrderSchema)
module.exports = order