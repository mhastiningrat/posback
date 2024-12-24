const { m_getLaporanPenjualan, m_getDetailLaporanTransaksi, m_getLaporanPenjualanFromLogs } = require("../models/LaporanPenjualanModels");

const s_getLaporanPenjualan = async (params) => {
  try {
    const { wholesaler_id } = params;

    if (!wholesaler_id) throw new Error("Grosir tidak ditemukan");

    const data = await m_getLaporanPenjualan(params);

    console.log(data.result[0].result)

    let dataTransaksi = data.result[0].result.transaksi;
    let totalModal = 0
    if(!dataTransaksi) throw new Error("Data transaksi tidak ditemukan");
    for(let i of dataTransaksi){
      if(i.tipe !== 'return'){
        let dataDetailTransaksi = await m_getDetailLaporanTransaksi({order_no:i.order_no});
        console.log(dataDetailTransaksi.result[0].detail)
        // i.detail = dataDetailTransaksi.result[0].detail
        let detailPerTransaksi = dataDetailTransaksi.result[0].detail
       
        totalModal += detailPerTransaksi.total_modal
        
      }
      
    }
    console.log(totalModal)
    data.result[0].result.total_modal =  totalModal;
    data.result[0].result.keuntungan =  data.result[0].result.net_total - totalModal;

    return {    
        error:false,    
        result:data.result
    }
  } catch (error) {
    return {    
        error:error.message,    
        result:false    
    }  
  }
};

const s_getLaporanPenjualanFromLogs = async(params) => {
  try {

    const { wholesaler_id } = params;

    if (!wholesaler_id) throw new Error("Grosir tidak ditemukan");

    return await m_getLaporanPenjualanFromLogs(params);

  } catch (error) {
    return {    
      error:error.message,    
      result:false    
  }  
  }
}

module.exports = {
    s_getLaporanPenjualan,
    s_getLaporanPenjualanFromLogs
}
