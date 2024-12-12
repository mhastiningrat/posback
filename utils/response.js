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
}

module.exports = {
    response
}