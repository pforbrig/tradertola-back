const knex = require('../connection');
const brapAxiosInstance = require('../services/brapi');
const { format } = require('date-fns');
const { actualPrice } = require('./stocks');

const createTournament = async (req, res) => {
    const { name, type, endDate, startMoney, maxStocks } = req.body;
    const { id } = req.user;

    try {

        const createdTournament = await knex('tournaments').insert({
            name,
            type,
            createdat: new Date(),
            user_id: id,
            enddate: endDate,
            startmoney: (startMoney * 100),
            maxstocks: maxStocks,
        }).returning('*');

        if (!createdTournament) {
            return res.status(400).json("Não foi possivel criar o torneio.");

        }
        res.status(200).json(createdTournament[0]);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const enterTournament = async (req, res) => {
    const { id } = req.params;

    try {
        const actualTournament = await knex('tournaments').where({ id }).first();

        if (!actualTournament) {
            return res.status(404).json('O torneio não existe.');
        }

        const userInTournament = await knex('tournaments').where({ id, user_id: req.user.id });

        if (userInTournament.length > 0) {
            return res.status(404).json('Você já está nesse torneio.');
        }

        const newPortfolio = await knex('userdiaryportfolios').insert({
            tournament_id: id,
            user_id: req.user.id,
            portfoliovalue: 0,
            date: new Date(),
            money: actualTournament.startmoney,
        }).returning('*');

        if (!newPortfolio) {
            return res.status(400).json("Não foi possivel entrar no torneio.");

        }
        res.status(200).json("Você entrou no torneio com sucesso!");

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = { createTournament, enterTournament }