const router = require("express").Router();
const masterUserController = require("./controllers/MasterUserController");
const masterInventoryController = require("./controllers/MasterInventoryController");
const masterKurirController = require("./controllers/MasterKurirController");
const masterSupplierController = require("./controllers/MasterSupplierController");
const masterCustomerController = require("./controllers/MasterCustomerController");
const masterPromoController = require("./controllers/MasterPromoController");
const { upload } = require("../../config/multer_config");
  

router.get("/master/user", masterUserController.c_getAllUser);
router.get("/master/:id/user", masterUserController.c_getUserById);
router.get("/master/user/:id/menu", masterUserController.c_getMenuByUserId);
router.post("/master/user/:id/menu", masterUserController.c_updateMenuByUserId);
router.get("/master/toko-bersama", masterUserController.c_getTokoBersama);
router.post("/master/user/toko", masterUserController.c_insertNewUserAsToko);
router.post("/master/user/employee", masterUserController.c_insertNewUserAsEmployee);
router.get("/master/user/toko", masterUserController.c_getPosWholesaler);
router.get("/master/user/:id/permission", masterUserController.c_getPermissionByUserId);
router.post("/master/user/:id/permission", masterUserController.c_updatePermissionByUserId);


router.get("/master/:id/menu", masterUserController.c_getMenuById);
router.get("/master/inventory", masterInventoryController.C_getAllProduk);
router.get("/master/inventory/category", masterInventoryController.C_getAllProdukCategory);
router.get("/master/inventory/subcategory", masterInventoryController.C_getAllProdukSubCategory);
router.get("/master/inventory/principal", masterInventoryController.C_getAllPrincipal);
router.get("/master/inventory/uom", masterInventoryController.C_getAllUom);
router.post("/master/inventory/stock", masterInventoryController.C_postStockAndPrice);
router.post("/master/inventory/conversion", masterInventoryController.C_updateProductConversion);
router.post("/master/inventory/detail", masterInventoryController.C_updateDetailMasterProduct);
router.post("/master/inventory/grosir/product", masterInventoryController.C_postNewProductGrosir);
router.get("/master/inventory/master/product", masterInventoryController.C_getAllProductMaster);
router.get("/master/kurir", masterKurirController.AllKurir);
router.post("/master/inventory/upload/image/product", upload.single('file'),masterInventoryController.C_uploadProductImage);
router.post("/master/inventory/remove/image/product",masterInventoryController.C_removeProductImage);
router.post("/master/inventory/remove/product",masterInventoryController.C_deleteProductGrosir);

router.get("/master/supplier",masterSupplierController.c_getSupplier);
router.post("/master/supplier",masterSupplierController.c_insertSupplier);
router.post("/master/supplier/:code",masterSupplierController.c_updateSupplierById);

router.get("/master/customer", masterCustomerController.c_getPosCustomer);
router.post("/master/customer", masterCustomerController.c_addPosCustomer);

router.get('/master/promo', masterPromoController.c_getAllPromo);
router.post('/master/promo', masterPromoController.c_insertNewPromo);
router.post('/master/:id/promo', masterPromoController.c_updatePromo);
router.get('/master/promo/budget', masterPromoController.c_getAllPromoBudget);
router.post('/master/promo/budget', masterPromoController.c_insertNewBudgetPromo);
router.post('/master/promo/:id/budget', masterPromoController.c_updateBudgetPromo);


    

module.exports = router