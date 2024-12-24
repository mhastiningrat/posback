const { response } = require("../../../utils/response");
const { getAllCustomer, getAllDelivery } = require("../models/TransaksiModels");
const { s_postTransaksiJual, s_getAllDelivery, s_getAllCustomer } = require("../services/TransaksiService");

const c_getAllCustomer = async (req, res) => {
  try {

    const { error, result } = await s_getAllCustomer(req.query);

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
};

const c_getAllDelivery = async(req,res) =>{
  try {
    let params = req.body;

    const {error,result} = await s_getAllDelivery(params);

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
}

const c_postTransaksiJual = async (req,res) => {
  try {
    const {error,result} = await s_postTransaksiJual(req.body);

    if (error) {
      return response.error(res, error);
    }
    
    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
}

module.exports = {
  c_getAllCustomer,
  c_getAllDelivery,
  c_postTransaksiJual
};
