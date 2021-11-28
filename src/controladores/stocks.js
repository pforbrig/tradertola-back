const knex = require('../conexao');
const instaciaAxiosBrapi = require('../servicos/brapi');

const buyStock = async (req, res) => {
    const { ticker, quantity } = req.body;

    try {
        const response = await axios.get(`https://brapi.ga/api/quote/${ticker}`)

        const actualPrice = response.data.results[0].regularMarketPrice;

    } catch (error) {

    }
}

const precoAtual = async (req, res) => {
    const { ticker } = req.body;

    try {

        const response = await instaciaAxiosBrapi.get(`${ticker}`)

        const preco = response.data.results[0].regularMarketPrice


        return res.status(200).json(preco);

    } catch (error) {
        return res.status(400).json(error.message);
    }

}

const postAllStocks = async (req, res) => {

    try {
        const response = await instaciaAxiosBrapi.get(`list?sortBy=volume&sortOrder=desc&limit=1`)
        const stocks = response.data.stocks;
        const allStocks = [];

        stocks.forEach(stock => {
            const actualStock = { 'ticker': stock.stock, 'name': stock.name, 'logo': stock.logo }
            allStocks.push(actualStock);
            console.log(allStocks);
        });

        await knex('stock').insert(allStocks);
        return res.status(200).json(allStocks);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = { precoAtual, postAllStocks }