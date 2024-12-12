const moment = require("moment");
const { sqlCon, sqlConTrx } = require("../../../config/db_config");
const { param } = require("../router");
const { updateConversion } = require("../controllers/MasterInventoryController");

const M_getAllProduk = async (params) => {
  try {
    let limit = 20;
    let offset = 0;
    const { wholesaler_id, kode_produk, kategori, nama_produk, page } = params;
    if (!wholesaler_id) {
      throw new Error("Grosir tidak ditemukan");
    }

    //wholesaler_id,pcode,pcode_name,barcode,imgtiny_url,imgbig_url,conv,uom_a,uom_b,cat_a,cat_b,cat_c,subcat_c,flag_new_item,flag_promo,order_number,calculation_type,is_active,idx_pagination,p_alias,price_status,last_update,stm_update,is_delete,p_stock,p_stock_update,odoo_ref,pcode2
    let productQuery = `SELECT 
                             p.wholesaler_id
                            ,p.pcode
                            ,p.pcode_name
                            ,p.barcode
                            ,p.imgtiny_url
                            ,p.imgbig_url
                            ,p.conv
                            ,p.uom_a
                            ,p.uom_b
                            ,p.cat_a
                            ,p.cat_b
                            ,p.cat_c
                            ,p.subcat_c
                            ,p.supplier
                            ,mc.description as category 
                            ,pr.basic_price
                            ,pps.stock
                            ,pps.allow_minus
                            ,json_agg(
                                json_build_object(
                                    'min_qty', pr.min_qty,
                                    'price', pr.price,
                                    'margin_price', pr.margin_price,
                                    'discount', pr.discount
                                )
                            ) as price_details 
                            FROM grosir_pintar.product p 
                            LEFT JOIN grosir_pintar.mst_category mc ON mc.cat_a = p.cat_a
                            LEFT JOIN grosir_pintar.pos_product_stock pps ON (p.pcode = pps.pcode AND p.wholesaler_id = pps.wholesaler_id)
                            LEFT JOIN grosir_pintar.price pr ON (p.pcode = pr.pcode AND p.wholesaler_id = pr.wholesaler_id) `;

    if (wholesaler_id) {
      productQuery += ` WHERE p.wholesaler_id = '${params.wholesaler_id}' `;
    }

    if (kode_produk) {
      productQuery += ` AND p.pcode = '${kode_produk}' `;
    }

    if (nama_produk) {
      productQuery += ` AND p.pcode_name ILIKE '%${nama_produk}%' OR p.p_alias ILIKE '%${nama_produk}%' `;
    }

    if (kategori) {
      productQuery += ` AND p.cat_a = '${kategori}' `;
    }

    productQuery += ` GROUP BY 
                      pr.basic_price,
                      p.wholesaler_id,
                      p.pcode,
                      p.pcode_name,
                      p.barcode,
                      p.imgtiny_url,
                      p.imgbig_url,
                      p.conv,
                      p.uom_a,
                      p.uom_b,
                      p.cat_a,
                      p.cat_b,
                      p.cat_c,
                      p.subcat_c,
                      p.supplier,
                      mc.description,
                      pps.stock,
                      pps.allow_minus `

    productQuery += ` ORDER BY p.pcode_name ASC`;

    if (page) {
      offset = (Number(page) - 1) * limit;

      productQuery += ` LIMIT ${limit} OFFSET ${offset} `;
    }

    // console.log("=== get product ===")
    console.log(productQuery)
    let data_product = await sqlCon(productQuery);

    if (!data_product) {
      throw new Error("Data product tidak ditemukan");
    }

    return {
      error: false,
      result: data_product,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};

const M_getAllProdukCategory = async (params) => {
  try {
    let categoryQuery = `SELECT * FROM grosir_pintar.mst_category ORDER BY description ASC`;

    let data_category = await sqlCon(categoryQuery);

    return {
      error: false,
      result: data_category,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};

const M_getAllProdukSubCategory = async (params) => {
  try {
    const { cat_a } = params;

    let subCategoryQuery = `SELECT * FROM grosir_pintar.mst_sub_tag `;

    if (cat_a) subCategoryQuery += ` WHERE cat_c='${cat_a}' `;

    subCategoryQuery += ` ORDER BY description ASC`;
    let data_subcategory = await sqlCon(subCategoryQuery);

    return {
      error: false,
      result: data_subcategory,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};

const M_getAllPrincipal = async (params) => {
  try {
    let principalQuery = `SELECT * FROM grosir_pintar.mst_principal WHERE is_active=true ORDER BY description ASC`;

    let data_principal = await sqlCon(principalQuery);

    return {
      error: false,
      result: data_principal,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};

const M_postStockAndPrice = async (params) => {
  try {
    const { wholesaler_id, stock, arrayPrice, price, basic_price, modal, pcode, actor, transaction, description,supplier,allow_minus } = params;

    if(!wholesaler_id) throw new Error("Grosir tidak ditemukan");
    if(!pcode) throw new Error("Produk tidak ditemukan");

    let valuePriceQuery = '';
    let priceList = '';
    let minQtyList = '';
    let marginList = '';
    let discountList = '';

    for(let ap of arrayPrice){
      if(valuePriceQuery.length > 0) valuePriceQuery += ','
      valuePriceQuery += `('${wholesaler_id}', '${pcode}', ${ap.price}, ${basic_price}, ${ap.margin},${ap.quantity},${ap.discount})`
      
      if(priceList.length > 0) priceList += ','
      priceList += ap.price

      if(minQtyList.length > 0) minQtyList += ','
      minQtyList += ap.quantity

      if(marginList.length > 0) marginList += ','
      marginList += ap.margin

      if(discountList.length > 0) discountList += ','
      discountList += ap.discount
    }

    let checkQuery = `SELECT stock FROM grosir_pintar.pos_product_stock WHERE pcode='${pcode}' AND wholesaler_id='${wholesaler_id}'`;
    let data_stock = await sqlCon(checkQuery);
    let arrayQuery = [];
    console.log(data_stock);
    if (data_stock.length == 0) {
      let updateProductQuery = `UPDATE grosir_pintar.product SET supplier='${supplier}' WHERE wholesaler_id = '${wholesaler_id}' AND pcode='${pcode}'`
      let insertQuery = `INSERT INTO grosir_pintar.pos_product_stock
                        (pcode, stock, created_at, created_by, wholesaler_id,allow_minus)
                        VALUES('${pcode}', ${stock}, '${moment().format('YYYY-MM-DD HH:mm:ss')}', '${actor}', '${wholesaler_id}',${allow_minus})`;
      let deleteQuery = `DELETE FROM grosir_pintar.price WHERE wholesaler_id = '${wholesaler_id}' AND pcode='${pcode}' `
      let insertPriceQuery = `INSERT INTO grosir_pintar.price
                        (wholesaler_id, pcode, price, basic_price, margin_price,min_qty,discount)
                        VALUES ${valuePriceQuery}`
      let insertLogsQuery = await insertLogStock({stock,wholesaler_id,pcode,transaction,description,actor,supplier})
      
      arrayQuery= [];

      arrayQuery.push(updateProductQuery);
      arrayQuery.push(insertQuery);
      arrayQuery.push(deleteQuery);
      arrayQuery.push(insertPriceQuery);
      arrayQuery.push(insertLogsQuery.result);

      let result_transaction = await sqlConTrx(arrayQuery);
  
      if(result_transaction !== 'finished') throw new Error(result_transaction);

      return {
        error: false,
        result: result_transaction
      };
    } else {
      let updateProductQuery = `UPDATE grosir_pintar.product SET supplier='${supplier}' WHERE wholesaler_id = '${wholesaler_id}' AND pcode='${pcode}'`
      let updateQuery = `UPDATE grosir_pintar.pos_product_stock
                        SET stock = ${stock}, allow_minus = ${allow_minus} WHERE wholesaler_id = '${wholesaler_id}' AND pcode='${pcode}'`;

      let deleteQuery = `DELETE FROM grosir_pintar.price WHERE wholesaler_id = '${wholesaler_id}' AND pcode='${pcode}' `
      
      let insertPriceQuery = `INSERT INTO grosir_pintar.price
                            (wholesaler_id, pcode, price, basic_price, margin_price,min_qty,discount)
                            VALUES ${valuePriceQuery}` 

      let insertLogsOUTQuery = await insertLogStock({stock:data_stock[0].stock,wholesaler_id,pcode,transaction,description,actor,type:'OUT',supplier})
      let insertLogsINQuery = await insertLogStock({stock,wholesaler_id,pcode,transaction,description,actor,supplier})

      arrayQuery.push(updateProductQuery);
      arrayQuery.push(updateQuery);
      arrayQuery.push(deleteQuery);
      arrayQuery.push(insertPriceQuery);
      arrayQuery.push(insertLogsOUTQuery.result)
      arrayQuery.push(insertLogsINQuery.result)
      let result_transaction = await sqlConTrx(arrayQuery);
  
      if(result_transaction !== 'finished') throw new Error(result_transaction);

      return {
        error: false,
        result: result_transaction
      };
    }
  } catch (error) {
    console.log(error.message);
    return {
      error: error.message,
      result: false,
    };
  }
};

const M_getAllUom = async () => {
  try {
    let selectQuery = `SELECT * FROM grosir_pintar.mst_uom ORDER BY uom ASC`;

    let data_uom = await sqlCon(selectQuery);

    return {
      error: false,
      result: data_uom,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};

const M_updateProductConversion = async (params) => {
  try {
    const { wholesaler_id, pcode, uom_b, uom_a, conv } = params;

    if(!wholesaler_id) throw new Error("Grosir tidak ditemukan");
    if(!pcode) throw new Error("Produk tidak ditemukan");
    if(!uom_b) throw new Error("Satuan kecil harus diisi");
    if(!uom_a) throw new Error("Satuan besar harus diisi");
    if(!conv || conv == 0) throw new Error("Jumlah konversi tidak boleh 0");

    let updateQuery = `UPDATE grosir_pintar.product set uom_b='${uom_b}', uom_a='${uom_a}', conv=${conv} WHERE wholesaler_id='${wholesaler_id}' AND pcode='${pcode}'`;

    let data_update = await sqlCon(updateQuery);
    return {
      error: false,
      result: [
        {
          status: "success",
        },
      ],
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};

const M_getAllProductMaster = async(params) => {
  try {

    const {page,name} = params;

    let offset = 0

    if(page){
      offset = (page - 1) * 20
    }

    let masterQuery = `SELECT barcode, "name", imgtiny_url, imgbig_url, pcode, cat_a, cat_b, cat_c, subcat_c FROM grosir_pintar.mst_product`
    if(name) masterQuery += ` WHERE LOWER(name) LIKE LOWER('%${name}%') `
    masterQuery += ` LIMIT 30`

     let data_master = await sqlCon(masterQuery);

    return {
      error: false,
      result: data_master,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
}

const M_postNewProductGrosir = async(params) => {
  try {
    const {
      wholesaler_id
      ,pcode
      ,name
      ,barcode
      ,imgtiny_url
      ,imgbig_url
      ,conv
      ,uom_a
      ,uom_b
      ,cat_a
      ,cat_b
      ,cat_c
      ,subcat_c
      ,basic_price
      ,price
      ,margin
      ,stock
      ,transaction
      ,description
      ,actor
      ,arrayPrice} = params;

      if(!wholesaler_id) throw new Error("Grosir tidak ditemukan");
      if(!name) throw new Error("Produk tidak sesuai");
      if(!basic_price || basic_price == 0 )throw new Error("Harga modal tidak boleh kosong");
      if(!arrayPrice || arrayPrice[0].price == '' )throw new Error("Harga jual tidak boleh kosong");
      if(!stock || stock == 0 )throw new Error("Stok barang tidak boleh kosong");

      let valuePrice = '';

      for(let ap of arrayPrice){
        if(valuePrice.length > 0) valuePrice += ','
        valuePrice += `('${wholesaler_id}', '${pcode}', ${ap.price}, ${basic_price}, ${ap.margin},${ap.quantity},${ap.discount})`
      }

    let selectExistingQuery = `SELECT * FROM grosir_pintar.product WHERE wholesaler_id='${wholesaler_id}' AND pcode='${pcode}'`;

    const data_exists  = await sqlCon(selectExistingQuery);

    if(data_exists.length > 0) throw new Error("Produk sudah ada di toko anda");
    
    let arrayQuery = []
    let insertProductQuery = `INSERT INTO grosir_pintar.product
                              (wholesaler_id, pcode, pcode_name, barcode, imgtiny_url, imgbig_url, conv, uom_a, uom_b, cat_a, cat_b, cat_c, subcat_c,idx_pagination)
                              VALUES('${wholesaler_id}', '${pcode}', '${name}', '${barcode}', '${imgtiny_url}', '${imgbig_url}', ${conv ? conv : null}, '${uom_a}', '${uom_b}', '${cat_a}', '${cat_b}', '${cat_c}', '${subcat_c}', nextval('grosir_pintar.product_idx_pagination_seq'::regclass));`
    let deletePriceQuery = `DELETE FROM grosir_pintar.price WHERE wholesaler_id='${wholesaler_id}' AND pcode='${pcode}'`
    let insertPriceQuery = `INSERT INTO grosir_pintar.price
                            (wholesaler_id, pcode, price, basic_price, margin_price,min_qty,discount)
                            VALUES ${valuePrice}`
    
    let insertStockQuery = `INSERT INTO grosir_pintar.pos_product_stock
                            (wholesaler_id, pcode, stock,allow_minus,created_by,created_at)
                            VALUES('${wholesaler_id}', '${pcode}', ${stock},true,'${actor}','${moment().format("YYYY-MM-DD HH:mm:ss")}')`

                            

    let insertLogsQuery = await insertLogStock({wholesaler_id,pcode,stock,actor,transaction,description});
    // `INSERT INTO grosir_pintar.pos_stock_logs
    //                         (wholesaler_id,pcode,stock_type,stock_qty,"transaction",description,created_at,created_by)
    //                         VALUES('${wholesaler_id}', '${pcode}','IN',${stock},'ADMIN GROSIR','TAMBAH PRODUK BARU' ,'${moment().format("YYYY-MM-DD HH:mm:ss")}','${actor}')`
    
    arrayQuery.push(insertProductQuery);
    arrayQuery.push(deletePriceQuery);
    arrayQuery.push(insertPriceQuery);
    arrayQuery.push(insertStockQuery);
    arrayQuery.push(insertLogsQuery.result);
    let result_transaction = await sqlConTrx(arrayQuery);

    if(result_transaction !== 'finished') throw new Error(result_transaction);
    
    return {
      error: false,
      result: result_transaction,
    };

  } catch (error) {
    console.log(error.message)
    return {
      error: error.message,
      result: false,
    };
  }
}

const insertLogStock = async(params) => {

  const {wholesaler_id
        ,pcode
        ,stock
        ,actor
        ,transaction
        ,description
        ,type
        ,supplier} = params

        

  if(!transaction) throw new Error("Transaksi harus diisi untuk mengetahui darimana proses dilakukan");
  if(!description) throw new Error("Deskripsi harus diisi untuk mengetahui aktifitas yang dilakukan");
  try {
    let insertLogsQuery = `INSERT INTO grosir_pintar.pos_stock_logs
                            (wholesaler_id,pcode,stock_type,stock_qty,"transaction",description,created_at,created_by,supplier)
                            VALUES('${wholesaler_id}', '${pcode}','${type ? type : 'IN'}',${stock},'${transaction}','${description}' ,'${moment().format("YYYY-MM-DD HH:mm:ss")}','${actor}','${supplier}')`;

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

const M_updateDetailMasterProduct = async(params) =>{
  try {
    const {pcode,name,imgbig_url,cat_a,cat_b,subcat_c} = params;

    if(!pcode) throw new Error("Kode produk tidak ditemukan!");
    if(!name) throw new Error("Nama produk tidak boleh kosong!");
    if(!imgbig_url) throw new Error("Foto produk tidak boleh kosong!");

    let checkQuery = `SELECT * FROM grosir_pintar.mst_product WHERE name = '${name}' AND pcode<>'${pcode}'`;

    let data_exists = await sqlCon(checkQuery);

    if(data_exists.length > 0) throw new Error("Nama produk sudah ada, tolong ganti nama lain");

    let updateQuery = `UPDATE grosir_pintar.mst_product SET name='${name}',imgbig_url='${imgbig_url}',imgtiny_url='${imgbig_url}' `
    if(cat_a) updateQuery += ` ,cat_a='${cat_a}' `
    if(cat_b) updateQuery += ` ,cat_b='${cat_b}' `
    if(subcat_c) updateQuery += ` ,subcat_c='${subcat_c}' `

    updateQuery += ` WHERE pcode='${pcode}'`;

    let data_update = await sqlCon(updateQuery);

    return {
      error: false,
      result: [
        {
          status: "success",
        },
      ],
    };
  } catch (error) {
    return {
      error:error.message,
      result:false
    }
  }
}

const M_deleteProductGrosir = async(params) =>{
  try {
    const {wholesaler_id,pcode} = params;

    if(!wholesaler_id) throw new Error("Grosir tidak ditemukan");
    if(!pcode) throw new Error("Kode produk tidak ditemukan");

    arrayQuery = [];

    let deleteProductQuery = `DELETE FROM grosir_pintar.product WHERE wholesaler_id='${wholesaler_id}' AND pcode='${pcode}'`;

    let deleteProductStock = `DELETE FROM grosir_pintar.pos_product_stock WHERE wholesaler_id='${wholesaler_id}' AND pcode='${pcode}'`;

    arrayQuery.push(deleteProductQuery);
    arrayQuery.push(deleteProductStock);

    let result_transaction = await sqlConTrx(arrayQuery);

    if(result_transaction !== 'finished') throw new Error(result_transaction);
    
    return {
      error: false,
      result: result_transaction,
    };

  } catch (error) {
    console.log(error.message)
    return {
      error: error.message,
      result: false,
    };
  }
}
module.exports = {
  M_getAllProduk,
  M_getAllProdukCategory,
  M_getAllProdukSubCategory,
  M_getAllPrincipal,
  M_postStockAndPrice,
  M_getAllUom,
  M_updateProductConversion,
  M_getAllProductMaster,
  M_postNewProductGrosir,
  M_updateDetailMasterProduct,
  M_deleteProductGrosir
};
