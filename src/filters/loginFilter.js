const knex = require('../connection');
const jwt = require('jsonwebtoken');

const loginFilter = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json('Você precisa fornecer um token para acessar esse recurso!');
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = jwt.verify(token, process.env.HASH_PASSWORD);

        const userExists = await knex('users').where({ id }).first();

        if (!userExists) {
            return res.status(404).json('Usuario não encontrado');
        }

        const { password, ...user } = userExists;

        req.user = user;

        next();

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = loginFilter;