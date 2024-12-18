const router = require("express").Router();

const laporanPenjualanController = require("./controllers/LaporanPenjualanController");


router.post("/laporan/penjualan",laporanPenjualanController.c_getLaporanPenjualan);

module.exports = router