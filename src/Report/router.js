const router = require("express").Router();

const laporanPenjualanController = require("./controllers/LaporanPenjualanController");
const laporanStockController = require("./controllers/LaporanStockController");


router.post("/laporan/penjualan",laporanPenjualanController.c_getLaporanPenjualan);
router.post("/laporan/stock",laporanStockController.c_getLaporanStock);

module.exports = router