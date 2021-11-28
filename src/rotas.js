const express = require('express');
const stocks = require('./controladores/stocks');

const rotas = express();

//stocks
rotas.get('/precoatual', stocks.precoAtual);
rotas.post('/allstocks', stocks.postAllStocks);

module.exports = rotas;