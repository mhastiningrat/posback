const { response } = require("../../../utils/response");
const { s_getLaporanStock } = require("../services/LaporanStockService");
const c_getLaporanStock = async(req,res) => {
    try {
        const {error,result} = await s_getLaporanStock(req.body);

        if (error) {
            return response.error(res, error);
        }

        response.success(res, result);
    } catch (error) {
        return response.errorSystem(res, error);
    }
}

module.exports = {
    c_getLaporanStock
}   