require("dotenv").config();
//mongodb user model
const Admin = require('../models/Admin')
const User = require('../models/User')
const ShippingUnit = require('../models/ShippingUnit')
const Order = require('../models/Order')


const bcrypt = require("bcrypt");
//email handler
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});
//login Admin
exports.signin = (req, res) => {
  let { email, password } = req.body;
  email = email.trim(),
  password = password.trim()

  if (email == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Empty credentials supplied",
    });
  } else {
    Admin.find({ email })
      .then((data) => {
        if (data) {
          const hashedPassword = data[0].password;
          bcrypt
            .compare(password, hashedPassword)
            .then((result) => {
              if (result) {
                res.json({
                  status: "SUCCESS",
                  message: "Signin successfully!",
                  data: data,
                });
              } else {
                res.json({
                  status: "FAILED",
                  message: "Incorrect password!",
                });
              }
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "An error occurred while comparing passwords!",
              });
            });
        } else {
          res.json({
            status: "FAILED",
            message: "Invalid credentials supplied!",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: "FAILED",
          message: "An error occurred while checking for existing user!",
        });
      });
  }
};

//add admin
exports.addAdmin = (req, res) => {
  let { name, email, password } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();

  if (name === "" || email === "" || password === "") {
    res.json({
      status: "FAILED",
      message: "Empty input fields!",
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: "FAILED",
      message: "Invalid email entered!",
    });
  } else if (password.length < 8) {
    res.json({
      status: "FAILED",
      message: "Password must be at least 8 characters long!",
    });
  } else {
    //checking if user already exists
    Admin.find({ email })
      .then((result) => {
        if (result.length) {
          res.json({
            status: "FAILED",
            message: "user with the provided email already exists",
          });
        } else {
          User.find({ email: email, verified: true })
            .then((result) => {
              if (result.length) {
                res.json({
                  status: "FAILED",
                  message: "user with the provided email already exists",
                });
              } else {
                //password handling
                const saltRounds = 10;
                bcrypt
                  .hash(password, saltRounds)
                  .then((hashedPassword) => {
                    const newUser = new Admin({
                      name,
                      email,
                      password: hashedPassword,
                    });

                    newUser
                      .save()
                      .then((result) => {
                        res.json({
                          status: "SUCCESS",
                          message: "Add admin successfully!",
                          data: result,
                        });
                      })
                      .catch((err) => {
                        res.json({
                          status: "FAILED",
                          message:
                            "An error occurred while saving user account!",
                        });
                      });
                  })
                  .catch((err) => {
                    res.json({
                      status: "FAILED",
                      message: "An error occurred while hashing the password!",
                    });
                  });
              }
            })
            .catch((err) => {
              console.log(err);
              res.json({
                status: "FAILED",
                message: err,
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: "FAILED",
          message: "An error occurred while checking for existing user!",
        });
      });
  }
};

// Show category
exports.ShowListAdmin = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json({
      status: "SUCCESS",
      message: "List of categories",
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      status: "FAILED",
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

//Approve your request to become a seller
exports.approveSaleRequest = async (req, res) => {
  let { userId } = req.body;
  if (userId == "") {
    res.json({
      status: "FAILED",
      message: "Empty credentials supplied",
    });
  } else {
    User.findOne({ _id: userId })
      .then(async (data) => {
        if (data) {
          data.sellerRequestStatus = "SUCCESS";
          data.role = "seller";
          await data.save();
          //mail options
          const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: data.email,
            subject: "You have become a seller",
            html: `<p>Your request to become a seller has been accepted</p>`,
          };

          await transporter.sendMail(mailOptions);
          res.json({
            status: "SUCCESS",
            message: "The request has been accepted",
          });
        } else {
          res.json({
            status: "FAILED",
            message: "Invalid credentials!",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "FAILED",
          message: err,
        });
      });
  }
};

//Reject your request to become a seller
exports.rejectSaleRequest = async (req, res) => {
  let { userId } = req.body;
  if (userId == "") {
    res.json({
      status: "FAILED",
      message: "Empty credentials supplied",
    });
  } else { 
    User.findOne({ _id: userId })
      .then(async (data) => {
        if (data) {
          data.sellerRequestStatus = "REJECTED";
          await data.save();
          //mail options
          const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: data.email,
            subject: "Reject your request to become a seller",
            html: `<p>Your request was rejected because it did not comply with the user agreement. Try again.</p>`,
          };

          await transporter.sendMail(mailOptions);
          res.json({
            status: "SUCCESS",
            message: "Request rejected successfully",
          });
        } else {
          res.json({
            status: "FAILED",
            message: "Invalid credentials!",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "FAILED",
          message: err,
        });
      });
  }
};

//add shippingUnit
exports.addShippingUnit = (req, res) => {
  let { deliveryTime, name, price } = req.body;

  if (name === "" || deliveryTime === "" || price === "") {
    res.json({
      status: "FAILED",
      message: "Empty input fields!",
    });
  } else if (isNaN(price) && typeof price !== "number") {
    res.json({
      status: "FAILED",
      message: "The value of price time must be numeric!",
    });
  } else if (isNaN(deliveryTime) && typeof deliveryTime !== "number") {
    res.json({
      status: "FAILED",
      message: "The value of delivery time must be numeric!",
    });
  } else {
    //checking if user already exists
    ShippingUnit.find({ name })
      .then((result) => {
        if (result.length) {
          res.json({
            status: "FAILED",
            message: "The shipping Unit whose name is provided already exists",
          });
        } else {
          const shippingUnit = new ShippingUnit({
            name,
            price,
            deliveryTime,
          });
          shippingUnit
            .save()
            .then((result) => {
              res.json({
                status: "SUCCESS",
                message: "Add shipping Unit successfully!",
                data: result,
              });
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: err,
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: "FAILED",
          message: err,
        });
      });
  }
};

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

//delete shippingUnit
exports.deleteShippingUnit = (req, res) => {
  let { id } = req.params;

  if (!id) {
    return res.json({
      status: "FAILED",
      message: "Empty Id!",
    });
  }

  // Checking if the shipping unit exists
  ShippingUnit.findById(id)
    .then((result) => {
      if (result) {
        // Delete the shipping unit
        ShippingUnit.deleteOne({ _id: id })
          .then(() => {
            res.json({
              status: "SUCCESS",
              message: "Shipping Unit deleted successfully",
            });
          })
          .catch((err) => {
            console.log(err);
            res.json({
              status: "FAILED",
              message: "Error deleting shipping unit",
            });
          });
      } else {
        res.json({
          status: "FAILED",
          message: "Shipping Unit not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "Error finding shipping unit",
      });
    });
};


//update shippingUnit
exports.updateShippingUnit = async (req, res) => {
  let { deliveryTime, name, price } = req.body;
  let { id } = req.params;

  if (!name || !deliveryTime || !price) {
    return res.json({
      status: "FAILED",
      message: "Empty input fields!",
    });
  }

  if (!id) {
    return res.json({
      status: "FAILED",
      message: "Empty Id!",
    });
  }

  // Checking if the shipping unit exists
  ShippingUnit.findById(id)
    .then( async (result) => {
      if (!result) {
        return res.json({
          status: "FAILED",
          message: "Shipping Unit not found!",
        });
      }

      // Update the shipping unit
      result.name = name;
      result.price = price;
      result.deliveryTime = deliveryTime;

      await result.save();
    })
    .then((updatedResult) => {
      res.json({
        status: "SUCCESS",
        message: "Shipping Unit updated successfully!",
        data: updatedResult,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "Error updating shipping unit!",
      });
    });
};



// Hiển thị thống kê danh sách seller và doanh thu của seller theo tháng 
exports.revenueSellerByMonth = async (req, res) => {
  let { month, year } = req.params;

  if(month == "" || year == "") {
      return res.json({
          status: "FAILED",
          message: "Empty credentials supplied"
      });
  }

  const firstDayOfMonth = new Date(year, month - 1, 1); // Month in JavaScript is 0-indexed
  const lastDayOfMonth = new Date(year, month, 0);    

  try {
      const result = await Order.aggregate([
          {
              $match: {
                  status: "completed",
                  createAt: {
                      $gte: firstDayOfMonth,
                      $lt: lastDayOfMonth
                  }
              }
          },
          {
              $group: {
                  _id: "$idShop",
                  totalByShop: { $sum: "$totalByShop" }
              }
          }
      ]);

      const allSeller = await User.find({sellerRequestStatus: "SUCCESS"});
      let result1 = [];

      
      if (!result || result.length === 0) {
          for (let i = 0; i < allSeller.length; i++) {
              result1.push({
                  _id: allSeller[i]._id,
                  shopName: allSeller[i].shopName,
                  totalByShop: 0
              });
          }
          return res.json({
              status: "SUCCESS",
              message: "Revenue by month",
              data: result1
          });
      }
      for (let i = 0; i < allSeller.length; i++) {
          let shopFound = result.find(shop => shop._id.toString() === allSeller[i]._id.toString());
          if (!shopFound) {
              result1.push({
                  _id: allSeller[i]._id,
                  shopName: allSeller[i].shopName,
                  totalByShop: 0
              });
          } else {
              result1.push({
                  _id: allSeller[i]._id,
                  shopName: allSeller[i].shopName,
                  totalByShop: shopFound.totalByShop
              })
          }


      }
      res.json({
          status: "SUCCESS",
          message: "Revenue by month",
          data: result1
      });
  } catch (error) {
      console.error("Error fetching revenue data:", error);
      res.json({
          status: "FAILED",
          message: "Failed to fetch revenue data",
          error: error.message
      });
  }
};
