const { response } = require("../../../utils/response");
const { s_postTransaksiReturn } = require("../services/TransaksiReturnService");

const c_postTransaksiReturn = async (req, res) => {
  try {
    const { error, result } = await s_postTransaksiReturn(req.body);

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
};

module.exports = {
  c_postTransaksiReturn,
};
