require("dotenv").config();
//mongodb user model
const User = require("../models/User");
const Admin = require("../models/Admin");
//Password handler
const bcrypt = require("bcrypt");

//email handler
const nodemailer = require("nodemailer");

const Product = require("../models/Product");
const Order = require("../models/Order");
const Inventory = require("../models/Inventory");

//add product
exports.addProduct = async (req, res) => {
  const {
    name,
    description,
    idCategory,
    idCategoryShop,
    idSubCategory,
    idShop,
    image,
    option,
  } = req.body;
  try {
    const newProduct = new Product({
      name: name,
      description: description,
      idCategory: idCategory,
      idCategoryShop: idCategoryShop,
      idSubCategory: idSubCategory,
      idShop: idShop,
      image: image,
      option: option,
    });
    await newProduct.save();

    res.status(200).json({ message: "Product created Successfully" });
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Lỗi khi tạo product:", error);
    throw error; // Re-throw lỗi để xử lý ở nơi gọi hàm này
  }
};

// const ProductSchema = new Schema({
//     name: String,
//     description: String,
//     idCategory: String,
//     idCategoryShop: String,
//     idSubCategory: String,
//     idShop: String,
//     sold: Number,
//     createAt: {
//         type: Date,
//         default: Date.now
//     },
//     image: [
//         {
//             url: String,
//         }
//     ],
//     option: [
//         {
//             imageUrl: String,
//             name: String,
//             price: Number,
//             quantity: Number,
//         }
//     ]
// })
// const InventorySchema = new Schema({
//     idProduct: String,
//     idShop: String,
//     option: [
//         {
//             idOption: String,
//             price: Number,
//             quantity: Number,
//         }
//     ],
//     createAt: {
//         type:Date,
//         default:Date.now
//     }
// })
//edit product
exports.updateProduct = async (req, res) => {
  const {
    productId,
    name,
    description,
    idCategory,
    idCategoryShop,
    idSubCategory,
    idShop,
    image,
    option,
  } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Cập nhật thông tin sản phẩm
    product.name = name;
    product.description = description;
    product.idCategory = idCategory;
    product.idCategoryShop = idCategoryShop;
    product.idSubCategory = idSubCategory;
    product.idShop = idShop;
    product.image = image;

    let newOption = [];
    // Kiểm tra và cập nhật hoặc tạo mới inventory
    for (const opt of option) {
      const existingOption = product.option.find(
        (opt) => opt._id.toString() === opt._id
      );
      if (!existingOption || existingOption.quantity != opt.quantity) {
        newOption.push(opt);
      }
    }
    await createInventory(product, newOption);
    product.option = option;

    await product.save();
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function createInventory(product, option) {
  // Nếu không có, tạo mới inventory
  const inventory = new Inventory({
    idProduct: product._id,
    idShop: product.idShop,
    option: option.map((opt) => ({
        idOption: opt._id,
        price: opt.price,
        quantity: opt.quantity,
        })),
  });
  await inventory.save();
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
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//show shop products
exports.showShopProduct = async (req, res) => {
  const { idShop } = req.params;
  try {
    const product = await Product.find({ idShop: idShop });
    if (!product) {
      return res.status(404).json({
        status: "FAILED",
        message: "Product not found",
      });
    }
    res.json({
      status: "SUCCESS",
      message: "Product found",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "FAILED",
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

//thống kê hàng tồn theo tháng
// exports.inventoryStatsByMonth = async (req, res) => {
//     const { idShop } = req.params;
//     try {
//         const product = await Product.find({ "idShop": idShop });
//         if (!product) {
//             return res.status(404).json({
//                 status: 'FAILED',
//                 message: 'Product not found'
//             });
//         }
//         let inventoryStats = [];
//         for (let i = 1; i <= 12; i++) {
//             let count = 0;
//             product.forEach(element => {
//                 if (element.createdAt.getMonth() + 1 == i) {
//                     count++;
//                 }
//             });
//             inventoryStats.push(count);
//         }
//         res.json({
//             status: 'SUCCESS',
//             message: 'Product found',
//             data: inventoryStats
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 'FAILED',
//             message: 'Failed to fetch product',
//             error: error.message
//         });
//     }
// }
// exports.inventoryStatsByMonth = async (req, res) => {
//     try {
//         const { shopId, month, year } = req.params;

//         const firstDayOfMonth = new Date(year, month - 1, 1);
//         const lastDayOfMonth = new Date(year, month, 0);

//         const result = await Product.aggregate([
//             {
//                 $match: {
//                     idShop: shopId,
//                     createAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
//                 }
//             },
//             {
//                 $unwind: "$option"
//             },
//             {
//                 $group: {
//                     _id: {
//                         day: { $dayOfMonth: "$createAt" },
//                         month: { $month: "$createAt" },
//                         year: { $year: "$createAt" },
//                         productId: "$_id"
//                     },
//                     totalQuantity: { $sum: "$option.quantity" }
//                 }
//             },
//             {
//                 $group: {
//                     _id: {
//                         day: "$_id.day",
//                         month: "$_id.month",
//                         year: "$_id.year"
//                     },
//                     totalInventory: { $sum: "$totalQuantity" }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     day: "$_id.day",
//                     month: "$_id.month",
//                     year: "$_id.year",
//                     totalInventory: 1
//                 }
//             }
//         ]);

//         res.status(200).json(result);
//     } catch (error) {
//         console.error("Error calculating inventory by month:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }

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

//Doanh thu theo tháng
exports.revenueByMonth = async (req, res) => {
  try {
    const { shopId, month, year } = req.params;

    // Tính ngày đầu tiên và ngày cuối cùng của tháng
    const firstDayOfMonth = new Date(year, month - 1, 1); // Month in JavaScript is 0-indexed
    const lastDayOfMonth = new Date(year, month, 0);

    // Sử dụng phương thức aggregate để group theo tháng và tính tổng doanh thu
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          idShop: shopId,
          status: "completed",
          createAt: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalByShop" },
        },
      },
    ]);

    // Trả về kết quả
    const revenue =
      monthlyRevenue.length > 0 ? monthlyRevenue[0].totalRevenue : 0;
    res.status(200).json({ month, year, revenue });
  } catch (error) {
    console.error("Error calculating monthly revenue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Doanh thu theo tháng trong 1 năm
exports.revenueByYear = async (req, res) => {
  try {
    const { shopId, year } = req.params;    
    // Sử dụng phương thức aggregate để group theo tháng và tính tổng doanh thu
    // chỉ tính doanh thu của đơn hàng đã hoàn thành
    const yearlyRevenue = await Order.aggregate([
      {
        $match: {
          idShop: shopId,
          status: "completed",
          createAt: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createAt" },
          month: { $first: { $month: "$createAt" } }, // Lấy tháng đầu tiên trong nhóm
          totalRevenue: { $sum: "$totalByShop" },
        },
      },
      {
        $project: {
          _id: 0, // Ẩn _id
          month: 1,
          totalRevenue: 1,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);
    // Trả về kết quả
    res.status(200).json(yearlyRevenue);
  } catch (error) {
    console.error("Error calculating yearly revenue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Thống kê khách hàng và doanh thu của khách hàng theo tháng
exports.revenueByCustomer = async (req, res) => {
  try {
    const { shopId, month, year } = req.params;

    // Tính ngày đầu tiên và ngày cuối cùng của tháng
    const firstDayOfMonth = new Date(year, month - 1, 1); // Month in JavaScript is 0-indexed
    const lastDayOfMonth = new Date(year, month, 0);

    // Sử dụng phương thức aggregate để group theo tháng và tính tổng doanh thu
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          idShop: shopId,
          status: "completed",
          createAt: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth,
          },
        },
      },
      {
        $group: {
          _id: "$idUser",
          totalRevenue: { $sum: "$totalByShop" },
        },
      },
    ]);

    // Trả về kết quả
    res.status(200).json(monthlyRevenue);
  } catch (error) {
    console.error("Error calculating monthly revenue by customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
