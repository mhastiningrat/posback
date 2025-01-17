const { response } = require("../../../utils/response");
const { s_getLaporanStock, s_exportLaporangStock } = require("../services/LaporanStockService");
const excelJS = require("exceljs");
const moment = require("moment");
const fs = require("fs");
const { s_exportLaporanPenjualan } = require("../services/LaporanPenjualanService");
const c_getLaporanStock = async(req,res) => {
    try {
        const {error,result} = await s_getLaporanStock(req.body);

        if (error) {
            return response.error(res, error);
        }

        response.success(res, result);
    } catch (error) {
        return response.errorSystem(res, error);
    }
}

const c_exportLaporanStock = async(req,res) => {
    try {
        const { error, result } = await s_exportLaporangStock(req.query);
    
        const workbook = new excelJS.Workbook(); // Create a new workbook
        const worksheet = workbook.addWorksheet("My Users"); // New Worksheet
        const path = "./files"; // Path to download excel
        // Column for data in excel. key must match data key
      
        worksheet.columns = [
          { header: "Kode Produk", key: "pcode", width: 10 },
          { header: "Nama", key: "pcode_name", width: 30 },
          { header: "Stock", key: "stock", width: 10 },
          { header: "Stock Masuk", key: "stock_in", width: 10 },
          { header: "Stock Keluar", key: "stock_out", width: 10 },
        ];
        // Looping through User data
        let counter = 1;
        console.log("result");
        console.log(result);
        console.log("result");
        result.forEach((i) => {
          worksheet.addRow(i); // Add data in worksheet
          counter++;
        });
        // Making first line in excel bold
        worksheet.getRow(1).eachCell((cell) => {
          cell.font = { bold: true };
        });
    
        let downloadCsvPath = `${path}/Laporan_Stock_${moment().format("YYYYMMDD_HHmmss")}.xlsx`;
    
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
}

module.exports = {
    c_getLaporanStock,
    c_exportLaporanStock
}   