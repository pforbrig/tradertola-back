const express = require('express');
const stocks = require('./controllers/stocks');
const users = require('./controllers/users');
const login = require('./controllers/login');
const tournaments = require('./controllers/tournaments');
const loginFilter = require('./filters/loginFilter');

const routes = express();

// register user
routes.post('/newuser', users.registerUser);

// login
routes.post('/login', login.login);

//filtros
routes.use(loginFilter);

// obter e atualizar perfil do usuario logado
routes.get('/profile', users.getProfile);
routes.put('/profile', users.editProfile);

//stocks
routes.get('/actualprice', stocks.actualPrice);
routes.post('/allstocks', stocks.postAllStocks);

//tournaments
routes.post('/createtournament', tournaments.createTournament);
routes.post('/entertournament/:id', tournaments.enterTournament);

module.exports = routes;