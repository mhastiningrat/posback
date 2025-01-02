const { response } = require("../../../utils/response");
const { s_getPosCustomer, s_addPosCustomer, s_updatePosCustomer } = require("../services/MasterCustomerService");

const c_getPosCustomer = async (req, res) => {
  try {
    // console.log(req.originalUrl);
    const { error, result } = await s_getPosCustomer(req.query);

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
};

const c_addPosCustomer = async (req, res) => {
    try {
      const { error, result } = await s_addPosCustomer(req.body);
  
      if (error) {
        return response.error(res, error);
      }
  
      response.success(res, result);
    } catch (error) {
      return response.errorSystem(res, error);
    }
};

const c_updatePosCustomer = async (req, res) => {
  try {
    const { error, result } = await s_updatePosCustomer(req);

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
};

module.exports = {
    c_getPosCustomer,
    c_addPosCustomer
}
