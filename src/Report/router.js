const router = require("express").Router();

const laporanPenjualanController = require("./controllers/LaporanPenjualanController");
const laporanStockController = require("./controllers/LaporanStockController");


router.post("/laporan/penjualan",laporanPenjualanController.c_getLaporanPenjualan);
router.get("/export/laporan/penjualan",laporanPenjualanController.c_exportlaporanPenjualan);
router.post("/laporan/stock",laporanStockController.c_getLaporanStock);
router.get("/export/laporan/stock",laporanStockController.c_exportLaporanStock);

module.exports = router