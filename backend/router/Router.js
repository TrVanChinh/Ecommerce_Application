const Router = require("express");
const UserController = require("../controllers/UserController");
const CategoryController = require("../controllers/CategoryController");
const AdminController = require("../controllers/AdminController");
const ProductController = require("../controllers/ProductController");
const CartController = require("../controllers/CartController");

const Images = require("../controllers/Images");
const SellerController = require("../controllers/SellerController");
const OrderController = require("../controllers/OrderController");

const router = Router();

const multer = require("multer");
const upload = multer({ dest: '../uploads/' });

//upload images
// router.post('/upload/avatar', upload.single('image'), Images.uploadAvatar);
// router.post('/upload/productImage', upload.single('image'), Images.uploadProductImage);
// router.post('/upload/productImages', upload.array('images', 20), Images.uploadProductImages);
router.put('/upload/avatar', upload.single('image'), Images.uploadAvatar);
router.post('/upload/productImage', upload.array('images', 10), Images.uploadProductImages);


//Admin
router.post("/admin/signin", AdminController.signin);
router.post("/admin/addAdmin", AdminController.addAdmin);
router.get("/admin/showAdmin", AdminController.ShowListAdmin);
router.get("/admin/showSaleRegister", UserController.showSaleRegister);
router.post("/admin/approveSaleRequest", AdminController.approveSaleRequest);
router.post("/admin/rejectSaleRequest", AdminController.rejectSaleRequest);
router.get("/admin/showAllSellerRequest", UserController.showAllSellerRequestStatus);
//Hiển thị thống kê danh sách seller và doanh thu của seller theo tháng 
router.get("/admin/showRevenueSellerByMonth/:month/:year", AdminController.revenueSellerByMonth);

//shippingUnit
router.post("/admin/addShippingUnit", AdminController.addShippingUnit);
router.put("/admin/updateShippingUnit/:id", AdminController.updateShippingUnit);
router.delete("/admin/deleteShippingUnit/:id", AdminController.deleteShippingUnit);
router.get("/shippingUnit", AdminController.ShowShippingUnit);

//User
router.get("/shop/user/:id", UserController.getUser);
router.put("/user/updateUser", UserController.updateUser);
router.put("/user/updatePassword", UserController.updatePassword);
router.post("/user/signup", UserController.signup);
router.post("/user/verify", UserController.verifyOTP);
router.post("/user/resendVerificationCode", UserController.resendVerificationCode);
router.post("/user/signin", UserController.signin);
// router.post("/user/forgotPassword", UserController.forgotPassword);
router.post("/user/emailAuthentication", UserController.emailAuthentication);
router.post("/user/verifyOTPofForgotPassword", UserController.verifyOTPofForgotPassword);
router.post("/user/setupPassword", UserController.setupPassword);
router.post("/user/SaleRegister", UserController.saleRegister);
// sendOTPVerificationEmailSeller
router.post("/user/sendOTPVerificationEmailSeller", UserController.sendOTPVerificationEmailSeller);
//verifyOTPVerificationEmailSeller
router.post("/user/verifyOTPSeller", UserController.verifyOTPSeller);

//Address
router.get("/user/:id/getAddress", UserController.getAddress);
router.post("/user/newAddress", UserController.newAddress);
router.put("/user/updateAddress", UserController.updateAddress);
router.post("/user/deleteAddress", UserController.deleteAddress);

//order
router.post("/user/order", UserController.order);
router.get("/user/getOrder/:id", UserController.getOrderData);
router.get("/user/getOrderCompleted/:id", UserController.getOrderCompleted);
router.get("/user/getOrderCompletedByMonth", UserController.getOrderCompletedByMonth);
//thống kê dữ liệu 12 tháng theo năm
router.post("/user/getOrderCompletedByYear", UserController.getOrderCompletedByYear);
router.post("/user/getOrder/cancelOrder", UserController.cancelOrder);
router.post("/user/getOrder/confirmOrder", UserController.confirmOrder);

