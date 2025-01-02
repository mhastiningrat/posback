const { response } = require("../../../utils/response");
const {  m_getAllUser, m_getUserById, m_getMenuById } = require("../models/MasterUserModels");
const { s_getMenuByUserId, s_updateMenuByUserId, s_getPermissionByUserId, s_updatePermissionByUserId, s_getTokoBersama, s_insertNewUserAsToko, s_getPosWholesaler, s_insertNewUserAsEmployee } = require("../services/MasterUserService");

const c_getAllUser = async(req,res)=>{
    try {
        const {error,result} = await m_getAllUser(req.query);
        
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

const c_getPermissionByUserId = async(req,res)=>{
    try {
        const {error,result} = await s_getPermissionByUserId(req.params);
        if(error){
            return response.error(res,error);
        }

        response.success(res,result);
    } catch (error) {
        return response.errorSystem(res,error);
    }
}

const c_updatePermissionByUserId = async(req,res)=>{
    try {
        const {error,result} = await s_updatePermissionByUserId(req);

        if(error){
            return response.error(res,error);
        }

        response.success(res,result);
    } catch (error) {
        return response.errorSystem(res,error);
    }
}

const c_getTokoBersama = async(req,res)=>{
    try {
        const {error,result} = await s_getTokoBersama(req.query);
        if(error){
            return response.error(res,error);
        }

        response.success(res,result);
    } catch (error) {
        return response.errorSystem(res,error);
    }
}

const c_insertNewUserAsToko = async(req,res)=>{
    try {
        const {error,result} = await s_insertNewUserAsToko(req.body);
        if(error){
            return response.error(res,error);
        }

        response.success(res,result);
    } catch (error) {
        return response.errorSystem(res,error);
    }
}

const c_insertNewUserAsEmployee = async(req,res)=>{
    try {
        const {error,result} = await s_insertNewUserAsEmployee(req.body);
        if(error){
            return response.error(res,error);
        }

        response.success(res,result);
    } catch (error) {
        return response.errorSystem(res,error);
    }
}

const c_getPosWholesaler = async(req,res)=>{
    try {
        const {error,result} = await s_getPosWholesaler(req.query);

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
    c_updateMenuByUserId,
    c_getPermissionByUserId,
    c_updatePermissionByUserId,
    c_getTokoBersama,
    c_insertNewUserAsToko,
    c_getPosWholesaler,
    c_insertNewUserAsEmployee
}