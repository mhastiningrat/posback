const { sqlCon } = require("../../../config/db_config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAuth = async (payload) => {
  try {
    let no_hp = payload.no_hp;
    let roles_id = payload.role;
    let password = payload.password;

    let query = `SELECT pa.no_hp
                 ,pa.id
                 ,pa.profile_image
                 ,pa.username 
                 ,pa.role_id 
                 ,pa.access_menu 
                 ,pa.access_submenu 
                 ,pa.menu_permission
                 ,pa.password
                 ,pr.role 
                 ,ws.wholesaler_id 
                 ,ws.wholesaler_name 
                 ,ws.address 
                 ,ws.profile_img_url 
                 ,ws.tp_cust_no 
                 ,ws.is_active 
                 ,ws.status_go 
                  FROM grosir_pintar.pos_auth pa 
                 LEFT JOIN grosir_pintar.pos_wholesaler ws ON ws.wholesaler_id = pa.wholesaler_id
                 LEFT JOIN grosir_pintar.pos_roles pr ON pr.role_id = pa.role_id 
                 WHERE pa.no_hp='${no_hp}'`;
    console.log(query)
    let data_auth = await sqlCon(query);
// console.log(data_auth)
    if (data_auth.length === 0) {
      throw new Error("Akun tidak di temukan");
    }

    let hash_password = data_auth[0].password;

    const is_valid = await bcrypt.compareSync(password, hash_password);

    if (is_valid) {
      // let query = `SELECT * FROM grosir_pintar.pos_menu WHERE id IN (${data_auth[0].access_menu}) ORDER BY level asc`
      let data_access_menu = {
        access_menu: data_auth[0].access_menu,
      };
      let data_menu = await getMenu(data_access_menu);
      data_menu = data_menu.result;

      if (data_menu && data_menu.length > 0) {
        for (let i of data_menu) {
          let data_access_submenu = {
            access_submenu: data_auth[0].access_submenu,
            level: i.level,
          };
          let data_submenu = await getSubMenu(data_access_submenu);
          data_submenu = data_submenu.result;

          if (data_submenu && data_submenu.length > 0) {
            i.submenu = data_submenu;
          }
        }
        if(!data_auth[0].access_menu) data_auth[0].menu = [];
        else data_auth[0].menu = data_menu;
        delete data_auth[0].password;

        const accessToken = jwt.sign(
          data_auth[0],
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "12h" }
        );
        const refreshToken = jwt.sign(
          data_auth[0],
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        return {
          error: false,
          result: refreshToken,
        };
      }
    } else {
      throw new Error("Password Salah");
    }
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};

const getMenu = async (payload) => {
  try {
    const {access_menu} = payload;

    let query = `SELECT *,false as grant FROM grosir_pintar.pos_menu WHERE parent=0 `;

    if(access_menu) query += ` AND id IN (${access_menu})`;

    query += ` ORDER BY level asc`;
    console.log(query)
    let data_menu = await sqlCon(query);

    return {
      error: false,
      result: data_menu,
    };
  } catch (error) {
    return {
      error: error.message,
      result: null,
    };
  }
};

const getSubMenu = async (payload) => {
  try {
    let access_submenu = payload.access_submenu;
    let level = payload.level;

    let query = `SELECT *,false as grant FROM grosir_pintar.pos_menu WHERE parent='${level}'`;

    if(access_submenu) query += ` AND id IN (${access_submenu}) `;

    query += ` ORDER BY level asc`

    let data_submenu = await sqlCon(query);

    return {
      error: false,
      result: data_submenu,
    };
  } catch (error) {
    return {
      error: error.message,
      result: {},
    };
  }
};

const getRoles = async () => {
  try {
    let query = `SELECT * FROM grosir_pintar.pos_roles ORDER BY role_id asc`;

    let data = await sqlCon(query);
    if (data && !data) {
      throw new Error("Data role tidak ditemukan");
    }

    return {
      error: false,
      result: data,
    };
  } catch (error) {
    return {
      error: error,
      result: {},
    };
  }
};

const getAllMenu = async () => {
  try {
      let menu = await getMenu({});
      menu = menu.result;
      if(menu && menu.length > 0){
        for(let i of menu){
          let params = {
            level:i.level
          }
          let submenu = await getSubMenu(params);
          submenu = submenu.result
          if(submenu && submenu.length > 0) {
            i.submenu = submenu
          }
        }

        return {
          error:false,
          result:menu
        }
      }

      throw new Error("Data menu tidak ditemukan");
  } catch (error) {
    console.log(error)
    return {
      error:error.message,
      result:{}
    }
  }
};

const m_getMenuPermissionById = async (params) => {
  try {
    const { id } = params;
    let query = `SELECT * FROM grosir_pintar.pos_menu_permission WHERE id IN (${id})`;
    console.log(query)
    let data_menu_permission = await sqlCon(query);
    
    return {
      error: false,
      result: data_menu_permission,  
    };
  } catch (error) { 
    return {
      error: error.message,
      result: false,
    };
  }
};

const m_getMenuPermission = async (params) => {
  try {
    
    let query = `SELECT *,false as grant FROM grosir_pintar.pos_menu_permission `;

    let data_menu_permission = await sqlCon(query);

    return {
      error: false,
      result: data_menu_permission,  
    };
  } catch (error) { 
    return {
      error: error.message,
      result: false,
    };
  }
};

module.exports = {
  getAuth,
  getRoles,
  getAllMenu,
  getMenu,
  getSubMenu,
  m_getMenuPermissionById,
  m_getMenuPermission
};
