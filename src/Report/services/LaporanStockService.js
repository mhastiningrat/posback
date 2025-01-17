const { m_getLaporanStock } = require("../models/LaporanStockModels");

const s_getLaporanStock = async (params) => {
    try {
      const { wholesaler_id } = params;
  
      if (!wholesaler_id) throw new Error("Grosir tidak ditemukan");
  
      return await m_getLaporanStock(params);
  
  
  
    } catch (error) {
      return {    
          error:error.message,    
          result:false    
      }  
    }
  };

  const s_exportLaporangStock = async (params) => {
    try {
      return await s_getLaporanStock(params);
    } catch (error) {
      return {    
        error:error.message,    
        result:false    
    }
    }
  }

  module.exports = {
    s_getLaporanStock,
    s_exportLaporangStock
  }