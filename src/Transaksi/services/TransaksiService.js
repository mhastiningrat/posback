const { m_postTransaksiJual, m_getAllCustomer, m_getGrosirPintarCustomer, m_getAllDelivery } = require("../models/TransaksiModels")

const s_postTransaksiJual = async(params) =>{
    try {
        return await m_postTransaksiJual(params)
    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}

const s_getAllDelivery = async(params) =>{
    try {

         const data_delivery = await m_getAllDelivery(params);

         let result = {
            additional:{},
            delivery : {
                price : '0',
                temp_price : '0',
                delivery_discount : '0',
                show_action : true,
                selected_action : null,
                action : []
            }
        }

        let wholesaler_data = data_delivery.result;
        console.log(wholesaler_data);

        if (wholesaler_data.length > 0) {
            result.additional.accept_half = wholesaler_data[0].accept_half;
            if (wholesaler_data[0].notification_msg != null) {
                if (wholesaler_data[0].notification_msg.length > 0) {
                result.message = wholesaler_data[0].notification_msg;
                }
            }
            let object_retrieval;
            if (wholesaler_data[0].retrieval_method.includes('1')) {
                object_retrieval = {
                key : true,
                tag : '1',
                text : 'Kirim Ke Toko',
                is_selected : true
                };
                result.delivery.price = wholesaler_data[0].delivery_price;
                result.delivery.temp_price = wholesaler_data[0].delivery_price;
                result.delivery.delivery_discount = wholesaler_data[0].delivery_discount;
                result.delivery.selected_action = object_retrieval;
                result.delivery.action.push(object_retrieval);
            }
            if (wholesaler_data[0].retrieval_method.includes('2')) {
                object_retrieval = {
                key : false,
                tag : '2',
                text : 'Ambil Di Grosir',
                is_selected : false
                }
                if (result.delivery.action.length === 0) {
                object_retrieval.is_selected = true;
                result.delivery.selected_action = object_retrieval;
                }
                result.delivery.action.push(object_retrieval);
            }
            if (wholesaler_data[0].retrieval_method.includes('3')) {
                object_retrieval = {
                key : false,
                tag : '3',
                text : 'Topping Up Salesman',
                is_selected : false
                }
                if (result.delivery.action.length === 0) {
                object_retrieval.is_selected = true;
                result.delivery.selected_action = object_retrieval;
                }
                result.delivery.action.push(object_retrieval);
            }
        } else {
            throw new Error('Tidak ada data yang ditemukan!');
        }

        return {
            error:false,
            result
        }

    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}

const s_getAllCustomer = async(params) => {
    try {

        const {wholesaler_id, customer} = params;

        if(!wholesaler_id) throw new Error("Grosir tidak ditemukan");

        const {error,result} = await m_getAllCustomer(params);
        
        if(!result || result.length == 0) throw new Error("Customer tidak ditemukan");

        let cust_no = '';
        let cust_gateway = result;

        for(let i of cust_gateway){
            if(cust_no.length > 0){
                cust_no += ','
            }
            cust_no += `'${i.cust_no}'`
        }

        const data_cust_gp = await m_getGrosirPintarCustomer({cust_no:cust_no})

        let result_cust = [];
        
        if(!data_cust_gp || data_cust_gp.result.length == 0){
            result_cust = cust_gateway
         
        }
        else{
            let cust_gp = data_cust_gp.result;
        
            for(let i of cust_gp){
                let cust = cust_gateway.filter(j => j.cust_no == i.retail_id);
                result_cust.push(cust[0]);
            }
        }

        return {
            error: false,
            result: result_cust
        }

    } catch (error) {
        return {
            error: error.message,
            result: false
        }
    }
}

module.exports = {
    s_getAllCustomer,
    s_postTransaksiJual,
    s_getAllDelivery
}