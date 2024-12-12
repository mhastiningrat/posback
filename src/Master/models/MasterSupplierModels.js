const { sqlCon } = require("../../../config/db_config");

const m_getSupllier = async(params) => {
    try {

        const {code,keyword} = params;

        let selectQuery = `SELECT * FROM grosir_pintar.pos_supplier WHERE id <> 0 `

        if(keyword) selectQuery += ` AND name ILIKE '%${keyword}%' OR phone ILIKE '%${keyword}%' `;
        if(code) selectQuery += ` AND code='${code}'`

        console.log(selectQuery)
        let data_supplier = await sqlCon(selectQuery);
        if(data_supplier == 'Mohon maaf ada kendala sistem') throw new Error("Mohon maaf ada kendala sistem");

        return {
            error:false,
            result: data_supplier
        }
        
    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}

const m_updateSupplierById = async(params) =>{
    try {
        const {code,address,is_active,name,phone} = params;

        let updateQuery = `UPDATE grosir_pintar.pos_supplier SET name='${name}',address='${address}',phone='${phone}',is_active=${is_active} WHERE code='${code}'`

        let data_update = await sqlCon(updateQuery);
    
        return {
            error: false,
            result: data_update,
        };
    } catch (error) {
        return {
            error: error.message,
            result: false,
        };
    }
}

module.exports = {
    m_getSupllier,
    m_updateSupplierById
}