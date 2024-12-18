const { sqlCon } = require("../config/db_config");

const collectPcode = (product) => {
    let pcode = '';

    if(product.length > 0){
        for(let i in product){
            if(pcode.length > 0) pcode+=','
            pcode+= `'${product[i].pcode}'`
        }

        return pcode;
    }else{
        return false;
    }
}

const getSequence = async(function_id)=>{
    let format, query = ``;
    try {
      query = `SELECT grosir_pintar.` + function_id + ` AS format`;
      let data = await sqlCon(query);
      format = data[0].format;
    } catch (e) {
      format = null;
    }
    return format;
}

module.exports = {
    collectPcode,
    getSequence
}