const knex = require('../connection');
const brapAxiosInstance = require('../services/brapi');

const buyStock = async (req, res) => {
    const { ticker, quantity, tournament_id } = req.body;
    const { id } = req.user;
    let { money, portfoliovalue, stocks } = req.portfolio;
    console.log(req.portfolio);

    try {

        const stock = await knex('stocks').where({ ticker }).first();

        if (money / 100 < (stock.price / 100) * quantity) {
            return res.status(400).json('Você não tem dinheiro para comprar esssas ações!');
        }

        const userOrder = await knex('userorders').insert({
            user_id: id,
            tournament_id,
            stock_ticker: ticker,
            quantity,
            unitvalue: stock.price,
            date: new Date(),
            type: 'buy'
        });

        if (!userOrder) {
            return res.status(400).json('A ordem de compra não foi criada!');
        }

        const userHasStock = stocks.find(stock => stock.stock_ticker === ticker);

        if (userHasStock) {
            const updateStock = await knex('userstocks')
                .where({ id: userHasStock.id })
                .update({
                    quantity: quantity + userHasStock.quantity,
                    avgprice: (userHasStock.quantity * userHasStock.avgprice + quantity * stock.price) / (userHasStock.quantity + quantity)
                })

            if (!updateStock) {
                return res.status(400).json('Erro ao criar ordem de compra!');
            }

        } else {
            const newUserStock = await knex('userstocks')
                .insert({
                    user_id: id,
                    tournament_id,
                    stock_ticker: ticker,
                    quantity,
                    avgprice: stock.price,
                });
            if (!newUserStock) {
                return res.status(400).json('Erro ao criar ordem de compra!');
            }
        };


        const editUserDiaryPortfolio = await knex('userdiaryportfolios')
            .where({ id: req.portfolio.id })
            .update({
                money: money - quantity * stock.price,
                portfoliovalue: portfoliovalue + quantity * stock.price
            });
        if (!editUserDiaryPortfolio) {
            return res.status(400).json('Erro ao criar ordem de compra!');
        }


        return res.status(200).json("A ordem de compra foi enviada com sucesso!");


    } catch (error) {
        return res.status(400).json(error.message);
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
        if (newStocks.length > 0) {
            await knex('stocks').insert(newStocks).returning('*');
        };

        return res.status(200).json('Todas as ações foram atualizadas!');

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = { actualPrice, postAllStocks, buyStock }