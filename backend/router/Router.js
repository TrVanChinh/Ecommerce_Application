const Router = require("express");
const UserController = require("../controllers/UserController");
const CategoryController = require("../controllers/CategoryController");
const AdminController = require("../controllers/AdminController");
const Images = require("../controllers/Images");

const router = Router();

const multer = require("multer");
const upload = multer({ dest: '../uploads/' });

//upload images
router.post('/upload/avatar', upload.single('image'), Images.uploadAvatar);


//Admin
router.post("/admin/signin", AdminController.signin);
router.post("/admin/addAdmin", AdminController.addAdmin);
router.get("/admin/showSaleRegister", UserController.showSaleRegister);
router.post("/admin/approveSaleRequest", AdminController.approveSaleRequest);
router.post("/admin/rejectSaleRequest", AdminController.rejectSaleRequest);


router.post("/user/signup", UserController.signup);
router.post("/user/verify", UserController.verifyOTP);
router.post("/user/resendVerificationCode", UserController.resendVerificationCode);
router.post("/user/signin", UserController.signin);
router.post("/user/forgotPassword", UserController.forgotPassword);
router.post("/user/SaleRegister", UserController.saleRegister);

//category
router.post("/admin/newCategory", CategoryController.NewCategory)
router.post("/admin/newSubCategory", CategoryController.CreateSubCategory)
router.put("/admin/updateCategory", CategoryController.UpdateCategory)
router.delete("/admin/deleteCategory", CategoryController.DeleteCategory)
router.put("/admin/updateSubCategory", CategoryController.UpdateSubCategory)
router.delete("/admin/deleteSubCategory", CategoryController.DeleteSubCategory)
router.get("/admin/showCategory", CategoryController.ShowCategory)

module.exports = router;