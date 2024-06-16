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
//       const user = await User.findById(userId);
//       if (!user) {
//         res.json({
//           status: "FAILED",
//           message: "The user with the provided id does not exist.",
//         });
//         return;
//       } else if (!user.carts || user.carts.length === 0) {
//         res.json({
//           status: "SUCCESS",
//           message: "Cart is empty",
//           data: null
//         });
//         return;
//       } else {
//         const cartData = await Promise.all(
//           user.carts.map(async (product) => {
//             const productData = await Product.findOne({ _id: product.productId });
//             if (!productData) {
//               res.json({
//                 status: "FAILED",
//                 message: "Product does not exist.",
//               });
//               return null;
//             } else {
//               const optionData = productData.option.id(product.optionProductId)
//               if (!optionData) {
//                 res.json({
//                   status: "FAILED",
//                   message: "Option does not exist."
//                 })
//                 return null;
//               } else {
//                 return {
//                   option: optionData,
//                   product: productData,
//                   quantity: product.quantity,
//                   checked: false,
//                   _id: product._id
//                 }
//               }
//             }
//           })
//         );
//         res.json({
//           status: "SUCCESS",
//           data: cartData.filter(item => item !== null),
//         });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   }
// };

exports.showCart = async (req, res) => {
  let { userId } = req.params;
  if (!userId) {
    return res.json({
      status: "FAILED",
      message: "Trường nhập liệu trống!",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        status: "FAILED",
        message: "Người dùng với id được cung cấp không tồn tại.",
      });
    }

    if (!user.carts || user.carts.length === 0) {
      return res.json({
        status: "SUCCESS",
        message: "Giỏ hàng trống",
        data: null
      });
    }

    const cartData = [];
    let errorMessage = null;

    for (const product of user.carts) {
      const productData = await Product.findOne({ _id: product.productId });
      if (!productData) {
        errorMessage = "Một hoặc nhiều sản phẩm không tồn tại.";
        break; // Sử dụng break hợp lệ trong vòng lặp for...of
      }

      const optionData = productData.option.find(option => option._id.toString() === product.optionProductId);
      if (!optionData) {
        errorMessage = "Một hoặc nhiều tùy chọn không tồn tại.";
        break; // Sử dụng break hợp lệ trong vòng lặp for...of
      }

      cartData.push({
        option: optionData,
        product: productData,
        quantity: product.quantity,
        checked: false,
        _id: product._id
      });
    }

    if (errorMessage) {
      return res.json({
        status: "FAILED",
        message: errorMessage
      });
    }

    res.json({
      status: "SUCCESS",
      data: cartData,
    });
  } catch (error) {
    console.error("Lỗi:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};


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

exports.removeFromCartweb = async (req, res) => {
  const { cartId, userId } = req.body;

  if (!userId || !cartId) {
    return res.status(400).json({ message: "Invalid request. Missing userId or cartId." });
  }

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    
    user.carts.pull({ _id: cartId });
    await user.save();

    return res.json({ status: "SUCCESS", message: "Remove product from cart successfully." });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
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


