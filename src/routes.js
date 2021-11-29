const express = require('express');
const stocks = require('./controladores/stocks');

const routes = express();

//stocks
routes.get('/actualprice', stocks.actualPrice);
routes.post('/allstocks', stocks.postAllStocks);

module.exports = routes;