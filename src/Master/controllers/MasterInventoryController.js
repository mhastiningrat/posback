const { response } = require("../../../utils/response");
const {
  getAllProduk,
  getAllProdukCategory,
} = require("../models/MasterProdukModels");

const allProduk = async (req, res) => {
  try {
    const { wholesaler_id, page, kode_produk, nama_produk, kategori } =
      req.query;

    let params = {
      wholesaler_id,
      page,
      kode_produk,
      nama_produk,
      kategori,
    };

    const { error, result } = await getAllProduk(params);

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
};

const allCategory = async (req, res) => {
  try {
    const { error, result } = await getAllProdukCategory();

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
};

module.exports = {
  allProduk,
  allCategory,
};
