const knex = require('../connection');

const tournamentFilter = async (req, res, next) => {

    try {

        const tournamentPlayer = await knex('userdiaryportfolios').where({ user_id: req.user.id, tournament_id: req.body.tournament_id }).first();

        if (!tournamentPlayer) {
            return res.status(404).json('Você não faz parte desse torneio!');
        }

        let { user_id, tournament_id, date, ...portfolio } = tournamentPlayer;

        const userStocks = await knex('userstocks').where({ user_id: req.user.id, tournament_id: req.body.tournament_id });

        if (userStocks) {
            portfolio.stocks = userStocks
        }

        req.portfolio = portfolio;

        next();

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = tournamentFilter;