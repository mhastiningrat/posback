const router = require("express").Router();
const masterUserController = require("./controllers/MasterUserController");
const masterInventoryController = require("./controllers/MasterInventoryController");
const masterKurirController = require("./controllers/MasterKurirController");

router.get("/master/user", masterUserController.allUser);
router.get("/master/inventory", masterInventoryController.allProduk);
router.get("/master/inventory/category", masterInventoryController.allCategory);
router.get("/master/kurir", masterKurirController.AllKurir);

module.exports = router