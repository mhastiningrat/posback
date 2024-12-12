const { uploadImageToS3, removeImageFromS3 } = require("../../../utils/AWS");
const { response } = require("../../../utils/response");
const {
  M_getAllProduk,
  M_getAllProdukCategory,
  M_getAllProdukSubCategory,
  M_getAllPrincipal,
  M_postStockAndPrice,
  M_updateProductConversion,
  M_getAllUom,
  M_getAllProductMaster,
  M_postNewProductGrosir,
  M_updateDetailMasterProduct,
  M_deleteProductGrosir,
} = require("../models/MasterProdukModels");

const C_getAllProductMaster = async (req, res) => {
  try {
    const { error, result } = await M_getAllProductMaster(req.query);

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
};

const C_getAllProduk = async (req, res) => {
  try {

    const { error, result } = await M_getAllProduk(req.query);

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
};

const C_getAllProdukCategory = async (req, res) => {
  try {
    const { error, result } = await M_getAllProdukCategory();

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
};

const C_getAllProdukSubCategory = async (req, res) => {
  try {
    const params = req.query;
    const { error, result } = await M_getAllProdukSubCategory(params);

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
};

const C_getAllPrincipal = async (req, res) => {
  try {
    const { error, result } = await M_getAllPrincipal();

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
};

const C_postStockAndPrice = async (req, res) => {
  try {
    const { error, result } = await M_postStockAndPrice(req.body);

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
};

const C_getAllUom = async (req, res) => {
  try {
    const { error, result } = await M_getAllUom();

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
};

const C_updateProductConversion = async (req, res) => {
  try {
    console.log("masuk sini");
    const { error, result } = await M_updateProductConversion(req.body);

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
};

const C_postNewProductGrosir = async (req,res) => {
  try {
    console.log("=== ADD NEW PRODUCT ===")
    const {error,result} = await M_postNewProductGrosir(req.body);

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    console.log(error.message)
    return response.errorSystem(res, error);
  }
};

const C_uploadProductImage = async(req,res) => {

  try {
    req.file.type = 'mst-product'
    const {error,result} = await uploadImageToS3(req.file);
    // console.log("===== error ========")
    // console.log(data)
    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    console.log(error.message)
    return response.errorSystem(res, error);
  }
}

const C_removeProductImage = async(req,res) =>{
  try {

    const {error,result} = await removeImageFromS3(req.body);

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    console.log(error.message)
    return response.errorSystem(res, error);
  }
}

const C_updateDetailMasterProduct = async (req,res) => {
  try {
    const {error,result} = await M_updateDetailMasterProduct(req.body);

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    console.log(error.message)
    return response.errorSystem(res, error);
  }
}

const C_deleteProductGrosir = async(req,res) => {
  try {
    const {error,result} = await M_deleteProductGrosir(req.body);

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
}

module.exports = {
  C_getAllProductMaster,
  C_getAllProduk,
  C_getAllProdukCategory,
  C_getAllProdukSubCategory,
  C_getAllPrincipal,
  C_postStockAndPrice,
  C_getAllUom,
  C_updateProductConversion,
  C_postNewProductGrosir,
  C_uploadProductImage,
  C_removeProductImage,
  C_updateDetailMasterProduct,
  C_deleteProductGrosir
};
