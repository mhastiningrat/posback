const { sqlCon, sqlConGateway, sqlConTrx } = require("../../../config/db_config");
const { getSequence } = require("../../../utils/format");
const moment = require("moment");

const m_getAllCustomer = async(params) => {
    try {
        const {wholesaler_id, customer} = params;

        let customerGatewayQuery = `SELECT 
        c.cust_no,
        c.cust_name,
        c.cust_no_hp,
        c.cust_address,
        vc.voucher_customer_id,
        vc.id_voucher,
        vm.title as vooche_title,
        vm.description as voucher_description,
        vm.status_ref,
        vm.identity_code,
        vm.identity_data 
        FROM gateway.customer c 
        LEFT JOIN gateway.voucher_customer vc ON c.cust_no = vc.cust_no 
        LEFT JOIN gateway.voucher_master vm ON vc.id_voucher = vm.id_voucher
        WHERE c.cust_no ILIKE '%${customer}%' OR c.cust_name ILIKE '%${customer}%' OR c.cust_no_hp = '${customer}'`
        customerGatewayQuery += ' UNION '
        customerGatewayQuery += ` SELECT 
        c.cust_no,
        c.cust_name,
        c.cust_no_hp,
        c.cust_address,
        vc.voucher_customer_id,
        vc.id_voucher,
        vm.title as vooche_title,
        vm.description as voucher_description,
        vm.status_ref,
        vm.identity_code,
        vm.identity_data 
        FROM gateway.pos_customer c 
        LEFT JOIN gateway.voucher_customer vc ON c.cust_no = vc.cust_no 
        LEFT JOIN gateway.voucher_master vm ON vc.id_voucher = vm.id_voucher 
        WHERE c.cust_no ILIKE '%${customer}%' OR c.cust_name ILIKE '%${customer}%' OR c.cust_no_hp = '${customer}'`
        console.log(customerGatewayQuery)
        let data_cust_gateway = await sqlConGateway(customerGatewayQuery);

        return {
            error:false,
            result: data_cust_gateway
        }
    
    } catch (error) {
        return {
            error:error.message,
            result: false
        }
    }
}

