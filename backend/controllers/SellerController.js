require("dotenv").config();
//mongodb user model
const User = require("../models/User");
const Admin = require("../models/Admin");
//Password handler
const bcrypt = require("bcrypt");
//mongoose is not defined
const mongoose = require("mongoose");
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
      sold: 0,
    });
    let stock = 0;
    for (const opt of option) {
      stock += parseInt(opt.quantity);
    }

    await newProduct.save();
    // Tạo inventory cho product
    await createInventory(newProduct, stock, option);

    res.status(200).json({ message: "Product created Successfully" });
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Lỗi khi tạo product:", error);
    throw error; // Re-throw lỗi để xử lý ở nơi gọi hàm này
  }
};

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
    let isEqual = false;
    let stock = 0;
    for (const opt of option) {
      const existingOption = product.option.find(
        (opt1) => opt1._id.toString() == opt._id
      );
      stock += parseInt(opt.quantity);
      // Nếu existingOption.quantity > opt.quantity thì cho update
      if (existingOption) {
        if (existingOption.quantity > opt.quantity) {
          isEqual = true;
        } else if (existingOption.quantity < opt.quantity) {
          newOption.push({
            _id: opt._id,
            name: opt.name,
            price: opt.price,
            quantity: opt.quantity - existingOption.quantity,
          });
        }
      }else{
        //generate _id
        opt._id = new mongoose.Types.ObjectId();
        newOption.push({
          _id: opt._id,
          name: opt.name,
          price: opt.price,
          quantity: opt.quantity,
        });
      }
    }

    if (isEqual) {
      return res.status(400).json({
        message:
          "Số lượng sản phẩm cập nhật phải lớn hơn hoặc bằng số lượng sản phẩm trong kho",
      });
    } else {
      if (newOption.length > 0) {
        await createInventory(product, stock, newOption);
      }
      product.option = option;
      await product.save();
      res.status(200).json({ message: option });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function createInventory(product, stock, option) {
  // Nếu không có, tạo mới inventory
  const inventory = new Inventory({
    idProduct: product._id,
    idShop: product.idShop,
    stock: stock,
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

//edit shop profile
exports.updateShop = async (req, res) => {
  const { id, avatarUrl, shopName, shopAddress, shopDescript } = req.body;
  try {
    const shop = await User.findById(id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    shop.shopName = shopName;
    shop.avatarUrl = avatarUrl;
    shop.shopAddress = shopAddress;
    shop.shopDescript = shopDescript;
    await shop.save();
    res.status(200).json({ message: "Shop updated successfully" });
  } catch (error) {
    console.error("Error updating shop:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//show product detail
exports.getOneProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById;
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.error("Error showing product by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

//Tiền lời theo tháng trong 1 năm
exports.profitByYear = async (req, res) => {
  //tiền lời của 1 đơn hàng bằng totalByShop - shippingCost
  try {
    const { shopId, year } = req.params;
    let result = [];
    for (let i = 1; i <= 12; i++) {
      const firstDayOfMonth = new Date(year, i - 1, 1);
      const lastDayOfMonth = new Date(year, i, 0);
      const orders = await Order.find({
        idShop: shopId,
        status: "completed",
        createAt: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
      });
      let profit = 0;
      orders.forEach((order) => {
        profit += order.totalByShop - order.shippingCost;
      });
      result.push({
        month: i,
        profit: profit,
      });
    }
    res.status(200).json({ result });
  } catch (error) {
    console.error("Error calculating yearly profit:", error);
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

    let result = [];
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

    // const user = await User.findById(monthlyRevenue[0]._id);
    for (let i = 0; i < monthlyRevenue.length; i++) {
      await User.findById(monthlyRevenue[i]._id).then((user) => {
        result.push({
          userId: user._id,
          userName: user.name,
          totalRevenue: monthlyRevenue[i].totalRevenue,
        });
      });
    }

    // Trả về kết quả
    res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating monthly revenue by customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//thống kê hàng tồn theo tháng
exports.inventoryStatsByMonth = async (req, res) => {
  try {
    const { productId, year } = req.params;
    if (isNaN(year)) {
      return res.status(400).json({ error: "Năm phải là số." });
    }
    let result = [];
    //lấy các id option product
    let product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: product });
    }
    //tính số lượng hiện có của tất của sản phẩm trong shop
    for (let i = 1; i <= 12; i++) {
      //kiểm tra tháng i năm year có vượt quá thời gian hiện tại không
      if (year == new Date().getFullYear() && i > new Date().getMonth() + 1) {
        result.push({
          month: i,
          stock: null,
          totalSoldInMonth: null,
          totalImportInMonth: null,
        });
      } else {
        const firstDayOfMonth = new Date(year, i - 1, 1);
        const lastDayOfMonth = new Date(year, i, 0);

        // Sử dụng aggregate để tính tổng số lượng sản phẩm đã bán trong tháng
        const totalSoldInMonthResult = await Order.aggregate([
          {
            $match: {
              status: "completed", // Chỉ lấy đơn hàng đã hoàn thành
              createAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }, // Trong khoảng thời gian từ ngày đầu tiên đến ngày cuối của tháng
            },
          },
          {
            $unwind: "$option", // Mở rộng mảng option thành các tài liệu riêng lẻ
          },
          {
            $match: {
              "option.idProduct": productId, // Chỉ lấy option có idProduct phù hợp với productId đã cho
            },
          },
          {
            $group: {
              _id: null, // Nhóm tất cả các tài liệu lại với nhau
              totalQuantity: { $sum: "$option.quantity" }, // Tính tổng số lượng từ các tài liệu đã nhóm lại
            },
          },
        ]);

        // Lấy kết quả tổng số lượng sản phẩm đã bán trong tháng
        const totalSoldInMonth =
          totalSoldInMonthResult.length > 0
            ? totalSoldInMonthResult[0].totalQuantity
            : 0;

        const totalImportInMonthResult = await Inventory.find({
          idProduct: productId,
          createAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
        });
        let totalImportInMonth = 0;
        totalImportInMonthResult.forEach((inv) => {
          inv.option.forEach((opt) => {
            totalImportInMonth += opt.quantity;
          });
        });

        let totalSold = 0;
        const orders = await Order.find({
          status: "completed",
          "option.idProduct": productId,
          createAt: {
            $gte: new Date(product.createAt),
            $lte: new Date(year, i, 0),
          },
        });
        orders.forEach((order) => {
          order.option.forEach((opt) => {
            if (opt.idProduct == productId) {
              totalSold += opt.quantity;
            }
          });
        });
        let totalImport = 0;
        const inventory = await Inventory.find({
          idProduct: productId,
          createAt: {
            $gte: new Date(product.createAt),
            $lte: new Date(year, i, 0),
          },
        });
        inventory.forEach((inv) => {
          inv.option.forEach((opt) => {
            totalImport += opt.quantity;
          });
        });

        if (inventory) {
          result.push({
            month: i,
            stock: totalImport - totalSold,
            totalSoldInMonth: totalSoldInMonth,
            totalImportInMonth: totalImportInMonth,
          });
        }
      }
    }

    // const currentMonth = new Date().getMonth() + 1;

    res.status(200).json({
      result: result,
    });
  } catch (error) {
    console.error("Error calculating inventory by month:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Thống kê hàng tồn tất cả sản phẩm trong cửa hàng theo tháng
exports.inventoryStatsForAllProductsByMonth = async (req, res) => {
  try {
    const { shopId, year } = req.params;
    if (isNaN(year)) {
      return res.status(400).json({ error: "Năm phải là số." });
    }

    const result = [];

    // Lấy tất cả sản phẩm của cửa hàng
    const products = await Product.find({ idShop: shopId });
    for (let i = 1; i <= 12; i++) {
      // Kiểm tra tháng i năm year có vượt quá thời gian hiện tại không
      if (year == new Date().getFullYear() && i > new Date().getMonth() + 1) {
        result.push({
          month: i,
          stock: null,
          totalSoldInMonth: null,
          totalImportInMonth: null,
        });
      } else {
        const firstDayOfMonth = new Date(year, i - 1, 1);
        const lastDayOfMonth = new Date(year, i, 0);

        let totalSold = 0;
        let totalImport = 0;
        let totalImportInMonth = 0;
        let totalSoldInMonth = 0;
        for (const product of products) {
          const orders = await Order.find({
            status: "completed",
            "option.idProduct": product._id,
            createAt: {
              $gte: new Date(product.createAt),
              $lte: lastDayOfMonth,
            },
          });
          orders.forEach((order) => {
            order.option.forEach((opt) => {
              if (opt.idProduct == product._id) {
                totalSold += opt.quantity;
              }
            });
          });

          const inventory = await Inventory.find({
            idProduct: product._id,
            createAt: {
              $gte: new Date(product.createAt),
              $lte: lastDayOfMonth,
            },
          });
          inventory.forEach((inv) => {
            inv.option.forEach((opt) => {
              totalImport += opt.quantity;
            });
          });

          const totalSoldInMonthResult = await Order.aggregate([
            {
              $match: {
                status: "completed", // Chỉ lấy đơn hàng đã hoàn thành
                createAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }, // Trong khoảng thời gian từ ngày đầu tiên đến ngày cuối của tháng
              },
            },
            {
              $unwind: "$option", // Mở rộng mảng option thành các tài liệu riêng lẻ
            },
            {
              $match: {
                "option.idProduct": product._id, // Chỉ lấy option có idProduct phù hợp với productId đã cho
              },
            },
            {
              $group: {
                _id: null, // Nhóm tất cả các tài liệu lại với nhau
                totalQuantity: { $sum: "$option.quantity" }, // Tính tổng số lượng từ các tài liệu đã nhóm lại
              },
            },
          ]);

          // Lấy kết quả tổng số lượng sản phẩm đã bán trong tháng
          totalSoldInMonth =
            totalSoldInMonthResult.length > 0
              ? totalSoldInMonthResult[0].totalQuantity
              : 0;

          const totalImportInMonthResult = await Inventory.find({
            idProduct: product._id,
            createAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
          });
          totalImportInMonth = 0;
          totalImportInMonthResult.forEach((inv) => {
            inv.option.forEach((opt) => {
              totalImportInMonth += opt.quantity;
            });
          });
        }

        result.push({
          month: i,
          stock: totalImport - totalSold,
          totalSoldInMonth: totalSoldInMonth,
          totalImportInMonth: totalImportInMonth,
        });
      }
    }
    res.status(200).json({ result: result });
  } catch (error) {
    console.error("Error calculating inventory by month:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};