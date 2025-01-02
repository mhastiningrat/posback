const jwt = require('jsonwebtoken');
const { m_getMenuPermissionById } = require('../src/Auth/models/AuthModels');
const { response } = require('../utils/response');


const verifyToken = (req,res,next) => {
    try {
       console.log(req.originalUrl);
       next()
    } catch (error) {
        
    }
}

const verifyPermission = async (req,res,next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user_permission = req.headers.user_permission;
        const decodedToken = jwt.decode(token);

        let data_menu_permission = await m_getMenuPermissionById({id:decodedToken.menu_permission})

        if(data_menu_permission.result.length > 0) {
            let data_permission = data_menu_permission.result.filter((x) => x.permission == user_permission)
            if(data_permission.length > 0) {
                next();
            }else{
                response.unAuthorizedPermission(res);
            }
        } else {
            response.unAuthorizedPermission(res);
        }
    } catch (error) {
        response.errorSystem(res,error);
    }
}

module.exports = {verifyToken,verifyPermission}