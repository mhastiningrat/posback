const { sqlCon } = require("../../../config/db_config");

const m_getLaporanPenjualan = async (params) => {
    try {
        const {wholesaler_id,keyword,start_date,end_date} = params

        let selectQuery = `SELECT JSON_BUILD_OBJECT(
            'transaksi', JSON_AGG(
                JSON_BUILD_OBJECT(
                    'order_date', toh.order_date,
                    'order_no', toh.order_no,
                    'tipe', CASE 
                                WHEN toh.status = 7 THEN 'return'
                                WHEN toh.status = 3 THEN 'penjualan'
                                ELSE 'lainnya'
                            END,
                    'amount', CAST(toh.amount AS INT),
                    'total_items', toh.total_items
                ) ORDER BY toh.order_date
            ),
            'total_penjualan', SUM(CASE WHEN toh.status = 3 THEN CAST(toh.amount AS INT) ELSE 0 END),
            'total_return', SUM(CASE WHEN toh.status = 7 THEN CAST(toh.amount AS INT) ELSE 0 END),
            'net_total', SUM(CASE WHEN toh.status = 3 THEN CAST(toh.amount AS INT) ELSE 0 END) 
                        - SUM(CASE WHEN toh.status = 7 THEN CAST(toh.amount AS INT) ELSE 0 END)
        ) AS result FROM grosir_pintar.t_order_h toh 
        WHERE toh.wholesaler_id='${wholesaler_id}' AND app_platform='POS' `;

        if(keyword) selectQuery += ` AND (toh.order_no ILIKE '%${keyword}%' OR toh.retail_id ILIKE '%${keyword}%')`;
        if(start_date) selectQuery += ` AND toh.order_date >= '${start_date}' AND toh.order_date <= '${end_date}'`;
        // selectQuery += ` GROUP BY toh.order_no, toh.order_date, toh.status, toh.amount, toh.total_items`

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

const m_getLaporanPenjualanFromLogs = async (params) => {
    try {
        const {wholesaler_id,keyword,start_date,end_date} = params

        let selectQuery = `SELECT JSON_BUILD_OBJECT(
            'transaksi', JSON_AGG(
                                    JSON_BUILD_OBJECT(
                                        'order_date', transaction_date,
                                        'order_no', order_no,
                                        'tipe', type,
                                        'amount', CASE 
                                            WHEN type = 'return' THEN CAST(total_return AS INT)
                                            ELSE CAST(total_transaction AS INT)
                                        END,
                                        'kasir', transaction_by,
                                        'customer',customer
                                    ) ORDER BY transaction_date
                                ),
            'total_penjualan', SUM(CAST(total_transaction AS INT)),
            'total_return', SUM(CAST(total_return AS INT)),
            'net_total', SUM(CAST(total_transaction AS INT)) - SUM(CAST(total_return AS INT)),
            'total_modal', SUM(CASE 
                                WHEN type = 'penjualan' THEN CAST(total_equity AS INT)
                                WHEN type = 'return' THEN -CAST(total_equity AS INT)
                                ELSE 0
                              END),
            'keuntungan',(SUM(CAST(total_transaction AS INT)) - SUM(CAST(total_return AS INT))) - (SUM(CASE 
                                WHEN type = 'penjualan' THEN CAST(total_equity AS INT)
                                WHEN type = 'return' THEN -CAST(total_equity AS INT)
                                ELSE 0
                              END))
        ) AS result FROM grosir_pintar.pos_transaction_logs
        WHERE wholesaler_id='${wholesaler_id}' `;

        if(keyword) selectQuery += ` AND (toh.order_no ILIKE '%${keyword}%' OR toh.retail_id ILIKE '%${keyword}%')`;
        if(start_date) selectQuery += ` AND toh.order_date >= '${start_date}' AND toh.order_date <= '${end_date}'`;
        // selectQuery += ` GROUP BY toh.order_no, toh.order_date, toh.status, toh.amount, toh.total_items`

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

const m_getDetailLaporanTransaksi = async (params) => {
    try {
        const {order_no} = params; 

        let selectQuery = `SELECT jsonb_build_object(
            'detail',jsonb_agg(jsonb_build_object(
            'order_no',tod.order_no, 
            'pcode',tod.pcode, 
            'pcode_name', p.pcode_name,
            'is_return',tod.is_return, 
            'qty_sales_order',tod.qty_sales_order, 
            'price',pr.price,
            'basic_price',pr.basic_price     
            )
        ),
        'total_penjualan',SUM(tod.qty_sales_order * pr.price) ,
        'total_modal',SUM(tod.qty_sales_order * pr.basic_price) ,
        'keuntungan',SUM(tod.qty_sales_order * pr.price) - SUM(tod.qty_sales_order * pr.basic_price)
        ) as detail
        FROM grosir_pintar.t_order_d tod   
        LEFT JOIN grosir_pintar.price pr ON tod.wholesaler_id = pr.wholesaler_id AND tod.pcode = pr.pcode and tod.amount_sales_order = pr.price 
        LEFT JOIN grosir_pintar.product p ON tod.wholesaler_id = p.wholesaler_id AND tod.pcode = p.pcode
        WHERE tod.order_no = '${order_no}' AND tod.is_return is not true
        `;

        // console.log(selectQuery)
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
    m_getLaporanPenjualan,
    m_getDetailLaporanTransaksi,
    m_getLaporanPenjualanFromLogs
}