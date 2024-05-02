require("dotenv").config()
//mongodb user model
const User = require('../models/User')
const Product = require('../models/Product')

exports.getOneProduct =  (req, res) => { 
    const { id } = req.params; 
    if(!id){
        res.json({
            status: "FAILED",
            message: "idProduct null"
        })
    } else {
        Product.findById(id)
        .then(data => {
             res.json({
                 status: "SUCCESS",
                 data: data
             })
         })
        .catch(err => {
             res.json({
                 status: "FAILED",
                 message: err.message
             })
         })
    }

}



exports.getInfoShop = async (req, res) => { 
    const { id } = req.params;
    if(!id){
        res.json({
            status: "FAILED",
            message: "idShop null"
        })
    } else {
        const user = await User.findById(id) 
        await Product.find({ "idShop": id })
        .then(data => {
             res.json({
                 status: "SUCCESS",
                 data: {data, user}
             })
         })
        .catch(err => {
             res.json({
                 status: "FAILED",
                 message: err.message
             })
         })
    }

}

