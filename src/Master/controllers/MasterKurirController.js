const { response } = require("../../../utils/response");
const { getAllKurir } = require("../models/MasterKurirModels");

const AllKurir = async (req, res) => {
  try {
    let params = req.params;

    const { error, result } = await getAllKurir(params);

    if (error) {
      return response.error(res, error.message);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error.message);
  }
};

module.exports = {
AllKurir
}
