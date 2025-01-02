const { m_getProfitToday, m_getProductTerlaris, m_getProfitWeeks, m_getTransactionWeeks, m_getSalesChartByYears, m_getTransactionMonth, m_getProfitMonth, m_getProductTerlarisMonth } = require("../models/SalesDashboardModels");

const s_getSalesDashboard = async(params) => {
    try {
        let result = {};
        const dataProfitToday = await m_getProfitToday(params);

        result.profitToday = dataProfitToday.result ;

        const dataProdukTerlaris = await m_getProductTerlaris(params);
        result.produkTerlaris = dataProdukTerlaris.result ;

        const dataProdukTerlarisMonth = await m_getProductTerlarisMonth(params);
        result.produkTerlarisMonth = dataProdukTerlarisMonth.result ;

        const dataProfitWeeks = await m_getProfitWeeks(params);

        result.profitWeeks = dataProfitWeeks.result ;

        const dataTransactionWeeks = await m_getTransactionWeeks(params);

        result.transactionWeeks = dataTransactionWeeks.result ;

        const dataChartSalesYears = await m_getSalesChartByYears(params);
        result.salesChart = dataChartSalesYears.result[0].result ;

        const dataTransactionMonth = await m_getTransactionMonth(params);
        console.log(dataTransactionMonth)
        result.transactionMonth = dataTransactionMonth.result ;

        const dataProfitMonth = await m_getProfitMonth(params);
        result.profitMonth = dataProfitMonth.result ;


        console.log(result)
        return {
            error: false,
            result: result
        }
    } catch (error) {
        return {
            error: error.message,
            result: false
        }
    }
}

module.exports = {s_getSalesDashboard};