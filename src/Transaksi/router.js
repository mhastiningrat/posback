const router = require("express").Router();

const transaksiController = require("./controllers/TransaksiController");
const transaksiHistoryController = require("./controllers/TransaksiHistoryController");
const transaksiReturnController = require("./controllers/TransaksiReturnController");


router.get("/transaksi/customer",transaksiController.c_getAllCustomer);
router.get("/transaksi/product",transaksiController.c_getAllProduct);
router.get("/transaksi/:pcode/product/promo",transaksiController.c_getPromoByProduct);
router.post("/transaksi/delivery",transaksiController.c_getAllDelivery);
router.post("/transaksi/jual",transaksiController.c_postTransaksiJual);
router.get("/transaksi/history",transaksiHistoryController.c_getAllTransaksiHistory);
router.get("/transaksi/:order_no/history",transaksiHistoryController.c_getAllTransaksiHistoryById);

router.post("/transaksi/return",transaksiReturnController.c_postTransaksiReturn);

module.exports = router