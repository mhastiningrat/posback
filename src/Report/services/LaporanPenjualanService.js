const { m_getLaporanPenjualan } = require("../models/LaporanPenjualanModels");

const s_getLaporanPenjualan = async (params) => {
  try {
    const { wholesaler_id } = params;

    if (!wholesaler_id) throw new Error("Grosir tidak ditemukan");

    return await m_getLaporanPenjualan(params);



  } catch (error) {
    return {    
        error:error.message,    
        result:false    
    }  
  }
};

module.exports = {
    s_getLaporanPenjualan
}