const m_getGrosirPintarCustomer = async(params) => {
    try {
        const {cust_no} = params;

        let customerGPQuery = `SELECT * FROM grosir_pintar.m_wholesaler_retail WHERE retail_id IN (${cust_no})`;
        // console.log(customerGPQuery)
        let data_cust_gp = await sqlCon(customerGPQuery);

        return {
            error:false,
            result:data_cust_gp
        }

    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}

const m_getAllDelivery = async(params) =>{
    try {
        const {subprice,wholesaler_id} = params;

        if(subprice == 0) throw new Error("Total harga barang tidak boleh 0");
        if(!wholesaler_id) throw new Error("Grosir tidak ditemukan");

        let wholesalerQuery = `SELECT a.notification_msg, a.sub_district, a.delivery_discount, 
                               a.limit_credit, COALESCE(a.retrieval_method,'') AS retrieval_method,
                               COALESCE(b.delivery_price, a.delivery_price) AS "delivery_price", a.accept_half
                               FROM grosir_pintar.wholesaler a
                               LEFT JOIN grosir_pintar.mapp_delivery_payment b ON a.wholesaler_id=b.wholesaler_id
                               AND ${subprice} BETWEEN b.min_purchase AND b.max_purchase
                               AND b.app_platform='tokopintar'
                               WHERE a.wholesaler_id='${wholesaler_id}' LIMIT 1`
                               

        let data_wholesaler = await sqlCon(wholesalerQuery);

        return {
            error:false,
            result:data_wholesaler
        }
    } catch (error) {
        return {
            error:error.message,
            result:false
        }
    }
}

const m_postTransaksiJual = async(params) => {
    try {
        // return;
        // WHEN a.status=0 THEN '0-Antrian'
        // WHEN a.status=1 THEN '1-Diproses'
        // ELSE '3-Pengiriman'

        const {wholesaler_id,kasir,detail_order,data_customer,retail_id,kurir,delivery_method,total_belanja,voucher,id_bundle,payment_method,total_modal,total_profit} = params;

        let insertPosCustomerGatewayQuery = `INSERT INTO gateway.pos_customer(cust_name) `
        
        let order_no = await getSequence('auto_sales_order()');

        let insertOrderHeaderQuery = `INSERT INTO grosir_pintar.t_order_h (
        wholesaler_id, retail_id,order_no, total_items, amount, 
        status, order_date,order_timestamp, update_date, update_timestamp, 
        flag_received, note, app_platform,delivery_price, delivery_platform, 
        payment_method, voucher_id, voucher_price, is_delivery, id_bundle)
        VALUES ('${wholesaler_id}','${data_customer.cust_no ? data_customer.cust_no : 'WIC'}',
        '${order_no}','${detail_order.length}',${total_belanja},3,
        '${moment().format("YYYY-MM-DD")}','${moment().format("HH:mm:ss")}','${moment().format("YYYY-MM-DD")}','${moment().format("HH:mm:ss")}',
         0,'${data_customer.note?data_customer.note:""}','POS',0,0,3,
        ${voucher.id?voucher.id:0},${voucher.price},false,'${id_bundle?id_bundle:""}')`

        let orderDetailValue = '';
        let updateValue = ''
        let insertStockValue = ''

        for(let i of detail_order){
            if(orderDetailValue.length > 0) orderDetailValue+=','
            orderDetailValue += `('${wholesaler_id}','${data_customer.cust_no ? data_customer.cust_no : '-'}','${order_no}',
            '${i.pcode}',${i.qty},${i.qty},${i.total_basic_price},${i.total_basic_price},0,0)`

            if(updateValue.length > 0) updateValue += ','
            updateValue += `('${i.pcode}',${i.qty})`

            if(insertStockValue.length > 0) insertStockValue += `,`
            insertStockValue += `('${wholesaler_id}','${i.pcode}',0,'${moment().format("YYYY-MM-DD HH:mm:ss")}','TRANSAKSI JUAL - ${kasir}')`
        }
        
        let insertOrderDetailQuery = `INSERT INTO grosir_pintar.t_order_d (wholesaler_id, retail_id,
        order_no, pcode, qty_real_order, qty_sales_order, amount_real_order,
        amount_sales_order,fs_code,freebies_id)
        VALUES ${orderDetailValue}`

        let description = `TRANSAKSI JUAL DENGAN ORDER ${order_no}`;

        let insertLogsOUTQuery = await insertLogStock({wholesaler_id
            ,transaction :'TRANSAKSI JUAL'
            ,description
            ,type:'OUT'
            ,detail_order
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
        SET stock = COALESCE(stock, 0) - updated_data.column2, updated_at = '${moment().format("YYYY-MM-DD HH:mm:ss")}'
        FROM updated_data
        WHERE pcode = updated_data.column1
        AND wholesaler_id = '${wholesaler_id}'`

        let insertTransactionLogs = `INSERT INTO grosir_pintar.pos_transaction_logs (
        order_no,
        wholesaler_id,
        retail_id,
        customer,
        "type",
        detail,
        transaction_by,
        total_transaction,
        total_equity,
        total_profit) 
        VALUES (
        '${order_no}',
        '${wholesaler_id}',
        '${retail_id ? retail_id : ''}',
        '${data_customer.cust_no ? data_customer.cust_no : 'Walk in customer'}',
        'penjualan',
        '${JSON.stringify(detail_order)}',
        '${kasir}',
        ${total_belanja},${total_modal},${total_profit})`;

        
        arrayQuery = [];
        arrayQuery.push(insertOrderHeaderQuery);
        arrayQuery.push(insertOrderDetailQuery);
        arrayQuery.push(insertLogsOUTQuery.result);
        arrayQuery.push(initProductStockQuery);
        arrayQuery.push(updateStockQuery);
        arrayQuery.push(insertTransactionLogs);
        
        let result_transaction = await sqlConTrx(arrayQuery);
            console.log('result_transaction')
            console.log(result_transaction)
            console.log('result_transaction')
        if(result_transaction !== 'finished') throw new Error(result_transaction);

        
    
        return {
          error: false,
          result: order_no,
        };
    } catch (error) {
        console.log("lari k sini harusnya")
        return {
            error:error.message,
            result:false
        }
    }
}

const insertLogStock = async(params) => {

  const {wholesaler_id
        ,transaction
        ,description
        ,type
        ,detail_order
        ,kasir} = params

    let valueStockUpdate = '';
    for(let i of detail_order){
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
    m_getAllCustomer,
    m_getGrosirPintarCustomer,
    m_getAllDelivery,
    m_postTransaksiJual
}