const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

//show order by shop
exports.showOrdersByShop = async (req, res) => {
  const { shopId } = req.params;
  try {
    const orders = await Order.find({ idShop: shopId });
    if (!orders) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error showing order by shop:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//show order by buyer
exports.showOrdersByBuyer = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ idUser: userId });
    if (!orders) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error showing order by user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//show shop order by status
exports.showOrdersByStatus = async (req, res) => {
  const { shopId, status } = req.body;
  try {
    // const orders = await Order.find({ status: status});
    // if (!orders) {
    //     return res.status(404).json({ message: "Order not found" });
    // }

    const orders = await Order.find({ idShop: shopId, status: status });
    if (!orders) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error showing order by status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//show order by id
exports.showOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.findById(id);
    if (!orders) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error showing order by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const OrderSchema = new Schema({
//     idShop: String,
//     idUser:String,
//     status:String,
//     totalByShop:Number,
//     idShippingUnit:String,
//     createAt: {
//         type:Date,
//         default:Date.now
//     },
//     option: [
//         {
//             idOption: String,
//             idProduct: String,
//             price: Number,
//             quantily: Number,
//         }
//     ]
// })
//function update product option quantity
async function updateProductOptionQuantity(prdOptId, quantity) {
  const product = await Product.findOne({ "option._id": prdOptId });
  const option = product.option.find((opt) => opt._id == prdOptId);
}

//create order
exports.createOrder = async (req, res) => {
  const {
    idShop,
    idUser,
    option,
    address,
    nameShippingUnit,
    shippingCost,
    idShippingUnit,
  } = req.body;

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
      status: "processing",
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

//change status order
//Người mua hủy đơn hàng/ Người bán xác nhận, hoàn tất đơn hàng
exports.changeStatusOrder = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    await Order.findByIdAndUpdate(orderId, { status });
    res.status(200).json({ message: "Order status updated" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.showOrderDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const user = await User.findById(order.idUser);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const productOptionInfoPromises = order.option.map(async (opt) => {
      const product = await Product.findById(opt.idProduct);
      const option = product.option.find((item) => item.id === opt.idOption);
      return {
        idProduct: opt.idProduct,
        idOption: opt.idOption,
        productName: product.name,
        optionName: option.name,
        imageUrl: option.imageUrl,
        price: opt.price,
        quantity: opt.quantity,
      };
    });
    const productOptionInfo = await Promise.all(productOptionInfoPromises);
    const orderDetail = {
      id: id,
      idShop: order.idShop,
      idUser: order.idUser,
      buyerName: user.name || "Unknown", // Kiểm tra xem user có tồn tại hay không trước khi truy cập thuộc tính name
      status: order.status,
      address: order.address,
      nameShippingUnit: order.nameShippingUnit,
      shippingCost: order.shippingCost,
      totalByShop: order.totalByShop,
      idShippingUnit: order.idShippingUnit,
      createAt: order.createAt,
      option: productOptionInfo,
    };
    res.status(200).json({ orderDetail });
  } catch (error) {
    console.error("Error showing order detail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
