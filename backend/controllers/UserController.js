require("dotenv").config()
const mongoose = require('mongoose');
const moment = require('moment');
//mongodb user model
const User = require('../models/User')
const Admin = require('../models/Admin')
const Order = require('../models/Order')
const Product = require('../models/Product')

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
                    user.sellerRequestStatus = 'PENDING';

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
        const result = await User.find({ sellerRequestStatus: "PENDING"})
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

exports.showAllSellerRequestStatus = async (req, res) => {
    try {
        const result = await User.find({
            sellerRequestStatus: { $in: ["PENDING", "SUCCESS", "REJECTED"] }
          });
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

// const formatDateString = (dateInput) => {
//     // Danh sách các định dạng có thể có
//     const formats = ['YYYY-DD-MM', 'MM-DD-YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD', 'YYYY/MM/DD', 'DD/MM/YYYY', 'MM/DD/YYYY'];

//     // Phân tích ngày tháng từ chuỗi đầu vào với các định dạng cho trước
//     const date = moment(dateInput, formats, true);

//     // Kiểm tra ngày tháng có hợp lệ hay không 
//     if (!date.isValid()) {
//         throw new Error('Invalid date format');
//     }

//     // Định dạng lại ngày tháng theo chuẩn YYYY-MM-DD
//     return date.format('YYYY-MM-DD');
// } 

exports.updateUser = (req, res) => { 
    
    const { id, name, dateOfBirth } = req.body; 
    let date = moment(dateOfBirth, "DD-MM-YYYY").toDate();
    if (!id ) {
        return res.status(400).json({
            status: "FAILED",
            message: "Empty input fields!",
        }); 
     
    } else { 
        User.findById(id)
        .then(user => {
            if(!user) {  
                return res.status(404).json({
                    status: "FAILED",
                    message: "User does not exist!",
                });
            }
            else {
                try {
                    user.name = name;
                    user.dateOfBirth = date;
                    user.save()

                    res.json({
                        status: "SUCCESS",
                        message: "User update successfully",
                        data: user
                    })
                
                } catch (error) {
                    res.json({
                        status: "FAILED",
                        message: error
                    })
                }
            }
         })
        .catch(err => {
             res.json({
                 status: "FAILED",
                 message: err.message
             })
         })
    }
}

exports.updatePassword =  async (req, res) => {
    try{ 
        let{userId, password, newPassword} = req.body;
        if(!userId || !password || !newPassword) { 
            throw Error("Empty are not allowed")
        } else if(password.length < 8) {
            res.json({
                status:"FAILED",
                message:"Password must be at least 8 characters long!"
            })
        }else {
            User.findById(userId).then(user => {
                if(user) {
                    const hashedPassword = user.password
                    bcrypt.compare(password, hashedPassword).then(result => {
                        if(result) {
                            const saltRounds = 10;
                            bcrypt.hash(newPassword, saltRounds).then(hashedPassword => {
                                user.password = hashedPassword    
                                user.save().then(() => {
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

exports.sendOTPVerificationEmailSeller = async (req, res) => {
    try {
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      let {email} = req.body;
      //mail options
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "OTP Verification",
        html: `<p>Your OTP verify seller registration request is: <b>${otp}</b></p>`,
      };
  
      //hash the otp
      const saltRounds = 10;
      const hashedOTP = await bcrypt.hash(otp, saltRounds);
      await transporter.sendMail(mailOptions)
      res.json({
        status: "SUCCESS",
        message: "Verification otp email sent!",
        data: {
          hashedOTP: hashedOTP,
          // otp:otp
        },
      });
    } catch (error) {
      res.status(500).json({
        // Trả về mã lỗi 500 Internal Server Error
        status: "FAILED",
        message: "An error occurred while sending OTP verification email",
      });
    }
  };

  //verify otp seller registration response
exports.verifyOTPSeller = async (req, res) => {
    try {
      let { otp, hashedOTP } = req.body;
      if (!otp) {
        throw Error("Empty otp details are not allowed");
      } else {
      //   const hashedOTP = otp;
        const validOTP = await bcrypt.compare(otp, hashedOTP);
  
        if (!validOTP) {
          res.json({
            status: "FAILED",
            message: "Invalid OTP passed. Check your inbox!",
          });
        } else {
          res.json({
            status: "VERIFIED",
            message: "User email verified successfully!",
          });
        }
      }
    } catch (err) {
      res.json({
        status: "FAILED",
        message: err.message,
      });
    }
  };
  

exports.newAddress = async (req, res) => {
    try {
      let { userId, name, street, Ward, District, city, mobileNo } = req.body;
      if (userId === '' || name === '' || street === '' || Ward === '' || District === '' || city === ''|| mobileNo === '' ) {
        res.json({
            status: "FAILED",
            message: "Empty input fields!",
        });
        return;
    } else if (/\D/.test(mobileNo)) {
        res.json({
            status: "FAILED",
            message: "MobileNo must contain only numbers."
        });
        return;
    } else if(mobileNo.length !== 10) {
        res.json({
            status:"FAILED",
            message:"MobileNo must have 10 numbers."
        })
        return;
    } else {
        try {
            User.findOne({ _id: userId })
                .then(async (user) => {
                    if (!user) {
                    res.json({
                        status: "FAILED",
                        message: "The user with the provided id does not exist. ",
                    });
                    return;
                    } else {
                        user.addresses.push({
                            name: name,
                            street: street,
                            Ward: Ward,
                            District: District,
                            city: city,
                            mobileNo: mobileNo,
                        });
                            
                        await user.save();
                        res.json({
                        status: "SUCCESS",
                        message: "Create new address successfully",
                        });
                    }
                }).catch ((err) => {
                    res.json({
                        status: "FAILED",
                        message: err.message,
                      });
                })
        } catch (err) {
            res.json({
              status: "FAILED",
              message: err.message,
            });
        }
      }
    } catch (err) {
      res.json({
        status: "FAILED",
        message: err.message,
      });
    }
  };

exports.getAddress = (req, res) => { 
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
                 data: data.addresses
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


exports.updateAddress = async (req, res) => {
    try {
      let { userId, addressId, name, street, Ward, District, city, mobileNo } = req.body;
      if (userId === '' || addressId === '' || name === '' || street === '' || Ward === '' || District === '' || city === ''|| mobileNo === '' ) {
        res.json({
            status: "FAILED",
            message: "Empty input fields!",
        });
        return;
    } else if (/\D/.test(mobileNo)) {
        res.json({
            status: "FAILED",
            message: "MobileNo must contain only numbers."
        });
        return;
    } else if(mobileNo.length !== 10) {
        res.json({
            status:"FAILED",
            message:"MobileNo must have 10 numbers."
        })
        return;
    } else {
        try {
            User.findOne({ _id: userId })
                .then(async (user) => {
                    if (!user) {
                    res.json({
                        status: "FAILED",
                        message: "The user with the provided id does not exist. ",
                    });
                    return;
                    } else {
                        const address = user.addresses.id(addressId)
                    
                        if (!address) { 
                            res.json({
                                status: "FAILED",
                                message: "The address with the provided id does not exist. ",
                            });
                            return;
                        } else { 
                            address.name = name;
                            address.street = street;
                            address.Ward = Ward;
                            address.District = District;
                            address.city = city;
                            address.mobileNo = mobileNo;
                            await user.save();
                            res.json({
                            status: "SUCCESS",
                            message: "Update address successfully",
                            });
                        }
                    }
                }).catch ((err) => {
                    res.json({
                        status: "FAILED",
                        message: err.message,
                      });
                })
        } catch (err) {
            res.json({
              status: "FAILED",
              message: err.message,
            });
        }
      }
    } catch (err) {
      res.json({
        status: "FAILED",
        message: err.message,
      });
    }
  };

exports.deleteAddress = async (req, res) => {
try {
    const { userId, addressId } = req.body;
    
    if (!userId || !addressId) {
        return res.status(400).json({
            status: "FAILED",
            message: "Empty input fields!",
        });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
        return res.status(404).json({
            status: "FAILED",
            message: "The user with the provided id does not exist.",
        });
    }

    user.addresses.pull({ _id: addressId })// Assuming addresses is an array of ObjectId's

    await user.save();
    
    return res.json({
        status: "SUCCESS",
        message: "Address deleted successfully",
    });
} catch (err) {
    return res.status(500).json({
        status: "FAILED",
        message: err.message,
    });
}
};

// exports.order = async (req, res) => {
//     try {
//         const { idUser, idShop, address, totalByShop, idShippingUnit, nameShippingUnit,shippingCost, options } = req.body;
        
//         if (!idUser || !idShop || !address || !totalByShop || !idShippingUnit || !nameShippingUnit || !shippingCost ||  !options) {
//             return res.status(400).json({
//                 status: "FAILED",
//                 message: "Empty input fields!",
//             });
//         }

//         for (const option of options) {
//             if (!option.idOption || !option.idProduct || !option.price || !option.quantity) {
//                 return res.status(400).json({
//                     status: "FAILED",
//                     message: "One of the Options is missing required fields!",
//                 });
//             }
//         }
    
//         const newOrder = new Order({
//             idUser,
//             idShop,  
//             address,
//             totalByShop,
//             idShippingUnit,
//             nameShippingUnit,
//             shippingCost,
//             status:"Ordered", 
//             options,
//         })

//         newOrder.save().then((result) => {
//             return res.json({
//                 status: "SUCCESS",
//                 message: "Order successfully",
//                 data: result
//             });
//         })
//     } catch (err) {
//         return res.status(500).json({
//             status: "FAILED",
//             message: err.message,
//         });
//     }
//     };
exports.order = async (req, res) => {
    const {
        idShop,
        idUser, 
        option,   
        address, 
        nameShippingUnit, 
        shippingCost,
        idShippingUnit,
        status,
    } = req.body;
    if (!idUser || !idShop || !address  || !idShippingUnit || !nameShippingUnit || !shippingCost ||  !option || !status) {
        return res.status(400).json({
            status: "FAILED",
            message: "Empty input fields!",
        });
    }

    for (const item of option) {
        if (!item.idOption || !item.idProduct || !item.price || !item.quantity) {
            return res.status(400).json({
                status: "FAILED",
                message: "One of the Options is missing required fields!",
            });
        } 
    }

    try {
        let totalByShop = shippingCost;
        // Trừ số lượng sản phẩm trong kho
        for (const opt of option) {
        const product = await Product.findById(opt.idProduct);
        let stock = 0;
        product.option.forEach((opt1) => {
            stock += opt1.quantity;
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const optionPrd = product.option.find(
            (opt1) => opt1._id.toString() == opt.idOption
        );
        if (optionPrd.quantity >= opt.quantity) {
            totalByShop += opt.price * opt.quantity;
            optionPrd.quantity = optionPrd.quantity - opt.quantity;
            //Cập nhật tồn kho
            opt.stock = stock - opt.quantity; 
            // Cập nhật số lượng sản phẩm đã bán
            product.sold += opt.quantity;
            await product.save();
        }
        }
        // Tạo đơn hàng mới
        const order = new Order({
        idShop,
        idUser,
        option,
        address,
        nameShippingUnit,
        shippingCost, 
        status,
        totalByShop,
        idShippingUnit,
        });
        await order.save();
    
        res.status(200).json({ message: "Order created successfully" });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getOrderData = async (req, res) => {
    try {
        const { id} = req.params;
        
        if (!id) {
            return res.status(400).json({
                status: "FAILED",
                message: "Empty input fields!",
            });
        } else {
            const orderData = await Order.find({ idUser: id})
            if (orderData) { 
                const orderDataWithDetails = await Promise.all(orderData.map(async (item) => {
                    const details = await Promise.all(item.option.map(async (option) => { 
                        const productId = option.idProduct;
                        const optionId = option.idOption;
                        const price = option.price;
                        const quantity = option.quantity;
                        const stock = option.stock;

                        const product = await Product.findById(productId)
                        if (!product) {
                            res.json({
                                status: "FAILED",
                                message: "Product not found!"
                            });
                            return;
                        } else {
                            const OptionOfProduct =product.option.id(optionId);
                            if (!option) {
                                res.json({
                                    status: "FAILED",
                                    message: "Option not found for this product!"
                                });
                                return;
                            } else {
                                const nameProduct = product.name 
                                const nameOption = OptionOfProduct.name;
                                const imageUrl = OptionOfProduct.imageUrl

                                return {
                                    productId: productId,
                                    optionId: optionId,
                                    nameProduct: nameProduct,
                                    nameOption: nameOption,
                                    imageUrl: imageUrl,
                                    price: price,
                                    quantity: quantity,
                                    stock: stock,
                                };
                            }
                        }
                    }));
                    return {
                        ...item,
                        option: details
                    };
                }));
                const newOrdered = [];
                const newDeliveringOrder = [];
                const newDeliveredOrder = [];
                const newCompletedOrder = [];
                const newCancelOrder = [];

                orderDataWithDetails.forEach((order) => {
                    switch (order._doc.status) {
                    case "processing":
                    case "paid":
                        newOrdered.push(order);
                        break;
                    case "delivering":
                        newDeliveringOrder.push(order);
                        break;
                    case "delivered":
                        newDeliveredOrder.push(order);
                        break;
                    case "completed":
                        newCompletedOrder.push(order);
                        break;
                    case "canceled":
                        newCancelOrder.push(order);
                        break;
                    }
                });
                res.json({
                    status: "SUCCESS",
                    newOrdered: newOrdered,
                    newDeliveringOrder: newDeliveringOrder,
                    newDeliveredOrder: newDeliveredOrder,
                    newCompletedOrder: newCompletedOrder,
                    newCancelOrder: newCancelOrder,
                });
            }
        }
        
    } catch (err) {
        return res.status(500).json({
            status: "FAILED",
            message: err.message,
        });
    }
};

const getMonthYearFromAtCreate = (atCreate) => {
    const atCreateTimestamp = new Date(atCreate);
    const year = atCreateTimestamp.getFullYear();
    const month = atCreateTimestamp.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0, nên cần +1 để đúng với tháng thực tế
    return { month, year };
  };
const sortByCreatedAt = (order) => {
const sortbyCreateAtproduct = order.sort((a, b) => {
    const aTimestamp = new Date(a.createAt).getTime();
    const bTimestamp = new Date(b.createAt).getTime();
    // So sánh theo timestamp
    return aTimestamp - bTimestamp;
});
// In ra mảng đã sắp xếp
return sortbyCreateAtproduct;
};
exports.getOrderCompleted = async (req, res) => {
    try {
        const { id} = req.params;
        
        if (!id) {
            return res.status(400).json({
                status: "FAILED",
                message: "Empty input fields!",
            });
        } else {
            const order = await Order.find({ idUser: id, status:"completed"})
            if (order) { 
                let total = 0
                let timeOfOrderCreate = []
                const orderData = sortByCreatedAt(order)
                const orderDataWithDetails = await Promise.all(orderData.map(async (item) => {
                    const details = await Promise.all(item.option.map(async (option) => { 
                        const productId = option.idProduct;
                        const optionId = option.idOption;
                        const price = option.price;
                        const quantity = option.quantity;
                        const stock = option.stock;

                        const product = await Product.findById(productId)
                        if (!product) {
                            res.json({
                                status: "FAILED",
                                message: "Product not found!"
                            });
                            return;
                        } else {
                            const OptionOfProduct =product.option.id(optionId);
                            if (!option) {
                                res.json({
                                    status: "FAILED",
                                    message: "Option not found for this product!"
                                });
                                return;
                            } else {
                                const nameProduct = product.name 
                                const nameOption = OptionOfProduct.name;
                                const imageUrl = OptionOfProduct.imageUrl

                                return {
                                    productId: productId,
                                    optionId: optionId,
                                    nameProduct: nameProduct,
                                    nameOption: nameOption,
                                    imageUrl: imageUrl,
                                    price: price,
                                    quantity: quantity,
                                    stock: stock,
                                };
                            }
                        }
                    }));
                    total += item.totalByShop
                    const orderCreateTime = getMonthYearFromAtCreate(item.createAt);
                    if (!timeOfOrderCreate.some(time => time.month === orderCreateTime.month && time.year === orderCreateTime.year)) {
                        timeOfOrderCreate.push(orderCreateTime);
                    }
                     // Sắp xếp timeOfOrderCreate từ tháng năm mới đến cũ
                    timeOfOrderCreate.sort((a, b) => {
                        if (b.year !== a.year) {
                        return b.year - a.year;
                        }
                        return b.month - a.month;
                    });
                    return {
                        ...item,
                        option: details
                    };
                }));

                res.json({
                    status: "SUCCESS",
                    order: orderDataWithDetails,
                    totalAmount: total,
                    timeofOrder: timeOfOrderCreate,
                });
            }
        }
        
    } catch (err) {
        return res.status(500).json({
            status: "FAILED",
            message: err.message,
        });
    }
};

exports.getOrderCompletedByMonth = async (req, res) => {
    try {
        const { id, month, year } = req.body;

        if (!id || !month || !year) {
            return res.status(400).json({
                status: "FAILED",
                message: "Empty input fields!",
            });
        } else {
            const startOfMonth = moment().year(year).month(month - 1).startOf('month').toDate();
            const endOfMonth = moment().year(year).month(month - 1).endOf('month').toDate();

            const orderData = await Order.find({
                idUser: id,
                status: "completed",
                createAt: { $gte: startOfMonth, $lte: endOfMonth }
            });

            if (orderData) { 
                let total = 0;
                const orderDataWithDetails = await Promise.all(orderData.map(async (item) => {
                    const details = await Promise.all(item.option.map(async (option) => { 
                        const productId = option.idProduct;
                        const optionId = option.idOption;
                        const price = option.price;
                        const quantity = option.quantity;
                        const stock = option.stock;

                        const product = await Product.findById(productId);
                        if (!product) {
                            res.json({
                                status: "FAILED",
                                message: "Product not found!"
                            });
                            return;
                        } else {
                            const OptionOfProduct = product.option.id(optionId);
                            if (!OptionOfProduct) {
                                res.json({
                                    status: "FAILED",
                                    message: "Option not found for this product!"
                                });
                                return;
                            } else {
                                const nameProduct = product.name;
                                const nameOption = OptionOfProduct.name;
                                const imageUrl = OptionOfProduct.imageUrl;

                                return {
                                    productId: productId,
                                    optionId: optionId,
                                    nameProduct: nameProduct,
                                    nameOption: nameOption,
                                    imageUrl: imageUrl,
                                    price: price,
                                    quantity: quantity,
                                    stock: stock,
                                };
                            }
                        }
                    }));
                    total += item.totalByShop;
                    return {
                        ...item._doc,
                        option: details
                    };
                }));

                res.json({
                    status: "SUCCESS",
                    order: orderDataWithDetails,
                    totalAmount: total,
                });
            }
        }
        
    } catch (err) {
        return res.status(500).json({
            status: "FAILED",
            message: err.message,
        });
    }
};

exports.getOrderCompletedByYear = async (req, res) => {
    try {
        const { id, year } = req.body;

        if (!id || !year) {
            return res.status(400).json({
                status: "FAILED",
                message: "Empty input fields!",
            });
        } else {
            const startOfYear = moment().year(year).startOf('year').toDate();
            const endOfYear = moment().year(year).endOf('year').toDate();
            
            const orderData = await Order.find({
                idUser: id,
                status: "completed",
                createAt: { $gte: startOfYear, $lte: endOfYear }
            });

            if (orderData) { 
                let total = 0;
                let januaryData = [];
                let februaryData = [];
                let marchData = [];
                let aprilData = []
                let mayData = []
                let juneData = []
                let julyData = []
                let augustData = []
                let septemberData = []
                let octoberData = []
                let novemberData = []
                let decemberData = []

                const orderDataWithDetails = await Promise.all(orderData.map(async (item) => {
                    const details = await Promise.all(item.option.map(async (option) => { 
                        const productId = option.idProduct;
                        const optionId = option.idOption;
                        const price = option.price;
                        const quantity = option.quantity;
                        const stock = option.stock;

                        const product = await Product.findById(productId);
                        if (!product) {
                            res.json({
                                status: "FAILED",
                                message: "Product not found!"
                            });
                            return;
                        } else {
                            const OptionOfProduct = product.option.id(optionId);
                            if (!OptionOfProduct) {
                                res.json({
                                    status: "FAILED",
                                    message: "Option not found for this product!"
                                });
                                return;
                            } else {
                                const nameProduct = product.name;
                                const nameOption = OptionOfProduct.name;
                                const imageUrl = OptionOfProduct.imageUrl;

                                return {
                                    productId: productId,
                                    optionId: optionId,
                                    nameProduct: nameProduct,
                                    nameOption: nameOption,
                                    imageUrl: imageUrl,
                                    price: price,
                                    quantity: quantity,
                                    stock: stock,
                                };
                            }
                        }
                    }));
                    total += item.totalByShop;
                    return {
                        ...item._doc,
                        option: details
                    };

                }));
                orderDataWithDetails.forEach(data => { 
                    const month = moment(data.createAt).month(); 
                    switch (month + 1) {
                        case 1:
                            januaryData.push(data);
                            break;
                        case 2:
                            februaryData.push(data);
                            break;
                        case 3:
                            marchData.push(data);
                            break;
                        case 4:
                            aprilData.push(data);
                            break;
                        case 5:
                            mayData.push(data);
                            break;
                        case 6:
                            juneData.push(data);
                            break;
                        case 7:
                            julyData.push(data);
                            break;
                        case 8:
                            augustData.push(data);
                            break;
                        case 9:
                            septemberData.push(data);
                            break;
                        case 10:
                            octoberData.push(data);
                            break;
                        case 11:
                            novemberData.push(data);
                            break;
                        case 12:
                            decemberData.push(data);
                            break;
                    }
                })

                res.json({
                    status: "SUCCESS",
                    data: {
                        januaryData, februaryData, marchData, aprilData, mayData, juneData, julyData, augustData, septemberData, octoberData,novemberData,decemberData
                    },
                    totalAmount: total,
                });
            }
        }
        
    } catch (err) {
        return res.status(500).json({
            status: "FAILED",
            message: err.message,
        });
    }
};

exports.cancelOrder = async (req, res) => {
    const {orderId} = req.body;
    if (!orderId) {
        return res.status(400).json({
            status: "FAILED",
            message: "Empty input fields!",
        });
    } else { 
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                status: "FAILED",
                message: "Order not found!",
            });
        } else {
            order.status = "canceled";
            await order.save();
            res.json({
                status: "SUCCESS",
                message: "Order cancelled successfully!"
            });
        }
    }

};

// exports.createPaymentQR = async (req, res) => {
//     const { priceGlobal } = req.body;
//     var partnerCode = "MOMO";
//     var accessKey = "F8BBA842ECF85";
//     var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
//     // chuỗi ngẫu nhiên để phân biệt cái request
//     var requestId = partnerCode + new Date().getTime() + "id";
//     // mã đặt đơn
//     var orderId = new Date().getTime() + ":0123456778";
//     //
//     var orderInfo = "Thanh toán qua ví MoMo";
//     // cung cấp họ về một cái pages sau khi thanh toán sẽ trở về trang nớ
//     var redirectUrl = "https://clever-tartufo-c324cd.netlify.app/pages/home.html";
//     // Trang thank you
//     var ipnUrl = "https://clever-tartufo-c324cd.netlify.app/pages/home.html";
//     // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
//     // số tiền
//     var amount = priceGlobal;
//     //var requestType = "payWithATM";
//     // show cái thông tin thẻ, cái dưới quét mã, cái trên điền form
//     var requestType = "captureWallet";
//     var extraData = ""; //pass empty value if your merchant does not have stores
  
//     //before sign HMAC SHA256 with format
//     //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
//     var rawSignature =
//       "accessKey=" +
//       accessKey +
//       "&amount=" +
//       amount +
//       "&extraData=" +
//       extraData +
//       "&ipnUrl=" +
//       ipnUrl +
//       "&orderId=" +
//       orderId +
//       "&orderInfo=" +
//       orderInfo +
//       "&partnerCode=" +
//       partnerCode +
//       "&redirectUrl=" +
//       redirectUrl +
//       "&requestId=" +
//       requestId +
//       "&requestType=" +
//       requestType;
//     // thư viện node js , model tích họp ,liên quan đến mã hóa, giải mã và bảo mật, cung cấp chức năng và phương thức sử lý dữ liệu liên quan đến mật mã
//     const crypto = require("crypto");
//     var signature = crypto
//       // thuật toán tạo ra mới với tham số là secretkey
//       .createHmac("sha256", secretkey)
//       // thêm biến rawSignature vào băm
//       .update(rawSignature)
//       // tạo chữ kí và chuyển sang mã hex
//       .digest("hex");
  
//     //json object send to MoMo endpoint, gửi cái aip của momo
//     const requestBody = JSON.stringify({
//       partnerCode: partnerCode,
//       accessKey: accessKey,
//       requestId: requestId,
//       amount: amount,
//       orderId: orderId,
//       orderInfo: orderInfo,
//       redirectUrl: redirectUrl,
//       ipnUrl: ipnUrl,
//       extraData: extraData,
//       requestType: requestType,
//       signature: signature,
//       lang: "en",
//     });
  
//     //Create the HTTPS objects, tạo sever, https để call cái aip khác, call tới momo
//     const https = require("https");
//     // yêu cầu truyền đi
//     const options = {
//       hostname: "test-payment.momo.vn",
//       port: 443,
//       path: "/v2/gateway/api/create",
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Content-Length": Buffer.byteLength(requestBody),
//       },
//     };
//     //Send the request and get the response
//     const reqq = https.request(options, (resMom) => {
//       console.log(`Status: ${resMom.statusCode}`);
//       console.log(`Headers: ${JSON.stringify(resMom.headers)}`);
//       resMom.setEncoding("utf8");
//       // trả về body là khi mình call momo
//       resMom.on("data", (body) => {
//         // url dẫn đến tranh toán của momo
//         console.log(JSON.parse(body).payUrl);
//         res.json({ payUrl: JSON.parse(body).payUrl });
//       });
//       resMom.on("end", () => {
//         console.log("No more data in response.");
//       });
//     });
  
//     reqq.on("error", (e) => {
//       console.log(`problem with request: ${e.message}`);
//     });
//     // write data to request body
//     console.log("Sending....");
//     reqq.write(requestBody);
//     reqq.end();
//   };
 
exports.createPayment = async (req, res) => {
    const { priceGlobal } = req.body; 
    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const requestId = partnerCode + new Date().getTime() + "id";
    const orderId = new Date().getTime() + ":0123456778";
    const orderInfo = "Thanh toán qua ATM MoMo";
    //nếu thanh toán thành công thì trả về
    const redirectUrl = "https://momo.vn/";
    const ipnUrl = "https://momo.vn/";
    const amount = priceGlobal;
    const requestType = "payWithATM";  // Changed from "captureWallet" to "payWithATM"
    const extraData = "";  // Pass empty value if your merchant does not have stores
  
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const crypto = require("crypto");
    const signature = crypto.createHmac("sha256", secretKey)
                            .update(rawSignature)
                            .digest("hex");
  
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: "en",
    });
  
    const https = require("https");
    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };

    const reqq = https.request(options, (resMom) => {
      console.log(`Status: ${resMom.statusCode}`);
      resMom.setEncoding("utf8");
      resMom.on('data', (body) => {
        try {
            let data = JSON.parse(body);
            console.log("Data received:", data);
            if (data && data.payUrl) {
                res.json({ payUrl: data.payUrl });
            } else {
                console.error("No payUrl received:", data);
                res.status(500).json({ error: 'No payUrl received, check logs for details.' });
            }
        } catch (error) {
            console.error("Error parsing response:", error);
            res.status(500).json({ error: 'Error parsing response from MoMo.' });
        }
    });
      resMom.on("end", () => {
        console.log("No more data in response.");
      });
    });
  
    reqq.on("error", (e) => {
      console.log(`problem with request: ${e.message}`);
    });

    console.log("Sending....");
    reqq.write(requestBody);
    reqq.end();
  };

  exports.createPaymentweb = async (req, res) => {
    const { priceGlobal } = req.body; 
    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const requestId = partnerCode + new Date().getTime() + "id";
    const orderId = new Date().getTime() + ":0123456778";
    const orderInfo = "Thanh toán qua ATM MoMo";
    //nếu thanh toán thành công thì trả về
    const redirectUrl = "http://localhost:4200/";
    const ipnUrl = "https://momo.vn/";
    const amount = priceGlobal;
    const requestType = "payWithATM";  // Changed from "captureWallet" to "payWithATM"
    const extraData = "";  // Pass empty value if your merchant does not have stores
  
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const crypto = require("crypto");
    const signature = crypto.createHmac("sha256", secretKey)
                            .update(rawSignature)
                            .digest("hex");
  
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: "en",
    });
  
    const https = require("https");
    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };

    const reqq = https.request(options, (resMom) => {
      console.log(`Status: ${resMom.statusCode}`);
      resMom.setEncoding("utf8");
      resMom.on('data', (body) => {
        try {
            let data = JSON.parse(body);
            console.log("Data received:", data);
            if (data && data.payUrl) {
                res.json({ payUrl: data.payUrl });
            } else {
                console.error("No payUrl received:", data);
                res.status(500).json({ error: 'No payUrl received, check logs for details.' });
            }
        } catch (error) {
            console.error("Error parsing response:", error);
            res.status(500).json({ error: 'Error parsing response from MoMo.' });
        }
    });
      resMom.on("end", () => {
        console.log("No more data in response.");
      });
    });
  
    reqq.on("error", (e) => {
      console.log(`problem with request: ${e.message}`);
    });

    console.log("Sending....");
    reqq.write(requestBody);
    reqq.end();
  };
  
  exports.confirmOrder = async (req, res) => {
    const {orderId} = req.body;
    if (!orderId) {
        return res.status(400).json({
            status: "FAILED",
            message: "Empty input fields!",
        });
    } else { 
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                status: "FAILED",
                message: "Order not found!",
            });
        } else {
            order.status = "completed";
            await order.save();
            res.json({
                status: "SUCCESS",
                message: "Order cancelled successfully!"
            });
        }
    }

};

//Tên: NGUYEN VAN A
//Số thẻ: 9704 0000 0000 0018
//Ngày phát hàng: 03/07 
//OTP: OTP



// exports.createPayment = async (req, res) => {
//     const { priceGlobal } = req.body;
// var accessKey = 'F8BBA842ECF85';
// var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
// var orderInfo = 'pay with MoMo';
// var partnerCode = 'MOMO';
// var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
// var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
// var requestType = "payWithATM";
// var amount = priceGlobal;
// var orderId = partnerCode + new Date().getTime();
// var requestId = orderId;
// var extraData ='';
// var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
// var orderGroupId ='';
// var autoCapture =true;
// var lang = 'vi';

// //before sign HMAC SHA256 with format
// //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
// var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
// //puts raw signature
// console.log("--------------------RAW SIGNATURE----------------")
// console.log(rawSignature)
// //signature
// const crypto = require('crypto');
// var signature = crypto.createHmac('sha256', secretKey)
//     .update(rawSignature)
//     .digest('hex');
// console.log("--------------------SIGNATURE----------------")
// console.log(signature)

// //json object send to MoMo endpoint
// const requestBody = JSON.stringify({
//     partnerCode : partnerCode,
//     partnerName : "Test",
//     storeId : "MomoTestStore",
//     requestId : requestId,
//     amount : amount,
//     orderId : orderId,
//     orderInfo : orderInfo,
//     redirectUrl : redirectUrl,
//     ipnUrl : ipnUrl,
//     lang : lang,
//     requestType: requestType,
//     autoCapture: autoCapture,
//     extraData : extraData,
//     orderGroupId: orderGroupId,
//     signature : signature
// });
// //Create the HTTPS objects
// const https = require('https');
// const options = {
//     hostname: 'test-payment.momo.vn',
//     port: 443,
//     path: '/v2/gateway/api/create',
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Content-Length': Buffer.byteLength(requestBody)
//     }
// }
// //Send the request and get the response
// const reqq = https.request(options, res => {
//     console.log(`Status: ${res.statusCode}`);
//     console.log(`Headers: ${JSON.stringify(res.headers)}`);
//     res.setEncoding('utf8');
//     res.on('data', (body) => {
//         console.log('Body: ');
//         console.log(body);
//         console.log('resultCode: ');
//         console.log(JSON.parse(body).resultCode);
//     });
//     res.on('end', () => {
//         console.log('No more data in response.');
//     });
// })

// reqq.on('error', (e) => {
//     console.log(`problem with request: ${e.message}`);
// });
// // write data to request body
// console.log("Sending....")
// reqq.write(requestBody);
// reqq.end();
//   };
