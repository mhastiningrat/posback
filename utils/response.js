const response = {
    success: (res,message)=>{
        return res.json({
            status:'OK',
            code:200,
            data:message
        })
    },
    error:(res,message)=>{
        return res.json({
            status:'Err',
            code:400,
            message:message
        })
    },
    errorSystem:(res,message)=>{
        return res.json({
            status:'Err',
            code:500,
            message:message
        })
    }
}

module.exports = {
    response
}