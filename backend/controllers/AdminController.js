require("dotenv").config()
//mongodb user model
const Admin = require('../models/Admin')
const User = require('../models/User')
const ShippingUnit = require('../models/ShippingUnit')

const bcrypt = require('bcrypt')
//email handler
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
})
//login Admin
exports.signin = (req, res) => {
    let {email, password} = req.body
    email = email.trim(),
    password = password.trim()

    if(email == "" || password == "") {
        res.json({
            status:"FAILED",
            message:"Empty credentials supplied"
        })
    } else {
        Admin.find({email})
        .then(data => {
            if(data) {
                const hashedPassword = data[0].password
                bcrypt.compare(password, hashedPassword).then(result => {
                    if(result) {
                        res.json({
                            status:"SUCCESS",
                            message:"Signin successfully!",
                            data: data
                        })
                    } else {
                        res.json({
                            status:"FAILED",
                            message:"Incorrect password!"
                        })
                    }
                })
                .catch(err => {
                    res.json({
                        status:"FAILED",
                        message: "An error occurred while comparing passwords!"
                    })
                })  
            } else {
                res.json({
                    status:"FAILED",
                    message:"Invalid credentials supplied!"
                })
            }
            
        })
        .catch(err => {
            console.log(err)
            res.json({
                status:"FAILED",
                message: "An error occurred while checking for existing user!"
            })
        })
    }
}

//add admin
exports.addAdmin = (req, res) => {
    let {name, email, password} = req.body
    name = name.trim()
    email = email.trim()
    password = password.trim()

    if(name === '' || email === '' || password === ''){
        res.json({
            status:"FAILED",
            message:"Empty input fields!"
        })
    }else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status:"FAILED",
            message:"Invalid email entered!"
        })
    }else if(password.length < 8) {
        res.json({
            status:"FAILED",
            message:"Password must be at least 8 characters long!"
        })
    } else {
        //checking if user already exists
        Admin.find({email}).then(result => {
            if(result.length){
                res.json({
                    status:"FAILED",
                    message:"user with the provided email already exists"
                })
            }else{
                //create new user

                //password handling
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new Admin({
                        name,
                        email,
                        password: hashedPassword,
                    })

                    newUser.save().then((result) => {
                        res.json({
                            status:"SUCCESS",
                            message:"Add admin successfully!",
                            data: result,
                        })
                    }).catch(err => {
                        res.json({
                            status:"FAILED",
                            message: "An error occurred while saving user account!"
                        })
                    })
                    
                }).catch(err => {
                    res.json({
                        status:"FAILED",
                        message: "An error occurred while hashing the password!"
                    })  

                })
                
            }
        }).catch(err => {
            console.log(err)
            res.json({
                status:"FAILED",
                message: "An error occurred while checking for existing user!"
            })
        })   
        
    }
}

// Show category
exports.ShowListAdmin = async (req, res) => { 
    try {
        const admins = await Admin.find();
        res.json({
            status: 'SUCCESS',
            message: 'List of categories',
            data: admins
        });
    } catch (error) {
        res.status(500).json({
            status: 'FAILED',
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
}

//Approve your request to become a seller
exports.approveSaleRequest = async (req, res) => {
    let {userId} = req.body
    if( userId == "") {
        res.json({
            status:"FAILED",
            message:"Empty credentials supplied"
        })
    } else {
        User.findOne({ "_id": userId })
        .then(async data => {
            if(data) {
                data.sellerRequestStatus = "SUCCESS";
                data.role = "seller"
                await data.save();
                //mail options
                const mailOptions = {
                    from: process.env.AUTH_EMAIL,
                    to: data.email,
                    subject: 'You have become a seller',
                    html: `<p>Your request to become a seller has been accepted</p>`
                }

                await transporter.sendMail(mailOptions)
                res.json({
                    status: "SUCCESS",
                    message: "The request has been accepted"
                });
            } else {
                res.json({
                    status:"FAILED",
                    message:"Invalid credentials!"
                })
            }
            
        }).catch(err => {
            res.json({
                status:"FAILED",
                message: err
            })
        })   
    }
}

//Reject your request to become a seller
exports.rejectSaleRequest = async (req, res) => {
    let {userId} = req.body
    if( userId == "") {
        res.json({
            status:"FAILED",
            message:"Empty credentials supplied"
        })
    } else {
        User.findOne({ "_id": userId })
        .then(async data => {
            if(data) {
                data.sellerRequestStatus = "rejected";
                await data.save();
                //mail options
                const mailOptions = {
                    from: process.env.AUTH_EMAIL,
                    to: data.email,
                    subject: 'Reject your request to become a seller',
                    html: `<p>Your request was rejected because it did not comply with the user agreement. Try again.</p>`
                }

                await transporter.sendMail(mailOptions)
                res.json({
                    status: "SUCCESS",
                    message: "Request rejected successfully"
                });
            } else {
                res.json({
                    status:"FAILED",
                    message:"Invalid credentials!"
                })
            }
            
        }).catch(err => {
            res.json({
                status:"FAILED",
                message: err
            })
        })   
    }
}

//add shippingUnit
exports.addShippingUnit = (req, res) => {
    let {deliveryTime, name, price} = req.body

    if(name === '' || deliveryTime === '' || price === ''){
        res.json({
            status:"FAILED",
            message:"Empty input fields!"
        })
    }else if(isNaN(price) && typeof price !== 'number'){
        res.json({
            status:"FAILED",
            message:"The value of price time must be numeric!"
        })
    }else if(isNaN(deliveryTime) && typeof deliveryTime !== 'number'){
        res.json({
            status:"FAILED",
            message:"The value of delivery time must be numeric!"
        })
    } else {
        //checking if user already exists
        ShippingUnit.find({name}).then(result => {
            if(result.length){
                res.json({
                    status:"FAILED",
                    message:"The shipping Unit whose name is provided already exists"
                })
            }else{
                const shippingUnit = new ShippingUnit({
                    name,
                    price,
                    deliveryTime
                })
                shippingUnit.save()
                .then((result) => {
                    res.json({
                        status:"SUCCESS",
                        message:"Add shipping Unit successfully!",
                        data: result,
                    })
                }).catch(err => {
                    res.json({
                        status:"FAILED",
                        message: err
                    })
                }) 
                
            }
        }).catch(err => {
            console.log(err)
            res.json({
                status:"FAILED",
                message: err
            })
        })   
        
    }
}

// Show shippingUnit
exports.ShowShippingUnit = async (req, res) => { 
    try {
        const shippingUnit = await ShippingUnit.find();
        res.json({
            status: 'SUCCESS',
            message: 'List of shippingUnit',
            data: shippingUnit
        });
    } catch (error) {
        res.status(500).json({
            status: 'FAILED',
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
}

