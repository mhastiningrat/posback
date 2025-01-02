const authRouter = require("./Auth/router")
const masterRouter = require("./Master/router")
const transaksiRouter = require("./Transaksi/router")
const voucherRouter = require("./Voucher/router")
const reportRouter = require("./Report/router")
const dashboardRouter = require("./Dashboard/router")

module.exports = {
    routes:[authRouter,masterRouter,transaksiRouter,voucherRouter,reportRouter,dashboardRouter]
}