require("dotenv").config()
const mongoose = require('mongoose');

//mongodb user model
const User = require('../models/User')
const Admin = require('../models/Admin')
//Password handler
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

//signup
exports.signup = (req, res) => {
    let {name, email, password} = req.body
    name = name.trim()
    email = email.trim()
    password = password.trim()

    if(name === '' || email === '' || password === '' ){
        res.json({
            status:"FAILED",
            message:"Empty input fields!"
        })
    }else if(!/^[a-zA-Z ]*$/.test(name)){
        res.json({
            status:"FAILED",
            message:"Invalid name entered!"
        })
    }else if(!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
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
                    message:" email already exists"
                })
            }else{
                User.find({ email: email, verified: true }).then(result => {
                    if(result.length){
                        res.json({
                            status:"FAILED",
                            message:"user with the provided email already exists"
                        })
                    }else{
                        //password handling
                        const saltRounds = 10;
                        bcrypt.hash(password, saltRounds).then(hashedPassword => {
                            const newUser = new User({
                                name,
                                email,
                                password: hashedPassword,
                                verified: false,
                            })
        
                            newUser.save().then((result) => {
                                // res.json({
                                //     status:"SUCCESS",
                                //     message:"Signup successfully!",
                                //     data: result,
                                // })
                                sendOTPVerificationEmail(result, res)
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
        }})
        
    }
}

//signin
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
        User.find({email})
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

//mongodb user otp verification model
const UserOTPVerification = require('./../models/UserOTPVerification')

//send otp verification amail
const sendOTPVerificationEmail = async ({ _id, email}, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`

        //mail options
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'OTP Verification',
            html: `<p>Your OTP is: <b>${otp}</b></p>`
        }

        //hash the otp
        const saltRounds = 10
        const hashedOTP = await bcrypt.hash(otp, saltRounds)
        const NewOTPVerification = await new UserOTPVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 1000 * 60 * 5,
        })
        //save otp record
        await NewOTPVerification.save()
        await transporter.sendMail(mailOptions)
        res.json({
            status:"PENDING",
            message:"Verification otp email sent!",
            data:{
                userId: _id,
                email,
            }
        })


    } catch (error) {
        res.status(500).json({ // Trả về mã lỗi 500 Internal Server Error
            status:"FAILED",
            message: "An error occurred while sending OTP verification email"
        });
    }
}

//Verify otp email
exports.verifyOTP =  async (req, res) => {
    try{
        let{userId, otp} = req.body;
        if(!userId || !otp) { 
            throw Error("Empty otp details are not allowed")
        } else {
            const UserOTPVerificationRecords = await UserOTPVerification.find({
                userId,
            })
            if(UserOTPVerificationRecords.length <= 0) {
                throw new Error(
                    "Account record doesn't exist or has been verified already. Please sign up or log in."
                )
            } else {
                //user otp record exists
                const {expiresAt} = UserOTPVerificationRecords[0]
                const hashedOTP = UserOTPVerificationRecords[0].otp
                
                if(expiresAt < Date.now()) {
                    //user otp record has expired
                    await UserOTPVerification.deleteMany({userId})
                    throw new Error(
                        "Your OTP has expired. Please sign up or log in."
                    )
                } else {
                    const validOTP = await bcrypt.compare(otp, hashedOTP);

                    if(!validOTP) { 
                        res.json({
                            status: "FAILED",
                            message: "Invalid OTP passed. Check your inbox!"
                        });
                    } else {
                       await User.updateOne({_id: userId}, {verified: true})
                       await UserOTPVerification.deleteMany({ userId})
                       const user = await User.findById(userId);
                        if (!user) {
                            throw new Error("User not found after verification.");
                        }
                    
                        res.json({
                            status: "VERIFIED",
                            message: "User email verified successfully!",
                            user: user
                        });
                    }
                }
            }
        }
    } catch (err) {
        res.json({
            status:"FAILED",
            message: err.message
        })
    }  
}

//resend verification
exports.resendVerificationCode = async (req, res) => { 
    try {
        let {userId, email} = req.body
        if(!userId || !email) {
            throw Error("Empty otp details are not allowed")
        } else {
            await UserOTPVerification.deleteMany({userId})
            sendOTPVerificationEmail({_id: userId, email}, res) 
        }
    } catch (error) {
        res.json({
            status:"FAILED",
            message: error.message
        })
    }
}

//Email Authentication of Forgot password function
exports.emailAuthentication = async (req, res) => { 
    try {
        let {email} = req.body
        if(!email) {
            throw Error("Empty email are not allowed")
        } else {
            User.findOne({ email: email, verified: true }).then(result => {
                if(!result){
                    res.json({
                        status:"FAILED",
                        message:"The user with the provided email does not exist. "
                    })
                }else{    
                    sendOTPVerificationEmail(result, res)
                }
            }).catch(err => {
                console.log(err)
                res.json({
                    status:"FAILED",
                    message: "An error occurred while checking for existing user!"
                })
            }) 
        }
    } catch (error) {
        res.json({
            status:"FAILED",
            message: error.message
        })
    }
}

//Verify otp of Forgot password function
exports.verifyOTPofForgotPassword =  async (req, res) => {
    try{
        let{userId, otp} = req.body;
        if(!userId || !otp) { 
            throw Error("Empty otp details are not allowed")
        } else {
            const UserOTPVerificationRecords = await UserOTPVerification.find({
                userId,
            })
            if(UserOTPVerificationRecords.length <= 0) {
                throw new Error(
                    "Account record doesn't exist or has been verified already. Please sign up or log in."
                )
            } else {
                //user otp record exists
                const {expiresAt} = UserOTPVerificationRecords[0]
                const hashedOTP = UserOTPVerificationRecords[0].otp
                
                if(expiresAt < Date.now()) {
                    //user otp record has expired
                    await UserOTPVerification.deleteMany({userId})
                    throw new Error(
                        "Your OTP has expired. Please sign up or log in."
                    )
                } else {
                    const validOTP = await bcrypt.compare(otp, hashedOTP);

                    if(!validOTP) { 
                        res.json({
                            status: "FAILED",
                            message: "Invalid OTP passed. Check your inbox!"
                        });
                    } else {
                        await UserOTPVerification.deleteMany({userId})
                        res.json({
                            status: "SUCCESS",
                            message: "Verified successfully!",
                        });
                    }
                }
            }
        }
    } catch (err) {
        res.json({
            status:"FAILED",
            message: err.message
        })
    }  
}

//update new password of Forgot password function
exports.setupPassword =  async (req, res) => {
    try{
        let{userId, password} = req.body;
        if(!userId || !password) { 
            throw Error("Empty are not allowed")
        } else if(password.length < 8) {
            res.json({
                status:"FAILED",
                message:"Password must be at least 8 characters long!"
            })
        }else {
            User.findById(userId).then(result => {
                if(!result){
                    res.json({
                        status:"FAILED",
                        message:"User does not exist. "
                    })
                }else{    
                    //password handling
                    const saltRounds = 10;
                    bcrypt.hash(password, saltRounds).then(hashedPassword => {
                        result.password = hashedPassword    
                        result.save().then(() => {
                            res.json({
                                status:"SUCCESS",
                                message:"Password updated successfully!"
                            })
                        }).catch(err => {
                            res.json({
                                status:"FAILED",
                                message: "An error occurred while updating the password!"
                            })
                        })
                    }).catch(err => {
                        res.json({
                            status:"FAILED",
                            message: "An error occurred while encrypting the password!"
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
    } catch (err) {
        res.json({
            status:"FAILED",
            message: err.message
        })
    }  
}

//forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw Error("Email is required.");
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw Error("User with this email does not exist.");
        }

        // Generate a new random password
        const newPassword = Math.random().toString(36).slice(-8);

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password
        user.password = hashedNewPassword;
        await user.save();

        // Send the new password to user's email
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'New Password',
            html: `<p>Your new password is: <b>${newPassword}</b></p>`
        };

        await transporter.sendMail(mailOptions);

        res.json({
            status: "SUCCESS",
            message: "New password has been sent to your email."
        });
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message
        });
    }
};

//Sales registration
exports.saleRegister = async (req, res) => {
    try {
        const { shopDescript,shopAddress, shopName, userid } = req.body;
        if(!shopDescript || !shopAddress || !shopName || !userid) {
            res.json({
                status:"FAILED",
                message:"Empty credentials supplied"
            })
        }else {
            User.findOne({ "_id": userid }).then((user) => {
                console.log(user)
                if(user){
                    user.shopDescript = shopDescript;
                    user.shopAddress = shopAddress;
                    user.shopName = shopName;
                    user.sellerRequestStatus = 'pending';

                    user.save();
                    res.json({
                        status: "SUCCESS",
                        message: "Sale registration request submitted successfully"
                    });
                }else{
                    res.json({
                        status:"FAILED",
                        message:"User does not exist "
                    })
                }
            }).catch(err => {
                res.json({
                    status:"FAILED",
                    message: `${err}`
                })
            }) }
            
        
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message
        });
    }
 }

// Displays the request to register as a seller
exports.showSaleRegister = async (req, res) => { 
    try {
        const result = await User.find({ sellerRequestStatus: "pending"})
        res.json({
            status: 'SUCCESS',
            message: 'Registration list become a seller',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: 'FAILED',
            message: 'Failed to fetch registered user',
            error: error.message
        });
        
    }
}

exports.getUser = (req, res) => { 
    const { id } = req.params; 
    if(!id){
        res.json({
            status: "FAILED",
            message: "id null"
        })
    } else {
        User.findById(id)
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