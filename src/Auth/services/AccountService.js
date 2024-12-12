const { m_updatePhotoProfile } = require("../models/AccountModels");

const s_updatePhotoProfile = async(params) =>{
    try {
        const {id,path} = params
        if(!id) throw new Error("User tidak ditemukan");
        if(!path) throw new Error("Path file tidak ditemukan");
        // console.log(params)
        const {error,result} = await m_updatePhotoProfile(params);
        
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
           
        return {
            error:error,
            result:false
        }
    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}

module.exports = {
    s_updatePhotoProfile
}