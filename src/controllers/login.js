const knex = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
//const schemaLogin = require('../validacoes/schemaLogin');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        //await schemaLogin.validate(req.body);

        const user = await knex('users').where({ email }).first();

        if (!user) {
            return res.status(404).json('Usuario não encontrado.');
        }

        const passwordOk = await bcrypt.compare(password, user.password);

        if (!passwordOk) {
            return res.status(400).json("Email e senha não conferem.");
        }

        const token = jwt.sign({ id: user.id }, process.env.HASH_PASSWORD, { expiresIn: '8h' });

        const { password: _, ...userData } = user;

        return res.status(200).json({
            user: userData,
            token
        });



    } catch (error) {
        return res.status(400).json(error.message);
    }
}
module.exports = {
    login
}