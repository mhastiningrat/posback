const router = require("express").Router();

const voucherController = require("./controllers/VoucherController");


router.post("/voucher",voucherController.allVoucher);

module.exports = router