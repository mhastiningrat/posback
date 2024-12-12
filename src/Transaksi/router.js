const router = require("express").Router();

const transaksiController = require("./controllers/TransaksiController");


router.get("/transaksi/customer",transaksiController.customer);
router.post("/transaksi/dataproses",transaksiController.dataProsesTransaksi);

module.exports = router