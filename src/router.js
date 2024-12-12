const authRouter = require("./Auth/router")
const masterRouter = require("./Master/router")
const transaksiRouter = require("./Transaksi/router")
const voucherRouter = require("./Voucher/router")

module.exports = {
    routes:[authRouter,masterRouter,transaksiRouter,voucherRouter]
}