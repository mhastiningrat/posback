const { m_getPosCustomer } = require("../../Master/models/MasterCustomerModels");
const { m_getAllTransaksiHistory, m_getTransaksiHistoryById } = require("../models/TransaksiHistoryModels");
const { m_getAllCustomer } = require("../models/TransaksiModels");

const s_getAllTransaksiHistory = async(params) => {
    try {  
        
        const {wholesaler_id,keyword} = params

        if(!wholesaler_id) throw new Error("Grosir tidak ditemukan");

        return await m_getAllTransaksiHistory(params);    
    } catch (error) {    
        return {    
            error:error.message,    
            result:false    
        }    
    }
}

const s_getAllTransaksiHistoryById = async(params) => {
    try {
        
        const {order_no} = params

        if(!order_no) throw new Error("Order tidak ditemukan");

        const {error,result} =  await m_getTransaksiHistoryById(params);    
        console.log(result[0].result)

        if(result[0].result){
            console.log('first')
            let data = result[0].result;
            console.log(data)
            let params  = {};
            params.customer = data.detail_order[0].retail_id;

            const data_customer = await m_getAllCustomer(params);

            if(data_customer.result.length > 0){
                data.data_customer = data_customer.result[0];
            }

            return {error:false,result:data};
        }

        return {error:false,result:result[0].result};
    } catch (error) {    
        return {    
            error:error.message,    
            result:false    
        }    
    }
}

module.exports = {s_getAllTransaksiHistory,s_getAllTransaksiHistoryById}