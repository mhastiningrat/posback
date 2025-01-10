const { m_getAllPromo, m_insertNewPromo, m_updatePromo, m_getAllBudgetPromo, m_insertNewBudgetPromo, m_updateBudgetPromo } = require("../models/MasterPromoModels");

const  s_getAllPromo = async(params) => {
    try {
        return await m_getAllPromo(params);
    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}

const  s_insertNewPromo = async(params) => {
    try {

        const {wholesaler_id} = params;
        if(!wholesaler_id) throw new Error("Tolong pilih toko terlebih dahulu");

        return await m_insertNewPromo(params);
    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}

const s_updatePromo = async(params) => {
   

    try {
        const {id} = params.params;
        if(!id) throw new Error("ID Promo tidak ditemukan");
    
        const {wholesaler_id} = params.body;
        if(!wholesaler_id) throw new Error("Tolong pilih toko terlebih dahulu");
    
        params.body.id = id;
    
        return await m_updatePromo(params.body);
    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }

}

const s_getAllPromoBudget = async(params) => {
    try {
        return await m_getAllBudgetPromo(params);
    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
};

const  s_insertNewBudgetPromo = async(params) => {
    try {

        const {wholesaler_id,startDate} = params;
        if(!wholesaler_id) throw new Error("Tolong pilih toko terlebih dahulu");
        if(!startDate) throw new Error("Tolong pilih periode budget terlebih dahulu");

        return await m_insertNewBudgetPromo(params);
    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}

const s_updateBudgetPromo = async(params) => {
    try {
        const {id} = params.params;
        if(!id) throw new Error("ID Promo tidak ditemukan");
        const {wholesaler_id,startDate} = params.body;
        if(!wholesaler_id) throw new Error("Tolong pilih toko terlebih dahulu");
        if(!startDate) throw new Error("Tolong pilih periode budget terlebih dahulu");
        params.body.id = id;

        return await m_updateBudgetPromo(params.body);
    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }

};

module.exports = {
    s_getAllPromo,
    s_insertNewPromo,
    s_updatePromo,
    s_getAllPromoBudget,
    s_insertNewBudgetPromo,
    s_updateBudgetPromo
}