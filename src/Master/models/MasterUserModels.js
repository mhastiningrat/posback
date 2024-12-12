const { sqlCon } = require("../../../config/db_config");
const { getMenu, getSubMenu } = require("../../Auth/models/AuthModels");

const m_getAllUser = async (params) => {
  try {
    let query = `SELECT pa.*
                 ,ws.wholesaler_name 
                 ,ws.address 
                 ,ws.profile_img_url 
                 ,ws.tp_cust_no 
                 ,ws.is_active FROM grosir_pintar.pos_auth pa LEFT JOIN grosir_pintar.wholesaler ws ON ws.phone = pa.wholesaler_no_hp`;

    let data_user = await sqlCon(query);
    console.log(data_user)
    if (!data_user || data_user.length == 0) {
      throw new Error("Data user tidak ditemukan");
    }

    for(let i of data_user){
        delete i.password
    }

    return {
      error: false,
      result: data_user,
    };
      
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};


const m_getUserById = async(params)=>{
  try {
    const {id} = params
    
    let query = `SELECT pa.username,
                  pa.wholesaler_no_hp,
                  pa.access_menu,
                  pa.access_submenu,
                  ws.wholesaler_id,
                  ws.wholesaler_name,
                  ws.address,
                  ws.phone,
                  ws.owner,
                  ws.tp_cust_no 
                  FROM grosir_pintar.pos_auth pa 
                  LEFT JOIN grosir_pintar.wholesaler ws ON ws.phone = pa.wholesaler_no_hp WHERE pa.id='${id}'`;
    console.log(query)
    let data_user = await sqlCon(query);
    console.log(data_user)
    if (!data_user || data_user.length == 0) {
      throw new Error("Data user tidak ditemukan");
    }

    return {
      error: false,
      result: data_user,
    };
      
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
}

const m_getMenuById = async(params) =>{
  try {
    const {id} = params;
    let query = `SELECT * FROM grosir_pintar.pos_menu WHERE id='${id}'`;

    let data_menu = await sqlCon(query);
    // console.log(data_user)
    if (!data_menu || data_menu.length == 0) {
      throw new Error("Data user tidak ditemukan");
    }

    return {
      error: false,
      result: data_menu,
    };
      
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
}

const m_updateMenuByUserId = async(params) => {

  try {
    const {id,menu,submenu} = params;

    let updateQuery = `UPDATE grosir_pintar.pos_auth SET access_menu='${menu}', access_submenu='${submenu}' WHERE id=${id}`

    let data_update = await sqlCon(updateQuery);
    
    return {
      error: false,
      result: data_update,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
}
module.exports = {
    m_getAllUser,
    m_getUserById,
    m_getMenuById,
    m_updateMenuByUserId
};
