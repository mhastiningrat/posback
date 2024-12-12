const { response } = require("../../../utils/response");
const { getAllVoucher } = require("../model/VoucherModel");

const allVoucher = async (req, res) => {
  try {
    let params = req.body;

    const { error, result } = await getAllVoucher(params);
    console.log(result)
    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
};

module.exports = {
    allVoucher
}
