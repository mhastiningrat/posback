const { response } = require("../../../utils/response");
const { getAllUser } = require("../models/MasterUserModels");

const allUser = async(req,res)=>{
    try {
        const {error,result} = await getAllUser();
        
        if(error){
            return response.error(res,error);
        }

        response.success(res,result);
    } catch (error) {
        return response.errorSystem(res,error);
    }
}


module.exports = {
    allUser
}