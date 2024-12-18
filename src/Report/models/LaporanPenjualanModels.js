const { sqlCon } = require("../../../config/db_config");

const m_getLaporanPenjualan = async (params) => {
    try {
        const {wholesaler_id,keyword,start_date,end_date} = params

        let selectQuery = `SELECT JSON_BUILD_OBJECT(
            'transaksi', JSON_AGG(
                JSON_BUILD_OBJECT(
                    'order_date', order_date,
                    'order_no', order_no,
                    'tipe', CASE 
                                WHEN status = 7 THEN 'return'
                                WHEN status = 3 THEN 'penjualan'
                                ELSE 'lainnya'
                            END,
                    'amount', CAST(amount AS INT),
                    'total_items', total_items
                ) ORDER BY order_date
            ),
            'total_penjualan', SUM(CASE WHEN status = 3 THEN CAST(amount AS INT) ELSE 0 END),
            'total_return', SUM(CASE WHEN status = 7 THEN CAST(amount AS INT) ELSE 0 END),
            'net_total', SUM(CASE WHEN status = 3 THEN CAST(amount AS INT) ELSE 0 END) 
                        - SUM(CASE WHEN status = 7 THEN CAST(amount AS INT) ELSE 0 END)
        ) AS result FROM grosir_pintar.t_order_h WHERE wholesaler_id='${wholesaler_id}' AND app_platform='POS' `;

        if(keyword) selectQuery += ` AND (order_no ILIKE '%${keyword}%' OR retail_id ILIKE '%${keyword}%')`;
        if(start_date) selectQuery += ` AND order_date >= '${start_date}' AND order_date <= '${end_date}'`;
        // selectQuery += ` ORDER BY order_timestamp DESC`
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

module.exports = {
    m_getLaporanPenjualan
}