//payment
router.post("/user/create-payment", UserController.createPayment);
router.post("/user/create-payment-web", UserController.createPaymentweb);



//category
router.post("/admin/newCategory", CategoryController.NewCategory)
router.post("/admin/newSubCategory", CategoryController.CreateSubCategory)
router.put("/admin/updateCategory", CategoryController.UpdateCategory)
router.delete("/admin/deleteCategory", CategoryController.DeleteCategory)
router.put("/admin/updateSubCategory", CategoryController.UpdateSubCategory)
router.delete("/admin/deleteSubCategory", CategoryController.DeleteSubCategory)
router.get("/admin/showCategory", CategoryController.ShowCategory)
router.get("/showCategory", CategoryController.ShowCategory)
router.get("/admin/Category/:id", CategoryController.ShowOneCategory)
router.post("/admin/subCategory", CategoryController.showSubCategory)
router.get("/admin/:id/:subCategoryId", CategoryController.getSubCategory)

//products
router.get("/product/detail/:id", ProductController.getOneProduct)
router.get("/products", ProductController.getAllProduct)
router.get("/product/:productId/option/:optionId", ProductController.getProductOption)
router.get("/detail/shop/:id", ProductController.getInfoShop)
router.get("/product/category/:idCategory", ProductController.getProductByCategory)

//search 
router.get("/product/searchProduct", ProductController.searchProduct)



//seller add product
router.post("/seller/addProduct", SellerController.addProduct)
router.get("/seller/showShopProduct/:idShop", SellerController.showShopProduct)
router.put("/seller/updateProduct", SellerController.updateProduct)
router.delete("/seller/deleteProduct/:productId", SellerController.deleteProduct)
//update shop info
router.put("/seller/updateShop", SellerController.updateShop)

//orders
//show order by shop
router.get("/order/showOrdersByShop/:shopId", OrderController.showOrdersByShop);
//show order by buyer
router.get("/order/showOrdersByBuyer/:userId", OrderController.showOrdersByBuyer);
//show order by id
router.get("/order/showOrderById/:id", OrderController.showOrderById);
//show shop order by status: processing: đã đặt, paid: đã thanh toán , delivered:đã giao, completed:đã hoàn thành, canceled: đã hủy
router.get("/order/showOrdersByStatus", OrderController.showOrdersByStatus);
//create order
router.post("/order/createOrder", OrderController.createOrder);
//change status order
router.put("/order/changeStatusOrder", OrderController.changeStatusOrder);
//show order detail
router.get("/order/showOrderDetail/:id", OrderController.showOrderDetail)


//Cart
router.post("/product/addCart", CartController.addProductToCart)
router.get("/Cart/:userId", CartController.showCart)
router.post("/cart/removeFromCart", CartController.removeFromCart)
router.post("/cart/removeFromCart-web", CartController.removeFromCartweb)

router.post("/cart/increaseQuantity", CartController.increaseQuantity)
router.post("/cart/decrementQuantity", CartController.decrementQuantity)


//Thống kê

//doanh thu cửa hàng theo tháng
router.get("/seller/revenueByMonth/:shopId/:month/:year", SellerController.revenueByMonth)
//Tiền lời của từng tháng trong năm
router.get("/seller/profitByYear/:shopId/:year", SellerController.profitByYear)
//doanh thu theo tháng trong 1 năm
router.get("/seller/revenueByYear/:shopId/:year", SellerController.revenueByYear)
//thống kê doanh thu của từng khách hàng theo tháng
router.get("/seller/revenueByCustomer/:shopId/:month/:year", SellerController.revenueByCustomer)
//Hàng tồn 1 sản phẩm theo tháng trong năm
router.get("/seller/inventoryStatsByMonth/:productId/:year", SellerController.inventoryStatsByMonth)
//Hàng tồn của tất cả sản phẩm theo tháng trong năm
router.get("/seller/inventoryStatsForAllProductsByMonth/:shopId/:year", SellerController.inventoryStatsForAllProductsByMonth)

module.exports = router;
