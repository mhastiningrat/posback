const { response } = require("../../../utils/response");
const { getAllCustomer, getAllDelivery } = require("../models/TransaksiModels");

const customer = async (req, res) => {
  try {
    let params = req.query;

    const { error, result } = await getAllCustomer(params);

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
};

const dataProsesTransaksi = async(req,res) =>{
  try {
    let params = req.body;

    const {error,result} = await getAllDelivery(params);

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
}

module.exports = {
  customer,
  dataProsesTransaksi
};
