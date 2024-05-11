const Router = require("express");
const UserController = require("../controllers/UserController");
const CategoryController = require("../controllers/CategoryController");
const AdminController = require("../controllers/AdminController");
const ProductController = require("../controllers/ProductController");

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
router.post('/upload/avatar', upload.single('image'), Images.uploadAvatar);
router.post('/upload/productImage', upload.array('images', 10), Images.uploadProductImages);


//Admin
router.post("/admin/signin", AdminController.signin);
router.post("/admin/addAdmin", AdminController.addAdmin);
router.get("/admin/showAdmin", AdminController.ShowListAdmin);
router.get("/admin/showSaleRegister", UserController.showSaleRegister);
router.post("/admin/approveSaleRequest", AdminController.approveSaleRequest);
router.post("/admin/rejectSaleRequest", AdminController.rejectSaleRequest);

//User
router.get("/shop/user/:id", UserController.getUser);
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

//category
router.post("/admin/newCategory", CategoryController.NewCategory)
router.post("/admin/newSubCategory", CategoryController.CreateSubCategory)
router.put("/admin/updateCategory", CategoryController.UpdateCategory)
router.delete("/admin/deleteCategory", CategoryController.DeleteCategory)
router.put("/admin/updateSubCategory", CategoryController.UpdateSubCategory)
router.delete("/admin/deleteSubCategory", CategoryController.DeleteSubCategory)
router.get("/admin/showCategory", CategoryController.ShowCategory)
router.get("/admin/Category/:id", CategoryController.ShowOneCategory)
router.post("/admin/subCategory", CategoryController.showSubCategory)
router.get("/admin/:id/:subCategoryId", CategoryController.getSubCategory)

//products
router.get("/product/detail/:id", ProductController.getOneProduct)
router.get("/detail/shop/:id", ProductController.getInfoShop)
router.post("/product/newProduct", ProductController.NewProduct)
router.put("/product/updateProduct", ProductController.UpdateProduct)
router.delete("/product/deleteProduct", ProductController.DeleteProduct)

//seller add product
router.post("/seller/addProduct", SellerController.addProduct)
router.get("/seller/showShopProduct/:idShop", SellerController.showShopProduct)
router.put("/seller/updateProduct", SellerController.updateProduct)
router.delete("/seller/deleteProduct/:productId", SellerController.deleteProduct)


//orders
//show order by shop
router.get("/order/showOrdersByShop/:shopId", OrderController.showOrdersByShop);
//show order by buyer
router.get("/order/showOrdersByBuyer/:userId", OrderController.showOrdersByBuyer);
//show order by id
router.get("/order/showOrderById/:id", OrderController.showOrderById);
//show shop order by status: processing, paid , delivered, completed
router.get("/order/showOrdersByStatus", OrderController.showOrdersByStatus);
//create order
router.post("/order/createOrder", OrderController.createOrder);
//change status order
router.put("/order/changeStatusOrder", OrderController.changeStatusOrder);
//show order detail
router.get("/order/showOrderDetail/:id",OrderController.showOrderDetail)

//Thống kê

//doanh thu cửa hàng theo tháng
router.get("/seller/revenueByMonth/:shopId/:month/:year", SellerController.revenueByMonth)
//Tiền lời của từng tháng trong năm
router.get("/seller/profitByYear/:shopId/:year", SellerController.profitByYear)
//Hàng tồn theo tháng
router.get("/seller/inventoryStatsByMonth/:productId/:year", SellerController.inventoryStatsByMonth)
//doanh thu theo tháng trong 1 năm
router.get("/seller/revenueByYear/:shopId/:year", SellerController.revenueByYear)
//thống kê doanh thu của từng khách hàng theo tháng
router.get("/seller/revenueByCustomer/:shopId/:month/:year", SellerController.revenueByCustomer)

module.exports = router;