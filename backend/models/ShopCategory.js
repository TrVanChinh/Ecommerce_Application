const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ShopCategorySchema = new Schema({
    name: String,
})

const ShopCategory = mongoose.model('ShopCategory', ShopCategorySchema)
module.exports = ShopCategory