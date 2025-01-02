const { response } = require("../../../utils/response");
const { s_getSalesDashboard } = require("../services/SalesDashboardService");

const c_getSalesDashboard = async (req, res) => {
    try {
        const { error, result } = await s_getSalesDashboard(req.query);

        if (error) {
            return response.error(res, error);
        }

        response.success(res, result);
    } catch (error) {
        return response.errorSystem(res, error);
    }
};
module.exports = { c_getSalesDashboard };