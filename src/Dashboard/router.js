const router = require("express").Router();
const salesDasboardController = require("./controllers/SalesDashboardController");

router.get("/dashboard/sales", salesDasboardController.c_getSalesDashboard); 

module.exports = router