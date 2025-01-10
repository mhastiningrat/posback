const { response } = require("../../../utils/response");
const { s_getSupplier, s_updateSupplierById, s_insertNewSupplier } = require("../services/MasterSupplierService")

const c_getSupplier = async(req,res) => {
    try {
        const {error,result} = await s_getSupplier(req.query);

        if (error) {
            return response.error(res, error);
        }

        response.success(res, result);
    } catch (error) {
        return response.errorSystem(res, error);
    }
}

const c_updateSupplierById = async(req,res) => {
    try {
        const {error,result} = await s_updateSupplierById(req);

        if (error) {
            return response.error(res, error);
        }

        response.success(res, result);
    } catch (error) {
        return response.errorSystem(res, error);
    }
}

const c_insertSupplier = async(req,res) => {
    try {
        const {error,result} = await s_insertNewSupplier(req.body);

        if (error) {
            return response.error(res, error);
        }

        response.success(res, result);
    } catch (error) {
        return response.errorSystem(res, error);
    }
}

module.exports = {
    c_getSupplier,
    c_updateSupplierById,
    c_insertSupplier
}