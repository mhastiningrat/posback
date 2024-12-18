const { s_getAllTransaksiHistoryById, s_getAllTransaksiHistory } = require("../services/TransaksiHistoryService");
const { response } = require("../../../utils/response");
const c_getAllTransaksiHistory = async (req, res) => {
    try {
        const { error, result } = await s_getAllTransaksiHistory(req.query);

        if (error) {
            return response.error(res, error);
        }

        response.success(res, result);
    } catch (error) {
        return response.errorSystem(res, error);
    }
};  

const   c_getAllTransaksiHistoryById = async (req, res) => {
    try {
        const { error, result } = await s_getAllTransaksiHistoryById(req.params);

        if (error) {
            return response.error(res, error);                                    
        }                            

        response.success(res, result);
    } catch (error) {
        return response.errorSystem(res, error);
    }
};

module.exports = {
    c_getAllTransaksiHistory,
    c_getAllTransaksiHistoryById
}

