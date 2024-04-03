const express = require('express')
const router = express.Router()
require("dotenv").config()
//mongodb user model
const User = require('../models/User')
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
router.post('/signup', (req, res) => {
    let {name, email, password, dateOfBirth} = req.body
    name = name.trim()
    email = email.trim()
    password = password.trim()
    dateOfBirth = dateOfBirth.trim()

    if(name === '' || email === '' || password === '' || dateOfBirth === ''){
        res.json({
            status:"FAILED",
            message:"Empty input fields!"
        })
    }else if(!/^[a-zA-Z ]*$/.test(name)){
        res.json({
            status:"FAILED",
            message:"Invalid name entered!"
        })
    }else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status:"FAILED",
            message:"Invalid email entered!"
        })
    }else if(!new Date(dateOfBirth).getTime()){
        res.json({
            status:"FAILED",
            message:"Invalid date of birth entered"
        })
    }else if(password.length < 8) {
        res.json({
            status:"FAILED",
            message:"Password must be at least 8 characters long!"
        })
    } else {
        //checking if user already exists
        User.find({email}).then(result => {
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
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword,
                        dateOfBirth,
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
    }
})

//signin
router.post('/signin', (req, res) => {
    let {email, password, } = req.body
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
})

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
        res.json({
            status:"FAILED",
            message: error.message
        })
    }
}

//Verify otp email
router.post("/verifyOTP", async (req, res) => {
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
                        throw new Error(
                            "Invalid OTP passed. Check your inbox"
                        )

                    } else {
                       await User.updateOne({_id: userId}, {verified: true})
                       await UserOTPVerification.deleteMany({ userId})
                       res.json({
                        status:"VERIFIED",
                        message:"User email verified successfully!",
                        
                       })
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
})

//resend verification
router.post('/resendVerificationCode', async (req, res) => { 
    try {
        let {userId, email} = req.params
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
})

module.exports = router;