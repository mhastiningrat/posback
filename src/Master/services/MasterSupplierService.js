const { m_getSupllier, m_updateSupplierById, m_insertNewSupplier } = require("../models/MasterSupplierModels")

const s_getSupplier = async(params) => {
    try {
        return await m_getSupllier(params);
    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}

const s_insertNewSupplier = async(params) => {
    try {
        const {name,phone} = params;
        if(!name) throw new Error("Nama Supplier harus diisi");
        if(!phone) throw new Error("Nomor HP Supplier harus diisi");

        return await m_insertNewSupplier(params);
    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}

const s_updateSupplierById = async(params) => {
    try {
        const {code} = params.params;

        if(!code) throw new Error("ID Supplier tidak ditemukan");

        params.body.code = code;
        
        const {error,result} = await m_updateSupplierById(params.body);

        if(result > 0){
            return {
                error:false,
                result:[
                    {
                        success:true
                    }
                ]
            }
        }

    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
    

}

module.exports = {
    s_getSupplier,
    s_updateSupplierById,
    s_insertNewSupplier
}