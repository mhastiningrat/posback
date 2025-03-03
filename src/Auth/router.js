const router = require("express").Router()
const { upload } = require("../../config/multer_config")
const authController = require("./controllers/AuthController");
const accountController = require("./controllers/AccountController");

router.post("/auth/register", authController.register)
router.post("/auth/login", authController.login)
router.get("/auth/allmenu", authController.allMenu)
router.get("/auth/permission", authController.c_getMenuPermissionById);
router.post("/account/upload/photo", upload.single('file'),accountController.c_uploadPhotoProfile);
router.post("/account/remove/photo", accountController.c_removePhotoProfileImage);
router.post("/account/photo", accountController.c_updatePhotoProfile);

module.exports = router