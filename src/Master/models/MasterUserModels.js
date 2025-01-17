const { sqlCon, sqlConGateway } = require("../../../config/db_config");
const { getMenu, getSubMenu } = require("../../Auth/models/AuthModels");

const m_getAllUser = async (params) => {
  try {

    const {keyword,role,wholesaler_id} = params;

    let query = `SELECT pa.*
                 ,ws.wholesaler_name 
                 ,ws.address 
                 ,ws.profile_img_url 
                 ,ws.wholesaler_id 
                 ,ws.is_active FROM grosir_pintar.pos_auth pa LEFT JOIN grosir_pintar.pos_wholesaler ws ON ws.wholesaler_id = pa.wholesaler_id WHERE pa.id IS NOT NULL `;

    if(wholesaler_id){
      query += ` AND pa.wholesaler_id='${wholesaler_id}' `
    }
    
    if(keyword){
      query += ` AND (pa.username LIKE '%${keyword}%' OR ws.wholesaler_name LIKE '%${keyword}%' OR pa.no_hp LIKE '%${keyword}%') `
    }

    if(role){
      query += ` AND pa.role_id=${role} `
    }

    let data_user = await sqlCon(query);
    console.log(data_user)
    // if (!data_user || data_user.length == 0) {
    //   throw new Error("Data user tidak ditemukan");
    // }

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
                  pa.no_hp,
                  pa.access_menu,
                  pa.access_submenu,
                  pa.menu_permission,
                  pa.profile_image,
                  ws.wholesaler_id,
                  ws.wholesaler_name,
                  ws.address,
                  ws.phone,
                  ws.owner,
                  ws.tp_cust_no 
                  FROM grosir_pintar.pos_auth pa 
                  LEFT JOIN grosir_pintar.pos_wholesaler ws ON ws.wholesaler_id = pa.wholesaler_id WHERE pa.id='${id}'`;
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

const m_updatePermissionByUserId = async(params) => {

  try {
    const {id,permission} = params;

    let updateQuery = `UPDATE grosir_pintar.pos_auth SET menu_permission='${permission}' WHERE id=${id}`

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

const m_getGatewayCustomer = async(params) => {
  try {
    const {keyword} = params;

    let query = `SELECT * FROM gateway.customer WHERE is_deleted = '0' AND is_active = '1'`;
    if(keyword) query += ` AND (cust_nama_toko ILIKE '%${keyword}%' OR cust_no_hp ILIKE '%${keyword}%')`;

    query += ` ORDER BY cust_name ASC LIMIT 100`;

    const data = await sqlConGateway(query);
    if(data == 'Mohon maaf ada kendala sistem') throw new Error(data);
    return {
      error: false,
      result: data,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
}

const m_getGPWholesaler = async(params) => {
  try {
    const {keyword} = params;

    let query = `SELECT * FROM grosir_pintar.wholesaler WHERE is_active = true `;
    if(keyword) query += ` AND (wholsaler_name ILIKE '%${keyword}%' OR phone ILIKE '%${keyword}%')`;

    const data = await sqlCon(query);
    if(data == 'Mohon maaf ada kendala sistem') throw new Error(data);
    return {
      error: false,
      result: data,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
}

const m_getPosWholesaler = async(params) => {
  try {
    const {keyword} = params;

    let query = `SELECT * FROM grosir_pintar.pos_wholesaler WHERE is_active = true `;
    if(keyword) query += ` AND (wholesaler_name ILIKE '%${keyword}%' OR phone ILIKE '%${keyword}%')`;
    console.log(query)
    const data = await sqlCon(query);
    if(data == 'Mohon maaf ada kendala sistem') throw new Error(data);
    return {
      error: false,
      result: data,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
}

const m_insertNewUserAsToko = async(params) =>{
  try {
    const{reff_id,owner,nama_toko,no_hp_toko,alamat_toko,img_profile} = params;

    let query = `INSERT INTO grosir_pintar.pos_wholesaler
    (wholesaler_name, address, phone, "owner",reference_code,profile_img_url)
    VALUES('${nama_toko}', '${alamat_toko}', '${no_hp_toko}', '${owner}', '${reff_id?reff_id:'-'}','${img_profile}') RETURNING *`

    const data = await sqlCon(query);
    if(data == 'Mohon maaf ada kendala sistem') throw new Error(data);
    return {
      error: false,
      result: data,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
}

const m_insertNewUserAsEmpleyee = async(params) =>{

  try {
    const{name,password,phone,role,wholesaler_id} = params;

    let query = `INSERT INTO grosir_pintar.pos_auth
(no_hp, username, "password", role_id,wholesaler_id)
VALUES('${phone}', '${name}', '${password}', ${role}, '${wholesaler_id}') RETURNING *`

    const data = await sqlCon(query);
    if(data == 'Mohon maaf ada kendala sistem') throw new Error(data);
    return {
      error: false,
      result: data,
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
    m_updateMenuByUserId,
    m_updatePermissionByUserId,
    m_getGatewayCustomer,
    m_getGPWholesaler,
    m_getPosWholesaler,
    m_insertNewUserAsToko,
    m_insertNewUserAsEmpleyee
};
