const { sqlCon } = require("../../../config/db_config");

const m_getAllTransaksiHistory = async(params) => {
    try {
        const {wholesaler_id,keyword} = params

        let selectQuery = `SELECT * FROM grosir_pintar.t_order_h WHERE wholesaler_id='${wholesaler_id}' AND app_platform='POS' `;

        if(keyword) selectQuery += ` AND (order_no ILIKE '%${keyword}%' OR retail_id ILIKE '%${keyword}%')`;
        selectQuery += ` ORDER BY order_timestamp DESC`
        console.log(selectQuery)
        let data = await sqlCon(selectQuery);

        return {
            error: false,
            result: data,
        };
    } catch (error) {
        return {
            error: error.message,
            result: false
        }
    }
}

const m_getTransaksiHistoryById = async(params) => {
    try {
        const {order_no} = params;

        let selectQuery = `
        SELECT json_build_object(
            'detail_order', json_agg(json_build_object(
                'order_no', tod.order_no,
                'retail_id', tod.retail_id,
                'total_basic_price', (tod.amount_sales_order * tod.qty_sales_order),
                'qty', tod.qty_sales_order,
                'price', tod.amount_sales_order,
                'pcode_name', mp.pcode_name,
                'is_return',tod.is_return,
                'pcode', mp.pcode,
                'img',mp.imgbig_url
            )),
            'total', SUM(tod.amount_sales_order * tod.qty_sales_order)
        ) AS result
        FROM grosir_pintar.t_order_d tod
        LEFT JOIN grosir_pintar.product mp ON tod.pcode = mp.pcode AND tod.wholesaler_id = mp.wholesaler_id
        WHERE tod.order_no = '${order_no}'
        `
        let data = await sqlCon(selectQuery);

        return {    
            error: false,    
            result: data,      
        };
    } catch (error) {
        return {
            error: error.message,
            result: false
        }
    }
}

module.exports = {
    m_getAllTransaksiHistory,
    m_getTransaksiHistoryById
}