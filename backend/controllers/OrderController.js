const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');


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
}
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
}



//show order by id
exports.showOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const orders = await Order.findById(id);
        if (!orders) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ orders });
    }
    catch (error) {
        console.error("Error showing order by id:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


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



//create order
exports.createOrder = async (req, res) => {
    const { idShop, idUser, option, totalByShop, idShippingUnit } = req.body;
    try {
        const order = new Order({
            idShop,
            idUser,
            option,
            status: "processing",
            totalByShop,
            idShippingUnit
        });
        await order.save();
        res.status(200).json({ message: "Order created successfully" });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//change status order
//Người mua hủy đơn hàng/ Người bán xác nhận, hoàn tất đơn hàng
exports.changeStatusOrder = async (req, res) => {
    const { orderId, status } = req.body;
    try {
        await Order.findByIdAndUpdate(orderId, { status });
        res.status(200).json({ message: "Order status updated" });
    }
    catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.showOrderDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        const user = await User.findById(order.idUser);
        
        const productOptionInfoPromises = order.option.map(async (opt) => {
            const product = await Product.findById(opt.idProduct);
            const option = product.option.find(item => item.id === opt.idOption);
            return { "idProduct": opt.idProduct, "idOption":opt.idOption ,"name" : option.name, "imageUrl": option.imageUrl, "price": opt.price, "quantity": opt.quantity};
        });
        const productOptionInfo = await Promise.all(productOptionInfoPromises);
        const orderDetail = {
            "id": id,
            "idShop": order.idShop,
            "idUser": order.idUser,
            "status": order.status,
            "totalByShop": order.totalByShop,
            "idShippingUnit": order.idShippingUnit,
            "createAt": order.createAt,
            "option": productOptionInfo,
            "user": user
        }
        res.status(200).json({ orderDetail });
    } catch (error) {
        console.error("Error showing order detail:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
