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


        return res.status(200).json(process.env.DB_HOST);

    } catch (error) {
        return res.status(400).json(error.message);
    }

}

const postAllStocks = async (req, res) => {

    try {
        const response = await instaciaAxiosBrapi.get(`list?sortBy=volume&sortOrder=desc&limit=2500`)
        const stocks = response.data.stocks;
        const allStocks = [];

        stocks.forEach(stock => {
            const actualStock = { 'ticker': stock.stock, 'name': stock.name, 'logo': stock.logo }
            allStocks.push(actualStock);
        });

        await knex('stocks').insert(allStocks).returning('*');
        return res.status(200).json('Todas as ações foram atualizadas!');

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = { precoAtual, postAllStocks }