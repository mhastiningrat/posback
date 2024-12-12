const { sqlCon } = require("../../../config/db_config");

const getAllKurir = async (params) => {
  try {

    const {wholesaler_id} = params;

    let kurirQuery = `SELECT * FROM grosir_pintar.m_driver WHERE is_delete = false `;

    if(wholesaler_id){
        kurirQuery += ` AND wholesaler_id='${wholesaler_id}'`      
    }

    let data_kurir = await sqlCon(kurirQuery);

    if (!data_kurir) {
        throw new Error("Data kurir tidak ditemukan");
    }

    return {
      error: false,
      result: data_kurir,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};


module.exports = {
    getAllKurir
}
