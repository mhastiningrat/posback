const jwt = require('jsonwebtoken');
const { m_getMenuPermissionById, m_getAuthSession, getMenu, getSubMenu, getAllSubMenu } = require('../src/Auth/models/AuthModels');
const { response } = require('../utils/response');


const verifyToken = async(req,res,next) => {
    try {
       console.log(req.originalUrl);
  
       if(req.originalUrl.includes('auth') || req.headers.pathname.includes('auth') || req.headers.pathname.includes('print')) {
            return next();
       }
       let authorization = req.headers.authorization;
       if(!authorization) {
        return response.unAuthorized(res);
       }
       const token = req.headers.authorization.split(' ')[1];
       

       let verified = false;
       
       jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(err,decoded)=>{
        if(err){
            return response.unAuthorized(res);
        }
        verified = true
       });

       if(verified) {
        const data_user = await m_getAuthSession({session_token:token});
        console.log(data_user)
        if(data_user.result.length > 0) {
            next();
        }else{
            return response.unAuthorized(res);
        }
       }
   
       
    } catch (error) {
        response.errorSystem(res,error);
    }
}

const verifyMenuAccess = async (req,res,next) => {
    if(req.originalUrl.includes('auth') || req.headers.pathname.includes('auth') || req.headers.pathname.includes('print')) {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user_permission = req.headers.pathname;
        
        let verified = false;
        let access_menu = '';
        let access_submenu = '';
       
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(err,decoded)=>{
            if(err){
                return response.unAuthorized(res);
            }
            verified = true;
            access_menu = decoded.access_menu
            access_submenu = decoded.access_submenu
        });

        if(verified) {
            const data_menu = await getAllSubMenu({access_submenu:access_submenu,level:access_menu});
            console.log(data_menu)
            if(data_menu.result.length > 0) {
                let data_permission = data_menu.result.filter((x) => user_permission.includes(x.pathurl))
                if(data_permission.length > 0) {
                    next();
                }else{
                    response.unAuthorizedMenu(res);
                }
            } else {
                response.unAuthorizedMenu(res);
            }
        }

        // let data_menu_permission = await getMenu({access_menu:decodedToken.menu_permission})

        
    } catch (error) {
        response.errorSystem(res,error);
    }
}

module.exports = {verifyToken,verifyMenuAccess}