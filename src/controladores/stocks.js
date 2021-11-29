const knex = require('../connection');
const brapAxiosInstance = require('../services/brapi');

const buyStock = async (req, res) => {
    const { ticker, quantity } = req.body;

    try {
        const response = await axios.get(`https://brapi.ga/api/quote/${ticker}`)

        const actualPrice = response.data.results[0].regularMarketPrice;

    } catch (error) {

    }
}

const actualPrice = async (req, res) => {
    const { ticker } = req.body;

    try {

        const response = await brapAxiosInstance.get(`${ticker}`)

        const price = response.data.results[0].regularMarketPrice


        return res.status(200).json(price);

    } catch (error) {
        return res.status(400).json(error.message);
    }

}

const postAllStocks = async (req, res) => {

    try {
        const response = await brapAxiosInstance.get(`list?sortBy=volume&sortOrder=desc&limit=2500`)
        const stocks = response.data.stocks;
        const allStocks = await knex('stocks');
        const newStocks = [];

        stocks.forEach(stock => {
            const actualStock = { 'ticker': stock.stock, 'name': stock.name, 'logo': stock.logo, 'price': Math.round(stock.close * 100) }
            const stockExists = allStocks.find(stock => stock.ticker === actualStock.ticker);
            if (!stockExists) {
                newStocks.push(actualStock);
            }
        });
        console.log(newStocks)
        if (newStocks.length > 0) {
            await knex('stocks').insert(newStocks).returning('*');
        };

        return res.status(200).json('Todas as ações foram atualizadas!');

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = { actualPrice, postAllStocks }