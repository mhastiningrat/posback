const { m_addPosCustomer } = require("../../Master/models/MasterCustomerModels");
const { m_postTransaksiJual, m_getAllCustomer, m_getGrosirPintarCustomer, m_getAllDelivery } = require("../models/TransaksiModels")

const s_postTransaksiJual = async(params) =>{
    
    try {

        const {wholesaler_id,detail_order,total_belanja,data_customer} = params;

        if(!wholesaler_id) throw new Error("Grosir tidak ditemukan");
        if(detail_order.length == 0) throw new Error("Tolong lakukan pemesanan terlebih dahulu");

        if(!data_customer.hasOwnProperty('cust_no')) params.customer = 'Walk In Customer';
        else params.customer = data_customer.cust_no;

        const data_user = await m_getAllCustomer(params);
        console.log(data_user)

        if(data_user.result.length == 0) {
            params.cust_name = 'Walk In Customer';
            const data_pos_customer = await m_addPosCustomer(params);
            if(data_pos_customer.result.cust_no){
                params.data_customer.cust_no = data_pos_customer.result.cust_no;
                params.data_customer.cust_name = data_pos_customer.result.cust_name;
            }
        }else if(!data_user.result[0].cust_no.includes('PC')){
            console.log('iya g ada PC nya')
            params.cust_name = data_user.result[0].cust_name;
            params.cust_no_hp = data_user.result[0].cust_no_hp;
            params.cust_address = data_user.result[0].cust_address;
            params.reff_code = data_user.result[0].cust_no;

            const data_pos_customer = await m_addPosCustomer(params);
            if(data_pos_customer.result.cust_no){
                params.data_customer.cust_no = data_pos_customer.result.cust_no;
                params.data_customer.cust_name = data_pos_customer.result.cust_name;
            }
        }

        // return;
        let total_modal = 0;
        let total_profit = 0;

        for(let a of detail_order){

            let newQty = a.qty
            let itunganHarga = 0;

            if(a.calculation_type == 2){
                for (let i of a.price_details) {
                    if (a.qty >= i.min_qty) {
                      itunganHarga = a.qty * i.basic_price;
                    }
                  }
                  total_modal += Number(itunganHarga);
            }else{
                function calculateEquity(pricetag,nqty){
                
                    let getQty = Math.floor(nqty / pricetag.min_qty)
                    if(getQty !== 0){
                        console.log("newQty === "+ nqty)
                        console.log("getQty === "+getQty)
                        console.log("modal nih === "+total_modal)
                        console.log("pricetag.min_qty === "+pricetag.min_qty)
                        itunganHarga = (getQty * pricetag.min_qty) * pricetag.basic_price
                        console.log(itunganHarga)
                        console.log( 0 + Number(itunganHarga))
                        console.log(typeof total_modal)
                        console.log(typeof itunganHarga)
                        total_modal += Number(itunganHarga)
                        newQty -= getQty * pricetag.min_qty
                        console.log("Formula itunganHarga === "+ getQty * pricetag.min_qty + " x  " + pricetag.basic_price)
                        console.log("itunganHarga === "+ itunganHarga)
                    }
                
                }
    
                let index = a.price_details.findIndex(i => i.min_qty == 1);
                if(index == -1) a.price_details.push({min_qty:1,price:a.price_details[0].price,basic_price:a.price_details[0].basic_price});
                
                for(let i = a.price_details.length - 1; i >= 0; i--){
                
                    if(newQty >= a.price_details[i].min_qty){
                        calculateEquity(a.price_details[i],newQty)
                    }
                }
            }
        }

        console.log("total_modal === "+ total_modal)
        total_profit = total_belanja - total_modal

        params.total_modal = total_modal;
        params.total_profit = total_profit;

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