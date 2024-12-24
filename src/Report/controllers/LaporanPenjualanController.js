const { response } = require("../../../utils/response");
const { s_getLaporanPenjualan, s_getLaporanPenjualanFromLogs } = require("../services/LaporanPenjualanService");

const c_getLaporanPenjualan = async(req,res) => {
    try {
        // const {error,result} = await s_getLaporanPenjualan(req.body);
        const {error,result} = await s_getLaporanPenjualanFromLogs(req.body);

        if (error) {
            return response.error(res, error);
        }

        response.success(res, result);          
    } catch (error) {
        return response.errorSystem(res, error);
    }
}

module.exports = {
    c_getLaporanPenjualan
}