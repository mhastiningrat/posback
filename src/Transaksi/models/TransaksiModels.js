const { sqlCon, sqlConGateway } = require("../../../config/db_config");

const getAllCustomer = async(params) => {
    try {
        const {wholesaler_id, customer} = params;

        if(!wholesaler_id) throw new Error("Grosir tidak ditemukan");

        let customerGatewayQuery = `SELECT cust_no,cust_name,cust_no_hp,cust_address FROM gateway.customer WHERE cust_no ILIKE '%${customer}%' OR LOWER(cust_name) LIKE LOWER('%${customer}%') OR cust_no_hp = '${customer}'`
        customerGatewayQuery += ' UNION '
        customerGatewayQuery += ` SELECT cust_no,cust_name,cust_no_hp,cust_address FROM gateway.pos_customer WHERE cust_no ILIKE '%${customer}%' OR LOWER(cust_name) LIKE LOWER('%${customer}%') OR cust_no_hp = '${customer}'`
        console.log(customerGatewayQuery)
        let data_cust_gateway = await sqlConGateway(customerGatewayQuery);

        if(!data_cust_gateway || data_cust_gateway.length == 0) throw new Error("Customer tidak ditemukan");
        console.log(data_cust_gateway)
        let cust_no = '';
        let cust_gateway = data_cust_gateway;

        for(let i of cust_gateway){
            if(cust_no.length > 0){
                cust_no += ','
            }
            cust_no += `'${i.cust_no}'`
        }

        let customerGPQuery = `SELECT * FROM grosir_pintar.m_wholesaler_retail WHERE retail_id IN (${cust_no})`;
        console.log(customerGPQuery)
        let data_cust_gp = await sqlCon(customerGPQuery);
        let result_cust = [];
        console.log(data_cust_gp)
        if(!data_cust_gp || data_cust_gp.length == 0){result_cust = cust_gateway}
        else{
            let cust_gp = data_cust_gp;
        
        
            for(let i of cust_gp){
                let cust = cust_gateway.filter(j => j.cust_no == i.retail_id);
                result_cust.push(cust[0]);
            }
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

const getAllDelivery = async(params) =>{
    try {
        const {subprice,wholesaler_id} = params;

        if(subprice == 0) throw new Error("Total harga barang tidak boleh 0");
        if(!wholesaler_id) throw new Error("Grosir tidak ditemukan");

        let wholesalerQuery = `SELECT a.notification_msg, a.sub_district, a.delivery_discount, 
                               a.limit_credit, COALESCE(a.retrieval_method,'') AS retrieval_method,
                               COALESCE(b.delivery_price, a.delivery_price) AS "delivery_price", a.accept_half
                               FROM grosir_pintar.wholesaler a
                               LEFT JOIN grosir_pintar.mapp_delivery_payment b ON a.wholesaler_id=b.wholesaler_id
                               AND ${subprice} BETWEEN b.min_purchase AND b.max_purchase
                               AND b.app_platform='tokopintar'
                               WHERE a.wholesaler_id='${wholesaler_id}' LIMIT 1`
                               

        let data_wholesaler = await sqlCon(wholesalerQuery);

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

        let wholesaler_data = data_wholesaler;
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
            result:{}
        }
    }
}

const m_postTransaksiJual = async(params) => {
    try {
        return {
            error:false,
            result:params
        }
    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}

module.exports = {
    getAllCustomer,
    getAllDelivery,
    m_postTransaksiJual
}