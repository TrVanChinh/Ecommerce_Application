require("dotenv").config();
//mongodb user model
const User = require("../models/User");
const Product = require("../models/Product");

//add Product To Cart
exports.addProductToCart = async (req, res) => {
  let { optionProductId, productId, quantity, userId } = req.body;
  if (
    optionProductId === "" ||
    productId === "" ||
    quantity === "" ||
    userId === ""
  ) {
    res.json({
      status: "FAILED",
      message: "Empty input fields!",
    });
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
            const itemPresent = user.carts.find(
              (item) => item.optionProductId === optionProductId
            );
            if (itemPresent) {
              itemPresent.quantity += quantity;
              await user.save();
              res.json({
                status: "SUCCESS",
                message: "added successfullyd",
              });
            } else {
                user.carts.push({
                    optionProductId: optionProductId,
                    productId: productId,
                    quantity: quantity,
                  });
                  
              await user.save();
              res.json({
                status: "SUCCESS",
                message: "Add to cart successfully",
              });
            }
          }
        })
        .catch((err) => {
          res.json({
            status: "FAILED",
            message: err,
          });
        });
    } catch (error) {
      console.error("Lỗi:", error);
      throw error;
    }
  }
};
exports.showCart = async (req, res) => {
  let { userId } = req.params;
  if (userId === "") {
    res.json({
      status: "FAILED",
      message: "Empty input fields!",
    });
    return;
  } else {
    try {
      const user = await User.findById(userId);
      if (!user) {
        res.json({
          status: "FAILED",
          message: "The user with the provided id does not exist.",
        });
        return;
      } else if (!user.carts || user.carts.length === 0) {
        res.json({
          status: "SUCCESS",
          message: "Cart is empty",
          data: null
        });
        return;
      } else {
        const cartData = await Promise.all(
          user.carts.map(async (product) => {
            const productData = await Product.findOne({ _id: product.productId });
            if (!productData) {
              res.json({
                status: "FAILED",
                message: "Product does not exist.",
              });
              return null;
            } else {
              const optionData = productData.option.id(product.optionProductId)
              if (!optionData) {
                res.json({
                  status: "FAILED",
                  message: "Option does not exist."
                })
                return null;
              } else {
                return {
                  option: optionData,
                  product: productData,
                  quantity: product.quantity,
                  checked: false,
                  _id: product._id
                }
              }
            }
          })
        );
        res.json({
          status: "SUCCESS",
          data: cartData.filter(item => item !== null),
        });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// exports.showCart = async (req, res) => {
//   let { userId } = req.params;
//   if (userId === "") {
//     res.json({
//       status: "FAILED",
//       message: "Empty input fields!",
//     });
//     return;
//   } else {
//     try {
//       await User.findById(userId)
//         .then(async (user) => {
//           if (!user) {
//             res.json({
//               status: "FAILED",
//               message: "The user with the provided id does not exist.",
//             });
//             return;
//           } else if (!user.carts || user.carts.length === 0) {
//             res.json({
//               status: "SUCCESS",
//               message: "Cart is empty",
//               data: null
//             });
//             return;
//           } else {
//             const cartData = await Promise.all(
//               user.carts.map(async (product) => {
//                 if (errorOccurred) return; 

//                 const productData = await Product.findOne({ _id: product.productId });
//                 if (!productData) {
//                   res.json({
//                     status: "FAILED",
//                     message: "Product does not exist.",
//                   });
//                   errorOccurred = true; 
//                   return;
//                 } else {
//                   const optionData = productData.option.id(product.optionProductId)
//                   if(!optionData) {
//                       res.json({
//                           status:"FAILED",
//                           message:"Option does not exist."
//                       })
//                       errorOccurred = true;
//                       return;
//                   } else {
//                       return {
//                           option: optionData,
//                           product: productData,
//                           quantity: product.quantity,
//                           checked: false,
//                           _id: product._id
//                       }
//                   }
//                 }
//               })
//             );
//             res.json({
//               status: "SUCCESS",
//               data: cartData,
//             });
//           }
//         })
//         .catch((err) => {
//           res.json({
//             status: "FAILED",
//             message: "hehehe",
//           });
//         });
//     } catch (error) {
//       console.error("Error:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   }
// };

exports.removeFromCart = async (req, res) => {
  const { cartId, userId } = req.body;
  try {
    User.findOne({ _id: userId }).then((user) => {
      if (!user) {
        res.json({
          status: "FAILED",
          message: "User not found!",
        });
        return;
      } else {
        user.carts.pull({ _id: cartId });
        user.save();

        res.json({
          status: "SUCCESS",
          message: "Remove product from cart successfully.",
        });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Increase the quantity of products in the shopping cart
exports.increaseQuantity = async (req, res) => {
  let { cartId, userId } = req.body;
  if (cartId === "" || userId === "") {
    res.json({
      status: "FAILED",
      message: "Empty input fields!",
    });
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
            const itemPresent = user.carts.find((item) => item.id === cartId);
            if (itemPresent) {
              itemPresent.quantity++;
              await user.save();
              res.json({
                status: "SUCCESS",
                message: "Increase the quantity successfullyd",
              });
            } else {
              res.json({
                status: "FAILED",
                message: "No products found in the cart",
              });
            }
          }
        })
        .catch((err) => {
          res.json({
            status: "FAILED",
            message: err,
          });
        });
    } catch (error) {
      console.error("Lỗi:", error);
      throw error;
    }
  }
};

//Decrement  the quantity of products in the shopping cart
exports.decrementQuantity = async (req, res) => {
  let { cartId, userId } = req.body;
  if (cartId === "" || userId === "") {
    res.json({
      status: "FAILED",
      message: "Empty input fields!",
    });
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
            const itemPresent = user.carts.find((item) => item.id === cartId);
            if (itemPresent) {
              itemPresent.quantity--;
              await user.save();
              res.json({
                status: "SUCCESS",
                message: "Decrement the quantity successfullyd",
              });
            } else {
              res.json({
                status: "FAILED",
                message: "No products found in the cart",
              });
            }
          }
        })
        .catch((err) => {
          res.json({
            status: "FAILED",
            message: err,
          });
        });
    } catch (error) {
      console.error("Lỗi:", error);
      throw error;
    }
  }
};
