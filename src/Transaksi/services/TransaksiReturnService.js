const { m_postTransaksiReturn } = require("../models/TransaksiReturnModels")

const s_postTransaksiReturn = async(params) =>{
    try {

        const {wholesaler_id,detail_order_return} = params;
        // return;
        if(detail_order_return.length == 0) throw new Error("Tolong lakukan pemesanan terlebih dahulu");

        console.log(detail_order_return)
        // return;
        let total_modal_return = 0;

        for(let a of detail_order_return){
            total_modal_return += a.qty * a.basic_price
        }

        params.total_modal_return = total_modal_return;

        return await m_postTransaksiReturn(params)
    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}

module.exports = {
    s_postTransaksiReturn
}