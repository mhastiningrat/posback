const { m_getPosCustomer, m_addPosCustomer, m_updatePosCustomer } = require("../models/MasterCustomerModels")

const s_getPosCustomer = async(params) => {
    try {
        return await m_getPosCustomer(params);
    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}

const s_addPosCustomer = async(params) => {
   
    try {
        const {cust_name,cust_no_hp} = params;

        if(!cust_name || cust_name == '') throw new Error("Nama customer harus diisi");
        if(!cust_no_hp || cust_no_hp == '') throw new Error("No.HP customer harus diisi");

        let check_data_customer = await m_getPosCustomer({keyword: cust_no_hp});

        if(check_data_customer.result.length > 0){
            throw new Error("No.HP sudah terdaftar");
        }

        const {error,result} = await m_addPosCustomer(params);

        if(result > 0){
            return {
                error:false,
                result:{
                    success:true
                }
            }
        }

        return {
            error:error,
            result:false
        }

    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}

const s_updatePosCustomer = async(params) => {
   
    try {
        const {cust_no} = params.params
        const {cust_name,cust_no_hp} = params.body;

       

        if(!cust_no || cust_no == '') throw new Error("Customer tidak ditemukan");
        if(!cust_name || cust_name == '') throw new Error("Nama customer harus diisi");
        if(!cust_no_hp || cust_no_hp == '') throw new Error("No.HP customer harus diisi");

        let check_data_customer = await m_getPosCustomer({keyword: cust_no_hp});

        if(check_data_customer.result.length > 0){
            throw new Error("No.HP sudah terdaftar");
        }
        params.body.cust_no = cust_no;
        const {error,result} = await m_updatePosCustomer(params);

        if(result > 0){
            return {
                error:false,
                result:{
                    success:true
                }
            }
        }

        return {
            error:error,
            result:false
        }

    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}


module.exports = {
    s_getPosCustomer,
    s_addPosCustomer,
    s_updatePosCustomer
}