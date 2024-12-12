const { sqlCon } = require("../../../config/db_config");

const m_updatePhotoProfile = async(params)=>{
    try {
        const {id,path} = params;

        let updateQuery = `UPDATE grosir_pintar.pos_auth SET profile_image='${path}' WHERE id=${id}`;

        let data_update = await sqlCon(updateQuery);
        if(data_update == 'Mohon maaf ada masalah sistem') throw new Error("Mohon maaf ada masalah sistem");
        return {
            error: false,
            result: data_update,
        };
    } catch (error) {
        // console.log(error.message)
        return {
            error: error.message,
            result: false,
        };
    }
}

module.exports ={
    m_updatePhotoProfile
}