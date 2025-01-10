const { s_getAllPromo, s_insertNewPromo, s_updatePromo, s_getAllPromoBudget, s_insertNewBudgetPromo, s_updateBudgetPromo } = require("../services/MasterPromoService");
const { response } = require("../../../utils/response");

const c_getAllPromo = async (req, res) => {
    try {
        const params = req.query;
        const { error, result } = await s_getAllPromo(params);
        
        if (error) {
            return response.error(res, error);
        }

        response.success(res, result);
    } catch (error) {
        return response.errorSystem(res, error);
    }
};

const c_insertNewPromo = async (req, res) => {
    try {
        const { error, result } = await s_insertNewPromo(req.body);
        
        if (error) {
            return response.error(res, error);
        }

        response.success(res, result);
    } catch (error) {
        
    }
};

const c_updatePromo = async (req, res) => {
    try {
        const { error, result } = await s_updatePromo(req);
        
        if (error) {
            return response.error(res, error);
        }

        response.success(res, result);
    } catch (error) {
        
    }
};

const c_getAllPromoBudget = async (req, res) => {
    try {
        const params = req.query;
        const { error, result } = await s_getAllPromoBudget(params);
        
        if (error) {
            return response.error(res, error);
        }

        response.success(res, result);
    } catch (error) {
        return response.errorSystem(res, error);
    }
}

const c_insertNewBudgetPromo = async (req, res) => {
    try {
        const { error, result } = await s_insertNewBudgetPromo(req.body);
        
        if (error) {
            return response.error(res, error);
        }

        response.success(res, result);
    } catch (error) {
        
    }
};

const c_updateBudgetPromo = async (req, res) => {
    try {
        const { error, result } = await s_updateBudgetPromo(req);
        
        if (error) {
            return response.error(res, error);
        }

        response.success(res, result);
    } catch (error) {
        
    }
};

module.exports = {
    c_getAllPromo,
    c_insertNewPromo,
    c_updatePromo,
    c_getAllPromoBudget,
    c_insertNewBudgetPromo,
    c_updateBudgetPromo
}