const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InventorySchema = new Schema({
    idProduct: String,
    idShop: String,
    stock: Number,
    option: [
        {
            idOption: String,
            price: Number,
            quantity: Number,
        }
    ],
    createAt: { 
        type:Date,
        default:Date.now
    }
})

const Inventory = mongoose.model('Inventory', InventorySchema)
module.exports = Inventory