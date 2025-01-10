const response = {
    success: (res,message)=>{
        return res.json({
            status:'OK',
            code:200,
            data:message
        })
    },
    error:(res,message)=>{
        console.log(message)
        return res.json({
            status:'Err',
            code:400,
            message:message.message || message
        })
    },
    errorSystem:(res,message)=>{
        console.log(message)
        return res.json({
            status:'Err',
            code:500,
            message:message.message || message
        })
    }
    ,
    unAuthorizedPermission:(res)=>{
        
        return res.json({
            status:'Unauthorized',
            code:401,
            message:"Anda tidak memiliki hak akses untuk melakukan aksi ini"
        })
    },
     unAuthorizedMenu:(res)=>{
  
        return res.json({
            status:'Unauthorized',
            code:401,
            message:"Anda tidak memiliki hak akses untuk menu ini. Silahkan menghubungi admin BERSAMA untuk akses tersebut"
        })
    },
    unAuthorized:(res,message)=>{
        console.log(message)
        return res.json({
            status:'Unauthorized',
            code:401,
            message:"Sesi anda telah habis, mohon lagin kembali"
        })
    }

}

module.exports = {
    response
}