const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: String,
    email:String,
    password:String,
    dateOfBirth:Date,
    avatarUrl:String,
    verified:Boolean,
    addresses: [
        {
            name: String,
            street:String,
            Ward: String,
            District: String,
            city:String,
            mobileNo:String,
        }
    ],
    carts: [
        { 
            optionProductId: String,
            productId:String,
            quantity:Number,
        }
    ],
    wishList: [
        { 
            productId:String,
            createAt: { 
                type:Date,
                default:Date.now
            },
        }
    ],
    
    role: String,
    sellerRequestStatus: String,
    shopDescript: String,
    shopAddress: String,
    shopName: String,
    categoryShop: [
        {
            name: String,
        }
    ]
})

const User = mongoose.model('User', UserSchema)
module.exports = User