const { sqlCon, sqlConGateway } = require("../../../config/db_config");

const getAllCustomer = async(params) => {
    try {
        const {wholesaler_id, customer} = params;

        if(!wholesaler_id) throw new Error("Grosir tidak ditemukan");

        let customerGatewayQuery = `SELECT cust_no,cust_name,cust_no_hp,cust_address FROM gateway.customer WHERE cust_no LIKE '%${customer}%' OR cust_name LIKE '%${customer}%' OR cust_no_hp = '${customer}'`
        console.log(customerGatewayQuery)
        let data_cust_gateway = await sqlConGateway(customerGatewayQuery);

        if(!data_cust_gateway) throw new Error("Customer tidak ditemukan");

        let cust_no = '';
        let cust_gateway = data_cust_gateway.rows;

        for(let i of cust_gateway){
            if(cust_no.length > 0){
                cust_no += ','
            }
            cust_no += `'${i.cust_no}'`
        }

        let customerGPQuery = `SELECT * FROM grosir_pintar.m_wholesaler_retail WHERE retail_id IN (${cust_no})`;
        console.log(customerGatewayQuery)
        let data_cust_gp = await sqlCon(customerGPQuery);

        if(!data_cust_gp) throw new Error("Customer tidak ditemukan");

        let cust_gp = data_cust_gp.rows;
        
        let result_cust = [];
        for(let i of cust_gp){
            let cust = cust_gateway.filter(j => j.cust_no == i.retail_id);
            result_cust.push(cust[0]);
        }

        return {
            error:false,
            result: result_cust
        }
    
    } catch (error) {
        return {
            error:error.message,
            result: {}
        }
    }
}

module.exports = {
    getAllCustomer
}