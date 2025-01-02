const { sqlCon } = require("../../../config/db_config");
const moment = require("moment");
const m_getProfitToday = async (params) => {
  try {
    const { wholesaler_id } = params;

    let selectQuery = `SELECT COALESCE((SUM(total_transaction) - SUM(total_return)) - SUM(total_equity),0) as keuntungan FROM grosir_pintar.pos_transaction_logs WHERE wholesaler_id='${wholesaler_id}' AND transaction_date >= '${moment().format(
      "YYYY-MM-DD"
    )} 00:00:00' AND transaction_date < '${moment().format(
      "YYYY-MM-DD"
    )} 23:59:59' `;
    console.log(selectQuery);
    let data = await sqlCon(selectQuery);

    console.log(data);
    return {
      error: false,
      result: data,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};

const m_getProductTerlaris = async (params) => {
  try {
    console.log("ksini sih");
    const { wholesaler_id } = params;

    let selectQuery = `SELECT COALESCE(SUM(psl.stock_qty),0) as qty,psl.pcode,p.pcode_name 
    FROM grosir_pintar.pos_stock_logs psl
    inner join grosir_pintar.product p on p.wholesaler_id = psl.wholesaler_id and p.pcode = psl.pcode 
    where psl.wholesaler_id = '${wholesaler_id}' 
    and psl.stock_type = 'OUT' 
    and (psl.created_at >= '${moment()
      .startOf("week")
      .add(1, "days")
      .format("YYYY-MM-DD")} 00:00:00' and psl.created_at < '${moment().format(
      "YYYY-MM-DD"
    )} 23:59:59') group by psl.pcode,p.pcode_name order by qty desc limit 10`;
    console.log(selectQuery);
    let data = await sqlCon(selectQuery);

    console.log(data);
    return {
      error: false,
      result: data,
    };
  } catch (error) {
    console.log(error.message);
    return {
      error: error.message,
      result: false,
    };
  }
};

const m_getProductTerlarisMonth = async (params) => {
  try {
    console.log("ksini sih");
    const { wholesaler_id } = params;

    let selectQuery = `SELECT COALESCE(SUM(psl.stock_qty),0) as qty,psl.pcode,p.pcode_name 
    FROM grosir_pintar.pos_stock_logs psl
    inner join grosir_pintar.product p on p.wholesaler_id = psl.wholesaler_id and p.pcode = psl.pcode 
    where psl.wholesaler_id = '${wholesaler_id}' 
    and psl.stock_type = 'OUT' 
    and (psl.created_at >= '${moment()
      .startOf("month")
      .format("YYYY-MM-DD")} 00:00:00' and psl.created_at < '${moment().format(
      "YYYY-MM-DD"
    )} 23:59:59') group by psl.pcode,p.pcode_name order by qty desc limit 10`;
    console.log(selectQuery);
    let data = await sqlCon(selectQuery);

    console.log(data);
    return {
      error: false,
      result: data,
    };
  } catch (error) {
    console.log(error.message);
    return {
      error: error.message,
      result: false,
    };
  }
};


const m_getProfitWeeks = async (params) => {
  try {
    const { wholesaler_id } = params;

    let selectQuery = `SELECT COALESCE((SUM(total_transaction) - SUM(total_return)) - SUM(total_equity),0) as keuntungan 
      FROM grosir_pintar.pos_transaction_logs 
      WHERE 
      wholesaler_id='${wholesaler_id}' AND transaction_date >= '${moment()
      .startOf("week")
      .add(1, "days")
      .format("YYYY-MM-DD")} 00:00:00' AND 
      transaction_date < '${moment().format("YYYY-MM-DD")} 23:59:59' `;
    console.log(selectQuery);
    let data = await sqlCon(selectQuery);

    console.log(data);
    return {
      error: false,
      result: data,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};

const m_getProfitMonth = async (params) => {
  try {
    const { wholesaler_id } = params;

    let selectQuery = `SELECT COALESCE((SUM(total_transaction) - SUM(total_return)) - SUM(total_equity),0) as keuntungan 
      FROM grosir_pintar.pos_transaction_logs 
      WHERE 
      wholesaler_id='${wholesaler_id}' AND transaction_date >= '${moment()
      .startOf("month")
      .format("YYYY-MM-DD")} 00:00:00' AND 
      transaction_date < '${moment().format("YYYY-MM-DD")} 23:59:59' `;
    console.log(selectQuery);
    let data = await sqlCon(selectQuery);

    console.log(data);
    return {
      error: false,
      result: data,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};

const m_getTransactionWeeks = async (params) => {
  try {
    const { wholesaler_id } = params;

    let selectQuery = `SELECT COALESCE(SUM(total_transaction),0) as transaksi FROM grosir_pintar.pos_transaction_logs WHERE wholesaler_id='${wholesaler_id}' AND transaction_date >= '${moment()
      .startOf("week")
      .add(1, "days")
      .format(
        "YYYY-MM-DD"
      )} 00:00:00' AND transaction_date < '${moment().format(
      "YYYY-MM-DD"
    )} 23:59:59' `;
    console.log(selectQuery);
    let data = await sqlCon(selectQuery);

    console.log(data);
    return {
      error: false,
      result: data,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};

const m_getTransactionMonth = async (params) => {
  try {
    const { wholesaler_id } = params;

    let selectQuery = `SELECT COALESCE(SUM(total_transaction),0) as transaksi FROM grosir_pintar.pos_transaction_logs WHERE wholesaler_id='${wholesaler_id}' AND transaction_date >= '${moment()
      .startOf("month")
      .format(
        "YYYY-MM-DD"
      )} 00:00:00' AND transaction_date < '${moment().format(
      "YYYY-MM-DD"
    )} 23:59:59' `;
    console.log(selectQuery);
    let data = await sqlCon(selectQuery);

    console.log(data);
    return {
      error: false,
      result: data,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};

const m_getSalesChartByYears = async (params) => {
  try {
    const { wholesaler_id } = params;

    let selectQuery = `WITH months AS (
    SELECT generate_series(1, 12) AS month_number
), 
aggregated_data AS (
    SELECT 
        EXTRACT(MONTH FROM transaction_date) AS month_number,
        SUM(total_transaction) AS total_transaction,
        SUM(total_return) AS total_return
    FROM grosir_pintar.pos_transaction_logs
    WHERE wholesaler_id = '${wholesaler_id}' AND EXTRACT(YEAR FROM transaction_date)  = '${moment().format("YYYY")}'
    GROUP BY EXTRACT(MONTH FROM transaction_date)
), 
final_data AS (
    SELECT 
        m.month_number,
        to_char(TO_DATE(m.month_number::TEXT, 'MM'), 'Mon') AS month_name,
        COALESCE(ad.total_transaction, 0) AS total_transaction,
        COALESCE(ad.total_return, 0) AS total_return
    FROM months m
    LEFT JOIN aggregated_data ad ON m.month_number = ad.month_number
)
SELECT 
    jsonb_build_object(
        'categories', ARRAY(
            SELECT month_name
            FROM final_data
            ORDER BY month_number
        ),
        'series', ARRAY[
            jsonb_build_object(
                'name', 'retur',
                'data', ARRAY(
                    SELECT total_return
                    FROM final_data
                    ORDER BY month_number
                )
            ),
            jsonb_build_object(
                'name', 'transaksi',
                'data', ARRAY(
                    SELECT total_transaction
                    FROM final_data
                    ORDER BY month_number
                )
            )
        ]
    ) AS result`;
    console.log(selectQuery);
    let data = await sqlCon(selectQuery);

    console.log(data);
    return {
      error: false,
      result: data,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};

module.exports = {
  m_getProfitToday,
  m_getProductTerlaris,
  m_getProfitWeeks,
  m_getTransactionWeeks,
  m_getSalesChartByYears,
  m_getTransactionMonth,
  m_getProfitMonth,
  m_getProductTerlarisMonth
};
