const { sqlCon } = require("../../../config/db_config");
const m_getLaporanStock = async(params) => {
    try {

        const {wholesaler_id,keyword} = params;

        let selectQuery = `SELECT 
            p.imgbig_url,
            p.pcode_name,
            psl.pcode,
            SUM(CASE WHEN psl.stock_type = 'IN' THEN COALESCE(psl.stock_qty::INTEGER, 0) ELSE 0 END) AS stock_in,
            SUM(CASE WHEN psl.stock_type = 'OUT' THEN COALESCE(psl.stock_qty::INTEGER, 0) ELSE 0 END) AS stock_out,
            SUM(CASE WHEN psl.stock_type = 'IN' THEN COALESCE(psl.stock_qty::INTEGER, 0) ELSE 0 END) - 
            SUM(CASE WHEN psl.stock_type = 'OUT' THEN COALESCE(psl.stock_qty::INTEGER, 0) ELSE 0 END) AS stock
        FROM 
            grosir_pintar.pos_stock_logs psl LEFT JOIN grosir_pintar.product p ON p.pcode = psl.pcode AND p.wholesaler_id = psl.wholesaler_id 
        WHERE 
            psl.wholesaler_id = '${wholesaler_id}' `;
        if(keyword) selectQuery += ` AND psl.pcode = '${keyword}' OR p.pcode_name ILIKE '%${keyword}%' `;
        selectQuery += ` GROUP BY 
            psl.pcode, psl.wholesaler_id, p.pcode_name, p.imgbig_url
        ORDER BY 
            stock ASC;`
        
        // `SELECT * FROM grosir_pintar.pos_stock_logs WHERE wholesaler_id='${wholesaler_id}'`;

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
    m_getLaporanStock
}