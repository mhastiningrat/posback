const { m_postTransaksiReturn } = require("../models/TransaksiReturnModels")

const s_postTransaksiReturn = async(params) =>{
    try {
        return await m_postTransaksiReturn(params)
    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}

module.exports = {
    s_postTransaksiReturn
}