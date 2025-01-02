const { m_getMenuPermissionById, m_getMenuPermission } = require("../models/AuthModels");

const s_getMenuPermissionById = async(params)=>{
    try {

        const {id} = params;

        let result = {}
        let data = await m_getMenuPermissionById(params);
        console.log(data);
        if(data.result.length > 0){
            result.permission = data.result;
            let data_all_permission = await m_getMenuPermission();
            console.log(data_all_permission)
            if(data_all_permission.result.length > 0){
                for(let i of data.result){
                    let index = data_all_permission.result.findIndex(x => x.id == i.id)

                    if(index !== -1){
                        data_all_permission.result[index].grant = true;
                    }
                }

                result.all_user_permission = data_all_permission.result;
            }
        }

        if(!id) {
            result.permission = []
        }

        return{
            error:false,
            result
        }
    } catch (error) {
        return{
            error:error.message,
            result:false
        }
    }
}

module.exports = {
    s_getMenuPermissionById
}