require("dotenv").config()
//mongodb user model
const User = require('../models/User')
const Admin = require('../models/Admin')
//Password handler
const bcrypt = require('bcrypt')

//email handler
const nodemailer = require('nodemailer')

const Product = require('../models/Product')


//add product
exports.addProduct = async (req, res) => {
    const { name, description, idCategory, idCategoryShop, idSubCategory, idShop, image, option } = req.body;
    try {
        const newProduct = new Product({
            name: name,
            description: description,
            idCategory: idCategory,
            idCategoryShop: idCategoryShop || null,
            idSubCategory: idSubCategory,
            idShop: idShop,
            image: image,
            option: option
        });

        await newProduct.save();
        

        res.status(200).json({ message: "Product created Successfully" });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Lỗi khi tạo product:", error);
        throw error; // Re-throw lỗi để xử lý ở nơi gọi hàm này
    }
}

//edit product
exports.updateProduct = async (req, res) => {
    const { productId, name, description, idCategory, idCategoryShop, idSubCategory, idShop, image, option } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        product.name = name;
        product.description = description;
        product.idCategory = idCategory;
        product.idCategoryShop = idCategoryShop;
        product.idSubCategory = idSubCategory;
        product.idShop = idShop;
        product.image = image;
        product.option = option;
        await product.save();
        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//delete product
exports.deleteProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        let result = await Product.findByIdAndDelete(productId);
        res.status(200).json({ message: "Product deleted successfully" });        
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//show shop products
exports.showShopProduct = async (req, res) => {
    const { idShop } = req.params;
    try {
        const product = await Product.find({ "idShop": idShop });
        if (!product) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Product not found'
            });
        }
        res.json({
            status: 'SUCCESS',
            message: 'Product found',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            status: 'FAILED',
            message: 'Failed to fetch product',
            error: error.message
        });
    }
}
// exports.editSellerProfile = async (req, res) => {
//     const { userId, shopDescript, shopAddress, shopName } = req.body;
//     try {
//         const user = await User.findById (userId);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         user.shopDescript = shopDescript;
//         user.shopAddress = shopAddress;
//         user.shopName = shopName;
//         await user.save();
//         res.status(200).json({ message: "User updated successfully" });
//     }
//     catch (error) {
//         console.error("Error updating user:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }
