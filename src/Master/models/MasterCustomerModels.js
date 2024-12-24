const { sqlCon, sqlConGateway } = require("../../../config/db_config");

const m_getPosCustomer = async(params) => {
    try {
        const {cust_no,keyword} = params;
        
        let selectQuery = `SELECT * FROM  gateway.pos_customer WHERE is_deleted = '0' `
        if(keyword) selectQuery += ` AND cust_name ILIKE '%${keyword}%' OR cust_no_hp ILIKE '%${keyword}%' `
        if(cust_no) selectQuery += ` AND cust_no = '${cust_no}'`
        console.log(selectQuery)
        let data_customer = await sqlConGateway(selectQuery);

        return {
            error:false,
            result: data_customer
        }

    } catch (error) {
        return {
            error:error.message,
            result: false
        }
    }
}

const m_addPosCustomer = async(params) => {
    try {
        const {reff_code,wholesaler_id,cust_name,cust_no_hp,cust_address,type,cust_email} = params;
        console.log(params)
        let insertQuery = `INSERT INTO gateway.pos_customer (cust_name,cust_no_hp,cust_address,kode_referral) VALUES ('${cust_name}','${cust_no_hp?cust_no_hp:'-'}','${cust_address?cust_address:'-'}','${reff_code ? reff_code : '-'}') RETURNING *`;

        let data_customer = await sqlConGateway(insertQuery);

        return {
            error:false,
            result: data_customer
        }
    } catch (error) {
        return {
            error:error.message,
            result: false
        }
    }
}

const m_updatePosCustomer = async(params) => {
    try {
        const {reff_code,wholesaler_id,cust_name,cust_no_hp,cust_address,type,cust_email,cust_no} = params;

        let updateQuery = `UPDATE gateway.pos_customer SET cust_name='${cust_name}',cust_no_hp='${cust_no_hp}',cust_address='${cust_address}' WHERE cust_no='${cust_no}'`;

        let data_customer = await sqlConGateway(updateQuery);

        return {
            error:false,
            result: data_customer
        }
    } catch (error) {
        return {
            error:error.message,
            result: false
        }
    }
}

module.exports = {
    m_getPosCustomer,
    m_addPosCustomer,
    m_updatePosCustomer
}