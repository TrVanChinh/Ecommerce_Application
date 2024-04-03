const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserVerificationSchema = new Schema({
    userId: String,
    email:String,
    password:String,
    dateOfBirth:Date,
    verified:Boolean,
})

const UserVerification = mongoose.model('User', UserVerificationSchema)
module.exports = UserVerification