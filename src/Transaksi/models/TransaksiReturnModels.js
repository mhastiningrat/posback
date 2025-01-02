const { sqlConTrx } = require("../../../config/db_config");
const { getSequence } = require("../../../utils/format");
const moment = require("moment");
const m_postTransaksiReturn = async (params) => {

    try {

        // WHEN a.status=0 THEN '0-Antrian'
        // WHEN a.status=1 THEN '1-Diproses'
        // ELSE '3-Pengiriman'
        // Status 7 = Return

        const {wholesaler_id,kasir,retail_id,detail_order_return,data_customer,total_belanja_return,voucher,id_bundle,total_modal_return} = params;

        let order_no = await getSequence('auto_sales_order()');

        let insertOrderHeaderQuery = `INSERT INTO grosir_pintar.t_order_h (
        wholesaler_id, retail_id,order_no, total_items, amount, 
        status, order_date,order_timestamp, update_date, update_timestamp, 
        flag_received, note, app_platform,delivery_price, delivery_platform, 
        payment_method, voucher_id, voucher_price, is_delivery, id_bundle)
        VALUES ('${wholesaler_id}','${data_customer.cust_no ? data_customer.cust_no : 'Walk in customer'}',
        '${order_no}','${detail_order_return.length}',${total_belanja_return},7,
        '${moment().format("YYYY-MM-DD")}','${moment().format("HH:mm:ss")}','${moment().format("YYYY-MM-DD")}','${moment().format("HH:mm:ss")}',
         0,'${data_customer.note}','POS',0,0,3,
        ${voucher ? voucher.id : 0},${voucher ? voucher.price: 0},false,'${id_bundle?id_bundle:""}')`

        let orderDetailValue = '';
        let updateValue = ''
        let insertStockValue = ''
        let updateOrderDetailValue = '';

        for(let i of detail_order_return){
            if(orderDetailValue.length > 0) orderDetailValue+=','
            orderDetailValue += `('${wholesaler_id}','${data_customer.cust_no ? data_customer.cust_no : 'Walk in customer'}','${order_no}',
            '${i.pcode}',${i.qty},${i.qty},${i.total_basic_price},${i.total_basic_price},0,0)`

            if(updateValue.length > 0) updateValue += ','
            updateValue += `('${i.pcode}',${i.qty})`

            if(updateOrderDetailValue.length > 0) updateOrderDetailValue += `,`
            updateOrderDetailValue += `('${i.order_no}','${i.pcode}')`

            if(insertStockValue.length > 0) insertStockValue += `,`
            insertStockValue += `('${wholesaler_id}','${i.pcode}',0,'${moment().format("YYYY-MM-DD HH:mm:ss")}','TRANSAKSI RETUR - ${kasir}')`
        }
        
        let insertOrderDetailQuery = `INSERT INTO grosir_pintar.t_order_d (wholesaler_id, retail_id,
        order_no, pcode, qty_real_order, qty_sales_order, amount_real_order,
        amount_sales_order,fs_code,freebies_id)
        VALUES ${orderDetailValue}`;

        let description = `TRANSAKSI RETURN DENGAN ORDER ${order_no}`;
        
        let insertLogsOUTQuery = await insertLogStock({wholesaler_id
            ,transaction :'TRANSAKSI RETURN'
            ,description
            ,type:'IN'
            ,detail_order_return
            ,kasir})

        let initProductStockQuery = ` INSERT INTO grosir_pintar.pos_product_stock (wholesaler_id, pcode, stock, updated_at,updated_by)
        VALUES 
            ${insertStockValue}
        ON CONFLICT (wholesaler_id, pcode) 
        DO NOTHING`
        
        let updateStockQuery = `
        WITH updated_data AS (
        VALUES
                ${updateValue}
        )
        UPDATE grosir_pintar.pos_product_stock
        SET stock = COALESCE(stock, 0) + updated_data.column2, updated_by = 'TRANSAKSI RETUR - ${kasir}', updated_at = '${moment().format("YYYY-MM-DD HH:mm:ss")}'
        FROM updated_data
        WHERE pcode = updated_data.column1
        AND wholesaler_id = '${wholesaler_id}'`

        let updateOerderDetailQuery = `
        WITH updated_data AS (
        VALUES
                ${updateOrderDetailValue}
        )
        UPDATE grosir_pintar.t_order_d
        SET is_return = true
        FROM updated_data
        WHERE order_no = updated_data.column1
        AND pcode = updated_data.column2`

        let insertTransactionLogsQuery = `INSERT INTO grosir_pintar.pos_transaction_logs (
        order_no,
        wholesaler_id,
        retail_id,
        customer,
        "type",
        detail,
        transaction_by,
        total_return,total_equity) 
        VALUES (
        '${order_no}',
        '${wholesaler_id}',
        '${retail_id ? retail_id : ''}',
        '${data_customer.cust_no ? data_customer.cust_no : 'Walk in customer'}',
        'return',
        '${JSON.stringify(detail_order_return)}',
        '${kasir}',
        ${total_belanja_return},0)`

        
        arrayQuery = [];
        arrayQuery.push(insertOrderHeaderQuery);
        arrayQuery.push(insertOrderDetailQuery);
        arrayQuery.push(insertLogsOUTQuery.result);
        arrayQuery.push(initProductStockQuery);
        arrayQuery.push(updateStockQuery);
        arrayQuery.push(updateOerderDetailQuery);
        arrayQuery.push(insertTransactionLogsQuery);
        
        let result_transaction = await sqlConTrx(arrayQuery);
            console.log('result_transaction')
            console.log(result_transaction)
            console.log('result_transaction')
        if(result_transaction && result_transaction.error) throw new Error(result_transaction.message);
    
        return {
          error: false,
          result: {
            success:true
          },
        };
    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
};

const insertLogStock = async(params) => {

  const {wholesaler_id
        ,transaction
        ,description
        ,type
        ,detail_order_return
        ,kasir} = params

    let valueStockUpdate = '';
    for(let i of detail_order_return){
        if(valueStockUpdate.length > 0) valueStockUpdate += ','
        // wholesaler_id,pcode,stock_type,stock_qty,"transaction",description,created_at,created_by,supplier
        valueStockUpdate += `('${wholesaler_id}','${i.pcode}','${type}',${i.qty},'${transaction}','${description}','${moment().format("YYYY-MM-DD HH:mm:ss")}','${kasir}','')`
    }

        

  if(!transaction) throw new Error("Transaksi harus diisi untuk mengetahui darimana proses dilakukan");
  if(!description) throw new Error("Deskripsi harus diisi untuk mengetahui aktifitas yang dilakukan");
  try {
    let insertLogsQuery = `INSERT INTO grosir_pintar.pos_stock_logs
                            (wholesaler_id,pcode,stock_type,stock_qty,"transaction",description,created_at,created_by,supplier)
                            VALUES ${valueStockUpdate}`;

    return {
      error:false,
      result:insertLogsQuery
    } 
  } catch (error) {
    return {
      error:error.message,
      result:false
    }
  }
}

module.exports = {
    m_postTransaksiReturn
}