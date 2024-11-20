const { sqlCon } = require("../../../config/db_config");

const getAllProduk = async (params) => {
  try {

    let limit = 20;
    let offset = 0;
    const {wholesaler_id,kode_produk,kategori,nama_produk,page} = params
    if(!wholesaler_id){
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
                            ,mc.description as category 
                            ,pr.price
                            ,pr.basic_price
                            ,pps.stock
                            FROM grosir_pintar.product p 
                            LEFT JOIN grosir_pintar.mst_category mc ON mc.cat_a = p.cat_a
                            LEFT JOIN grosir_pintar.pos_product_stock pps ON (p.pcode = pps.pcode AND p.wholesaler_id = pps.wholesaler_id)
                            LEFT JOIN grosir_pintar.price pr ON (p.pcode = pr.pcode AND p.wholesaler_id = pr.wholesaler_id) `

    if (wholesaler_id) {
      productQuery += ` WHERE p.wholesaler_id = '${params.wholesaler_id}' `;
    }

    if (kode_produk){
      productQuery += ` AND p.pcode = '${kode_produk}' `
    }

    if (nama_produk){
      productQuery += ` AND p.pcode_name LIKE '%${nama_produk}%' OR p.p_alias LIKE '%${nama_produk}%' `
    }

    if (kategori){
      productQuery += ` AND p.cat_a = '${kategori}' `
    }

    productQuery += ` ORDER BY p.pcode_name ASC`;


    if(page){
      offset = (Number(page) - 1) * limit

      productQuery += ` LIMIT ${limit} OFFSET ${offset} `
    }

    let data_product = await sqlCon(productQuery);

    if (!data_product.rows) {
      throw new Error("Data product tidak ditemukan");
    }


    return {
      error: false,
      result: data_product.rows,
    };
  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
};

const getAllProdukCategory =  async(params) => {
  try {
    
    let categoryQuery = `SELECT * FROM grosir_pintar.mst_category ORDER BY description ASC`;

    let data_category = await sqlCon(categoryQuery);

    return {
      error: false,
      result: data_category.rows,
    };

  } catch (error) {
    return {
      error: error.message,
      result: false,
    };
  }
}

module.exports = {
    getAllProduk,
    getAllProdukCategory
}
