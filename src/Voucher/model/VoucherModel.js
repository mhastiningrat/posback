const moment = require("moment");
const { sqlConGateway, sqlCon } = require("../../../config/db_config");

const getAllVoucher = async(params) => {
    try {

        const {wholesaler_id,retail_id} = params;
        let NOW_MOMENT = moment().utcOffset('+0700');
        let NOW_DATE = NOW_MOMENT.format('YYYY-MM-DD HH:mm:ss');
        let data_explore,voucherQuery ='';
        voucherQuery = `SELECT 'GUNAKAN VOUCHER' AS "action", 'external' AS "type_voucher", a.voucher_customer_id, a.id_voucher,
                        a.value, b.min_trx, TO_CHAR(a.given_date , 'DD Mon') AS "given_date", a.given_time,
                        TO_CHAR(a.given_date + (a.total_expiration_day * interval '1' day), 'DD Mon') AS "expired_date",
                        b.title, b.banner_url, b.identity_code, b.identity_data, a.max_persentase AS "gp_persentase",
                        CONCAT('Nikmati potongan harga dengan maksimal ', TO_CHAR(a.value, 'FM999,999,999'), ' rupiah.') AS v_description
                          FROM gateway.voucher_customer a
                        LEFT JOIN gateway.voucher_master b ON a.id_voucher = b.id_voucher
                          WHERE a.cust_no='` + retail_id + `' AND a.status='OPEN'
                        AND '${NOW_DATE}' BETWEEN (a.given_date + a.given_time::TIME) AND ((a.given_date + a.given_time::TIME) + (a.total_expiration_day * interval '1' day))
                          ORDER BY a.voucher_customer_id ASC`;
        let data = await sqlConGateway(voucherQuery);
        if (wholesaler_id !== undefined) {
          // INNER SHOW
          voucherQuery = `SELECT 'GUNAKAN VOUCHER' AS "action", 'inner' AS "type_voucher", b.voucher_id AS "id_voucher", a.voucher_price AS "value",
                          '' AS "given_date", '' AS "given_time", '' AS "expired_date", b.voucher_customer_id, a.identity_tag, a.identity_value, a.identity_uom,
                          a.description "title", a.image AS banner_url, a.identity_code, a.identity_data, a.minimum_purchase,
                          CONCAT('Nikmati potongan harga dengan maksimal ', TO_CHAR(a.voucher_price, 'FM999,999,999'), ' rupiah.') AS v_description
                          FROM grosir_pintar.mst_voucher_wholesaler a
                          LEFT JOIN grosir_pintar.mapp_voucher_customer b ON a.wholesaler_id = b.wholesaler_id AND a.voucher_id=b.voucher_id
                          WHERE a.is_active=TRUE AND b.retail_id='` + retail_id + `' AND b.status=0 AND a.wholesaler_id='` + wholesaler_id + `'
                         ORDER BY a.voucher_id ASC`;
          let inner_voucher = await sqlCon(voucherQuery);
          // console.log(inner_voucher)
          data = data.concat(inner_voucher);
          // INNER CLAIM
          voucherQuery = `SELECT 'CLAIM VOUCHER' AS "action", 'inner' AS "type_voucher", a.voucher_id AS id_voucher,
            a.voucher_price AS "value", a.description AS "title", a.image AS "banner_url",
            CONCAT('Anda bisa klaim ', a.description, ' senilai ', TO_CHAR(a.voucher_price, 'FM999,999,999'), ' rupiah hanya di grosir ini!') AS v_description,
            COALESCE(b.status, 1) AS "status", a.max_claim, COALESCE(b.claim_count, 0) AS "claim_count"
          FROM grosir_pintar.mst_voucher_wholesaler a
            LEFT JOIN grosir_pintar.mapp_voucher_customer b ON a.wholesaler_id = b.wholesaler_id
              AND a.voucher_id=b.voucher_id AND b.retail_id='` + retail_id + `' AND b.voucher_customer_id=a.voucher_id
            LEFT JOIN grosir_pintar.mapp_ws_loyalty_retail c ON c.id_ws_loyalty=a.identity_data AND c.retail_id='${retail_id}'
          WHERE COALESCE(c.point, 0) >= COALESCE(a.claim_value, 0) AND a.wholesaler_id='` + wholesaler_id + `' AND a.is_active=TRUE AND COALESCE(b.status, 1) = 1 AND COALESCE(b.claim_count,0) < a.max_claim`;
          data_explore = await sqlCon(voucherQuery);
        }

        console.log("============= voucherQuery ====================================================================")
        console.log(voucherQuery)
        console.log("***--------------------------------------------------------------------------------------------")

       if(data.length == 0) data = data_explore
       else data.push({
        data_explore : data_explore
       })
        // console.log(data)
        return {
            error:false,
            result: data
        }
        

    } catch (error) {
        return {
            error:error.message,
            result: {}
        }
    }
}

module.exports = {
    getAllVoucher
}