const { getMenu, getSubMenu, getAllMenu, m_getMenuPermissionById, m_getMenuPermission } = require("../../Auth/models/AuthModels");
const { m_getUserById, m_updateMenuByUserId, m_updatePermissionByUserId, m_getGatewayCustomer, m_getGPWholesaler, m_getPosWholesaler, m_insertNewUserAsToko, m_getAllUser, m_insertNewUserAsEmpleyee } = require("../models/MasterUserModels")

const s_getMenuByUserId = async(params)=>{
    try {
        
        const {error,result} = await m_getUserById(params);

        let data_menu = await getMenu({access_menu:result[0].access_menu});

        data_menu = data_menu.result;

        if(result[0].access_menu === null){
            data_menu = [];
            result[0].menu = [];
        }

        if (data_menu && data_menu.length > 0) {
            for (let i of data_menu) {
                let data_access_submenu = {
                    access_submenu: result[0].access_submenu,
                    level: i.level,
                };

                let data_submenu = await getSubMenu(data_access_submenu);
                data_submenu = data_submenu.result;
              
                if (data_submenu && data_submenu.length > 0) {
                    i.submenu = data_submenu;
                }
            }
            result[0].menu = data_menu;
        }

        let all_menu = await getAllMenu();
        console.log(JSON.stringify(all_menu))
       
        for(let i of result[0].menu){
            let menuidx = all_menu.result.findIndex((a)=> a.id === i.id);
          
            console.log(menuidx)
            if(menuidx !== -1){
                all_menu.result[menuidx].grant = true
            }

            if(all_menu.result[menuidx].submenu){
                for(let j of i.submenu){
                    let submenuidx = all_menu.result[menuidx].submenu.findIndex((b)=> b.id === j.id);
                   
                    if(submenuidx !== -1){
                        all_menu.result[menuidx].submenu[submenuidx].grant = true
                    }
                }
            }
            console.log(`aa`)
        }

        // if(!result[0].access_menu) all_menu.result = [];
        console.log('langsung k sini yaaaaaaaaaaaaa')
        
        return {
            error: false,
            result: all_menu.result,
        };
        

        
    } catch (error) {
        return {
            error: error.message,
            result: false
        };
    }
}

const s_updateMenuByUserId = async(params) => {
    try {
        const {id} = params.params;

        if(!id) throw new Error("ID User tidak ditemukan");

        params.body.id = id;
        
        const {error,result} = await m_updateMenuByUserId(params.body);

        if(result > 0){
            return {
                error:false,
                result:[
                    {
                        success:true
                    }
                ]
            }
        }

    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
    

}

const s_getPermissionByUserId = async(params) =>{
    try {
        const {error,result} = await m_getUserById(params);

        let data_permission = await m_getMenuPermissionById({id:result[0].menu_permission});
        data_permission = data_permission.result;

        let all_permission = await m_getMenuPermission();

        all_permission = all_permission.result;
        for(let i of data_permission){
            if(data_permission.length > 0){
                let idx = all_permission.findIndex((a)=> a.id === i.id);
                if(idx !== -1){
                    all_permission[idx].grant = true
                }
            }
        }
        
        return {
            error:false,
            result:all_permission
        }

    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}

const s_updatePermissionByUserId = async(params) => {
    try {
        const {id} = params.params;

        if(!id) throw new Error("ID User tidak ditemukan");

        params.body.id = id;
        
        const {error,result} = await m_updatePermissionByUserId(params.body);

        if(result > 0){
            return {
                error:false,
                result:[
                    {
                        success:true
                    }
                ]
            }
        }

    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
    

}

const s_getTokoBersama = async(params) =>{
    try {

        const {tipe_toko} = params;
        if(!tipe_toko) throw new Error("Tolong pilih tipe toko terlebih dahulu");

        let data;

        if(tipe_toko === 'Toko'){
            data = await m_getGatewayCustomer(params);
        }else{
            data = await m_getGPWholesaler(params);
        }
        console.log(data)
        if(data.error) throw new Error(data.error);
        
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
}

const s_insertNewUserAsToko = async(params) => {
    try {
        const {no_hp_toko} = params;
        if(!no_hp_toko) throw new Error("Nomer kontak harus diisi");
        params.keyword = no_hp_toko;
        let data = await m_getPosWholesaler(params);
        if(data.result.length == 0 && !data.error) {
            data = await m_insertNewUserAsToko(params);
        }

        if(data.error) throw new Error(data.error);
        
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
}

const s_insertNewUserAsEmployee = async(params) => {
    try {
        const {phone} = params;
        if(!phone) throw new Error("Nomer kontak harus diisi");
        params.keyword = phone;
        let data = await m_getAllUser(params);
        if(data.result.length == 0) {
            data = await m_insertNewUserAsEmpleyee(params);
        }else{
            throw new Error("Maaf anggota dengan nomer kontak tersebut sudah terdaftar");
        }

        if(data.error) throw new Error(data.error);
        
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
}

const s_getPosWholesaler = async(params) => {
    try {
        return await m_getPosWholesaler(params);
    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}

module.exports = {
    s_getMenuByUserId,
    s_updateMenuByUserId,
    s_getPermissionByUserId,
    s_updatePermissionByUserId,
    s_getTokoBersama,
    s_insertNewUserAsToko,
    s_insertNewUserAsEmployee,
    s_getPosWholesaler
}