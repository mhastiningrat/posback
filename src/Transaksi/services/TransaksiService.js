const { m_postTransaksiJual } = require("../models/TransaksiModels")

const s_postTransaksiJual = async(params) =>{
    try {
        return await m_postTransaksiJual_postTransaksiJual(params)
    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}

module.exports = {
    s_postTransaksiJual
}