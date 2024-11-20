const router = require("express").Router();

const transaksiController = require("./controllers/TransaksiController");


router.get("/transaksi/customer",transaksiController.customer);

module.exports = router