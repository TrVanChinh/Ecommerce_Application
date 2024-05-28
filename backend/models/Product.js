const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    name: String,
    description: String,
    idCategory: String,
    idCategoryShop: String,
    idSubCategory: String,
    idShop: String,
    sold: Number,
    createAt: {
        type: Date,
        default: Date.now
    },
    image: [
        {
            url: String,
        }
    ],
    option: [
        {
            imageUrl: String,
            name: String,
            price: Number,
            quantity: Number,
        }
    ]
})

const Product = mongoose.model('Product', ProductSchema)
module.exports = Product