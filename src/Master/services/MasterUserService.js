const { getMenu, getSubMenu, getAllMenu } = require("../../Auth/models/AuthModels");
const { m_getUserById, m_updateMenuByUserId } = require("../models/MasterUserModels")

const s_getMenuByUserId = async(params)=>{
    try {
        
        const {error,result} = await m_getUserById(params);

        let data_menu = await getMenu({access_menu:result[0].access_menu});

        data_menu = data_menu.result;
       
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
          
            if(menuidx !== -1){
                all_menu.result[menuidx].grant = true
            }else{
                all_menu.result[menuidx].grant = false
            }

            if(all_menu.result[menuidx].submenu){
                for(let j of i.submenu){
                    let submenuidx = all_menu.result[menuidx].submenu.findIndex((b)=> b.id === j.id);
                   
                    if(submenuidx !== -1){
                        all_menu.result[menuidx].submenu[submenuidx].grant = true
                    }
                }
            }
        }
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

module.exports = {
    s_getMenuByUserId,
    s_updateMenuByUserId
}