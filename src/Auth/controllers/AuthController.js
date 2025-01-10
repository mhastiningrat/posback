const bcrypt = require("bcrypt");
const moment = require("moment");
const { sqlCon } = require("../../../config/db_config");
const { getAuth, getAllMenu } = require("../models/AuthModels");
const { response } = require("../../../utils/response");
const { s_getMenuPermissionById } = require("../services/AuthService");
const saltRounds = 9

const register = async(req,res) =>{
    try {
        const {username,password,no_hp,roles} = req.body

        console.log(username)
        console.log(password)
        console.log(no_hp)
        console.log(roles)

        const salt = await bcrypt.genSaltSync(saltRounds);
        const hashPassword = await bcrypt.hashSync(password,salt);

        let query = `INSERT INTO grosir_pintar.pos_auth
                    (wholesaler_no_hp, username, "password", session_token, last_login, role_id)
                    VALUES('${no_hp}', '${username}', '${hashPassword}', '', NOW(), ${roles})`;

        await sqlCon(query);

        response.success(res, {
            "No.HP": no_hp,
            "Password": password
        });
        
    } catch (error) {
        console.log('--- ERR REGISTER ---')
        console.log(error)
        res.json({status:'ERR', message:{}})
    }
}

const login = async(req,res)=>{
    try {
        console.log("ada yang masuk")
        let body = req.body;

        let password = body.password;
        let no_hp = body.no_hp;
        let role = body.roles;

        let payload = {
            password,
            no_hp,
            role
        }

        const {error,result} = await getAuth(payload);
        
        if(error){
            return response.error(res,error);
        }

        response.success(res,result);
        
    } catch (error) {
        return response.errorSystem(res,error);
    }
}

const allMenu = async(req,res)=>{
    try {
        const {error,result} = await getAllMenu();
        
        if(error){
            return response.error(res,error);
        }

        response.success(res,result);
    } catch (error) {
        return response.errorSystem(res,error);
    }
}

const c_getMenuPermissionById = async(req,res)=>{
    console.log("mrene ta")
    try {
        const {error,result} = await s_getMenuPermissionById(req.query);

        if(error){
            return response.error(res,error);
        }

        response.success(res,result);
    } catch (error) {
        return response.errorSystem(res,error);
    }
}

module.exports={
    register,
    login,
    allMenu,
    c_getMenuPermissionById
}