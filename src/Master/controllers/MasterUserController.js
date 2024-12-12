const { response } = require("../../../utils/response");
const {  m_getAllUser, m_getUserById, m_getMenuById } = require("../models/MasterUserModels");
const { s_getMenuByUserId, s_updateMenuByUserId } = require("../services/MasterUserService");

const c_getAllUser = async(req,res)=>{
    try {
        const {error,result} = await m_getAllUser();
        
        if(error){
            return response.error(res,error);
        }

        response.success(res,result);
    } catch (error) {
        return response.errorSystem(res,error);
    }
}

const c_getUserById = async(req,res)=>{
    try {
        const {error,result} = await m_getUserById(req.params);
        
        if(error){
            return response.error(res,error);
        }

        response.success(res,result);
    } catch (error) {
        return response.errorSystem(res,error);
    }
}

const c_getMenuById = async(req,res)=>{
    try {
        const {error,result} = await m_getMenuById(req.params);

        if(error){
            return response.error(res,error);
        }

        response.success(res,result);
    } catch (error) {
        return response.errorSystem(res,error);
    }
}

const c_getMenuByUserId = async(req,res)=>{
    try {
        const {error,result} = await s_getMenuByUserId(req.params);

        if(error){
            return response.error(res,error);
        }

        response.success(res,result);
    } catch (error) {
        return response.errorSystem(res,error);
    }
}

const c_updateMenuByUserId = async(req,res)=>{
    try {
        const {error,result} = await s_updateMenuByUserId(req);

        if(error){
            return response.error(res,error);
        }

        response.success(res,result);
    } catch (error) {
        return response.errorSystem(res,error);
    }
}

module.exports = {
    c_getAllUser,
    c_getUserById,
    c_getMenuById,
    c_getMenuByUserId,
    c_updateMenuByUserId
}