const moment = require("moment");
const { sqlCon } = require("../../../config/db_config");

const m_getAllPromo = async (params) => {
  try {
    const { wholesaler_id, start_date, end_date, keyword, id } = params;

    let query = `SELECT * FROM grosir_pintar.pos_promo WHERE wholesaler_id='${wholesaler_id}' `;
    if (id) query += ` AND id='${id}'`;
    if (keyword)
      query += ` AND (name ILIKE '%${keyword}%' OR description ILIKE '%${keyword}%' OR code_uniq ILIKE '%${keyword}%') `;
    if (start_date)
      query += ` AND (('${start_date}' BETWEEN start_date AND end_date ) OR ('${end_date}' BETWEEN start_date AND end_date ))`;
    console.log(query);
    let data_promo = await sqlCon(query);

    if (data_promo == "Mohon maaf ada kendala sistem")
      throw new Error("Mohon maaf ada kendala sistem");

    return {
      error: false,
      result: data_promo,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};

const m_inactivePromoDueToDate = async(params)=>{
  try {
    const {id} = params;

    let query = `UPDATE grosir_pintar.pos_promo SET is_active=false WHERE id='${id}'`;
    
    const data_promo = await sqlCon(query);

     if (data_promo == "Mohon maaf ada kendala sistem")
      throw new Error("Mohon maaf ada kendala sistem");

    return {
      error: false,
      result: data_promo,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
}

const m_insertNewPromo = async (params) => {
  try {
    const {
      wholesaler_id,
      type_promo,
      product,
      category,
      principal,
      is_active,
      startDate,
      endDate,
      promo_name,
      discount,
      min_purchase,
      voucher_code,
      voucher_amount,
      budget_source,
      budget,
      action_by,
    } = params;

    console.log(params)

    let valuesQuery ='';

    for(let i of product){
      if(valuesQuery !== '') valuesQuery += ', ';
      valuesQuery += `('${wholesaler_id}', '${promo_name}','','${startDate}', '${endDate}', '${i}', 
      '${principal}', '${category}', ${min_purchase ? min_purchase : 0}, ${voucher_amount}, ${is_active},
      '${moment().format(
        "YYYY-MM-DD HH:mm:ss"
      )}','${action_by}','${type_promo}',${discount} ${voucher_code !== "" ? ", '${voucher_code}'" : ""},'${budget_source}',${budget})`;
    }

    let query = `INSERT INTO grosir_pintar.pos_promo
(wholesaler_id, "name", description, start_date, end_date, p_code, 
principal_code, category_code, minimum_purchase, amount, is_active, 
created_at, created_by, "type", discount ${voucher_code !== "" ? ", voucher_code" : ""},budget_id,budget)
VALUES ${valuesQuery} RETURNING id `;
    console.log(query);
    let data_promo = await sqlCon(query);

    if (data_promo == "Mohon maaf ada kendala sistem")
      throw new Error("Mohon maaf ada kendala sistem");

    return {
      error: false,
      result: data_promo,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};

const m_updatePromo = async (params) => {
  try {
    const {
      id,
      wholesaler_id,
      type_promo,
      product,
      category,
      principal,
      is_active,
      startDate,
      endDate,
      promo_name,
      discount,
      min_purchase,
      voucher_code,
      voucher_amount,
      action_by,
    } = params;

    let query = `UPDATE grosir_pintar.pos_promo SET 
    "name" = '${promo_name}',
    start_date = '${startDate}',
    end_date = '${endDate}',
    p_code = '${product}',
    principal_code = '${principal}',
    category_code = '${category}',
    minimum_purchase = ${min_purchase},
    amount = ${voucher_amount},
    is_active = ${is_active},
    created_at = '${moment().format("YYYY-MM-DD HH:mm:ss")}',
    created_by = '${action_by}',
    "type" = '${type_promo}',
    discount = ${discount},
    code_uniq = '${voucher_code}'
    WHERE id = '${id}' AND wholesaler_id = '${wholesaler_id}' RETURNING id `;
    console.log(query);
    let data_promo = await sqlCon(query);

    if (data_promo == "Mohon maaf ada kendala sistem")
      throw new Error("Mohon maaf ada kendala sistem");

    return {
      error: false,
      result: data_promo,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};

const m_getAllBudgetPromo = async (params) => {
  try {
    const {wholesaler_id,keyword,id,start_date,end_date} = params;
    let query = `SELECT * FROM grosir_pintar.pos_budget_promo WHERE wholesaler_id='${wholesaler_id}'`;
    if(id) query += ` AND id='${id}'`;
    if(keyword) query += ` AND (name ILIKE '%${keyword}%' OR description ILIKE '%${keyword}%' OR id ILIKE '%${keyword}%')`;
    if (start_date)
      query += ` AND (('${start_date}' BETWEEN start_date AND end_date ) OR ('${end_date}' BETWEEN start_date AND end_date ))`;
    const data_budget = await sqlCon(query);

    if (data_budget == "Mohon maaf ada kendala sistem")
      throw new Error("Mohon maaf ada kendala sistem");

    return {
      error: false,
      result: data_budget,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,  
    }
  }
};

const m_insertNewBudgetPromo = async (params) => {
  try {
    const {
      wholesaler_id,
      budget_name,
      description,
      startDate,
      endDate,
      amount,
      action_by,
    } = params;

    let query = `INSERT INTO grosir_pintar.pos_budget_promo (wholesaler_id, "name", description, start_date, end_date, amount, created_by) 
    VALUES('${wholesaler_id}', '${budget_name}', '${description}', '${startDate}', '${endDate}', ${amount}, '${action_by}') RETURNING id `;
    console.log(query);
    let data_budget = await sqlCon(query);

    if (data_budget == "Mohon maaf ada kendala sistem")
      throw new Error("Mohon maaf ada kendala sistem");

    return {
      error: false,
      result: data_budget,
    };
  }
  catch (error) {
    return {
      error: error.message,
      result: false,  
    }
  }
};

const m_updateBudgetPromo = async (params) => {
  try {
    console.log(params)
    const {id,wholesaler_id,startDate,endDate,amount,action_by,budget_name, description} = params;

    let  query = `UPDATE grosir_pintar.pos_budget_promo SET start_date = '${startDate}', end_date = '${endDate}', amount = ${amount}, created_by = '${action_by}', "name" = '${budget_name}', description = '${description}' WHERE id = '${id}' AND wholesaler_id = '${wholesaler_id}'`;
    console.log(query);
    let data_budget = await sqlCon(query);

    if (data_budget == "Mohon maaf ada kendala sistem")
      throw new Error("Mohon maaf ada kendala sistem");

    return {
      error: false,
      result: data_budget,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    }
  }
};

const m_getPromoByProduct = async(params) => {
  try {
    const {pcode,wholesaler_id} = params;

    let query = `SELECT * FROM grosir_pintar.pos_promo WHERE wholesaler_id='${wholesaler_id}' AND p_code IN (${pcode}) 
    AND ((NOW() BETWEEN start_date AND end_date ) OR (NOW() BETWEEN start_date AND end_date ))
    `;

    let data_budget = await sqlCon(query);

    if (data_budget == "Mohon maaf ada kendala sistem")
      throw new Error("Mohon maaf ada kendala sistem");

    return {
      error: false,
      result: data_budget,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    }
  }
}

module.exports = {
  m_getAllPromo,
  m_insertNewPromo,
  m_updatePromo,
  m_inactivePromoDueToDate,
  m_getAllBudgetPromo,
  m_insertNewBudgetPromo,
  m_updateBudgetPromo,
  m_getPromoByProduct
};
