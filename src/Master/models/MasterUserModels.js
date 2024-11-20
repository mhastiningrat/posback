const { sqlCon } = require("../../../config/db_config");

const getAllUser = async (params) => {
  try {
    let query = `SELECT pa.*
                 ,ws.wholesaler_name 
                 ,ws.address 
                 ,ws.profile_img_url 
                 ,ws.tp_cust_no 
                 ,ws.is_active FROM grosir_pintar.pos_auth pa LEFT JOIN grosir_pintar.wholesaler ws ON ws.phone = pa.wholesaler_no_hp`;

    let data_user = await sqlCon(query);

    if (!data_user.rows) {
      throw new Error("Data user tidak ditemukan");
    }

    for(let i of data_user.rows){
        delete i.password
    }

    return {
      error: false,
      result: data_user.rows,
    };
      
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};

module.exports = {
    getAllUser
};
