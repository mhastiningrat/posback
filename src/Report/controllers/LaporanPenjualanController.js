const { response } = require("../../../utils/response");
const {
  s_getLaporanPenjualan,
  s_getLaporanPenjualanFromLogs,
  s_exportLaporanPenjualan,
} = require("../services/LaporanPenjualanService");
const excelJS = require("exceljs");
const moment = require("moment");
const fs = require("fs");

const c_getLaporanPenjualan = async (req, res) => {
  try {
    // const {error,result} = await s_getLaporanPenjualan(req.body);
    const { error, result } = await s_getLaporanPenjualanFromLogs(req.body);

    if (error) {
      return response.error(res, error);
    }

    response.success(res, result);
  } catch (error) {
    return response.errorSystem(res, error);
  }
};

const c_exportlaporanPenjualan = async (req, res) => {
  try {
    const { error, result } = await s_exportLaporanPenjualan(req.query);
    console.log(result)
    const workbook = new excelJS.Workbook(); // Create a new workbook
    const worksheet = workbook.addWorksheet("My Users"); // New Worksheet
    const path = "./files"; // Path to download excel
    // Column for data in excel. key must match data key
    worksheet.columns = [
      { header: "Tanggal Transaksi", key: "order_date", width: 20, alignment: "center" },
      { header: "Order No", key: "order_no", width: 30 },
      { header: "Tipe Transaksi", key: "tipe", width: 20 },
      { header: "Total Transaksi", key: "amount", width: 20 },
    ];
    // Looping through User data
    let counter = 1;
    console.log("result");
    console.log(result);
    console.log("result");
    result[0].result.transaksi.forEach((i) => {
      worksheet.addRow(i); // Add data in worksheet
      counter++;
    });
    worksheet.addRow(['','','Total Penjualan',result[0].result.total_penjualan])
    worksheet.addRow(['','','Total Return',result[0].result.total_return]);
    worksheet.addRow(['','','Subtotal',result[0].result.net_total]);
    worksheet.addRow(['','','Total Modal',result[0].result.total_modal]);
    worksheet.addRow(['','','Keuntungan',result[0].result.keuntungan]);

    let key = [`C${counter+1}`,`D${counter+1}`,`C${counter+2}`,`D${counter+2}`,`C${counter+3}`,`D${counter+3}`,`C${counter+4}`,`D${counter+4}`,`C${counter+5}`,`D${counter+5}`];
    for(let i of key){
      worksheet.getCell(i).fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor: { argb:'84d17b' },
        bgColor: { argb:'84d17b' }
      };
    }
    // Making first line in excel bold
    worksheet.getRow(1,counter+1,counter+2,counter+3,counter+4).eachCell((cell) => {
      cell.font = { bold: true };
    });

    let downloadCsvPath = `${path}/Laporan_Penjualan_${moment().format("YYYYMMDD_HHmmss")}.xlsx`;

    await workbook.xlsx
      .writeFile(
        downloadCsvPath
      )
      .then(() => {
        res.download(
            downloadCsvPath,
          (err) => {
            if (err) {
              console.log(err);
            } else {
              fs.unlink(downloadCsvPath, (err) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log(downloadCsvPath);
                }
              });
            }
          }
        );
      });
  } catch (error) {
    return response.errorSystem(res, error);
  }
};

module.exports = {
  c_getLaporanPenjualan,
  c_exportlaporanPenjualan,
};
