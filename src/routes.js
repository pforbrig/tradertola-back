const express = require('express');
const stocks = require('./controllers/stocks');
const users = require('./controllers/users');

const routes = express();

// register user
routes.post('/newuser', users.registerUser);

//stocks
routes.get('/actualprice', stocks.actualPrice);
routes.post('/allstocks', stocks.postAllStocks);

module.exports = routes;