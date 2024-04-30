const Router = require("express");
const UserController = require("../controllers/UserController");
const CategoryController = require("../controllers/CategoryController");
const AdminController = require("../controllers/AdminController");
const Images = require("../controllers/Images");
const SellerController = require("../controllers/SellerController");

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
router.get("/admin/subCategory", CategoryController.showSubCategory)

//seller add product
router.post("/seller/addProduct", SellerController.addProduct)
router.get("/seller/showShopProduct/:idShop", SellerController.showShopProduct)
router.put("/seller/updateProduct", SellerController.updateProduct)
router.delete("/seller/deleteProduct/:productId", SellerController.deleteProduct)



module.exports = router;