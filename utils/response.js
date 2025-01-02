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
        console.log(message)
        return res.json({
            status:'Unauthorized',
            code:401,
            message:"Anda tidak memiliki hak akses untuk melakukan aksi ini"
        })
    },
     unAuthorizedMenu:(res,message)=>{
        console.log(message)
        return res.json({
            status:'Unauthorized',
            code:401,
            message:"Anda tidak memiliki hak akses untuk menu ini"
        })
    }
}

module.exports = {
    response
}