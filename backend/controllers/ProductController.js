require("dotenv").config()
//mongodb user model
const User = require('../models/User')
const Product = require('../models/Product')

exports.getOneProduct = (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.json({
            status: "FAILED",
            message: "idProduct null"
        })
    } else {
        Product.findById(id)
            .then(data => {
                if (!data) {
                    res.json({
                        status: "FAILED",
                        message: "Product not found!"
                    });
                    return;
                } else {
                    User.findById(data.idShop).then(shop => {
                        if (!shop) {
                            res.json({
                                status: "FAILED",
                                message: "shop not found!"
                            });
                            return;
                        } else {
                            res.json({
                                status: "SUCCESS",
                                data: data,
                                shop: shop
                            });
                        }
                    })
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

exports.getAllProduct = (req, res) => {
    Product.find()
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

exports.getProductOption = (req, res) => {
    const { optionId, productId } = req.params;
    if (optionId === '' || productId === '') {
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        })
    } else {
        Product.findById(productId)
            .then(product => {
                if (!product) {
                    res.json({
                        status: "FAILED",
                        message: "Product not found!"
                    });
                    return;
                }
                const option = product.option.id(optionId);
                if (!option) {
                    res.json({
                        status: "FAILED",
                        message: "Option not found for this product!"
                    });
                    return;
                }
                res.json({
                    status: "SUCCESS",
                    data: {
                        nameProduct: product.name,
                        option
                    }
                });
            })
            .catch(err => {
                res.json({
                    status: "FAILED",
                    message: err.message
                })
            })
    }
}

// exports.getProductOption = async (req, res) => {
//     const { optionId, productId } = req.params;
//     if (optionId === '' || productId === '' ) {
//         res.json({
//             status: "FAILED",
//             message: "Empty input fields!"
//         })
//     } else {
//     try {
//         const product = await Product.findOne({ "_id": productId });
//         if (!product) {
//             return res.status(404).json({ message: "Product not found" });
//         }
//         const option = product.option.find(opt => opt._id.toString() === optionId);
//         if (!option) {
//             return res.status(404).json({ message: "Option not found for this product" });
//         }
//         res.json({
//             status: 'SUCCESS',
//             message: 'Option found',
//             data: {
//     nameProduct: product.name,
//     option
// }
//         });
//     } catch (error) {
//         console.error("Error updating subcategory:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }}

exports.getInfoShop = async (req, res) => {
    const { id } = req.params;
    if (!id) {
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
                    products: data,
                    user: user
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
//create product
exports.NewProduct = async (req, res) => {
    let { name, description, idCategory, idShop, sold } = req.body
    if (name === '' || description === '' || idCategory === '' || idShop === '' || sold === '') {
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        })
    } else {
        try {
            const newProduct = new Product({
                name: name,
                description: description,
                idCategory: idCategory,
                idShop: idShop,
                sold: sold,
            });

            await newProduct.save();
            res.status(200).json({ message: "Product created Successfully" });
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Lỗi khi tạo product:", error);
            throw error; // Re-throw lỗi để xử lý ở nơi gọi hàm này
        }
    }
}
//update product
exports.UpdateProduct = async (req, res) => {
    const { id, name, description, idCategory, idShop, sold } = req.body;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        product.name = name;
        product.description = description;
        product.idCategory = idCategory;
        product.idShop = idShop;
        product.sold = sold;

        await product.save();
        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        console.error("Error updating Product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//delete product
exports.DeleteProduct = async (req, res) => {
    const { id } = req.body;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting Product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getProductByCategory = (req, res) => {
    const { idCategory } = req.params;
    if (idCategory === '') {
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        })
    } else {
        Product.find({ "idCategory": idCategory })
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

  exports.searchProduct = async (req, res) => {
    try {
      let { searchText } = req.query;
      if (!searchText) {
        throw Error("Empty searchText are not allowed");
      } else {
        Product.find({ $text: { $search: searchText } })
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
    } catch (err) {
      res.json({
        status: "FAILED",
        message: err.message,
      });
    }
  };
  