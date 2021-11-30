const knex = require('../connection');
const bcrypt = require('bcrypt');
const registerUserSchema = require('../validations/registerUserSchema');
const editProfileSchema = require('../validations/editProfileSchema');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        await registerUserSchema.validate(req.body);

        const emailExists = await knex('users').where({ email }).first();

        if (emailExists) {
            return res.status(400).json("Esse email já está cadastrado.");
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await knex('users').insert({
            name,
            email,
            password: encryptedPassword,
        }).returning('*');

        if (!user) {
            return res.status(400).json("O usuário não foi cadastrado.");
        }

        return res.status(200).json(user[0]);

    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const getProfile = async (req, res) => {
    return res.status(200).json(req.user);
};

const editProfile = async (req, res) => {
    let { name, email, password, cpf, telephone } = req.body;
    const { id } = req.user;

    if (!name && !email && !password && !cpf && !telephone) {
        return res.status(400).json('Você deve informar ao menos um campo para atualizar');
    }

    try {
        const userExists = await knex('users').where({ id }).first();

        if (!userExists) {
            return res.status(404).json('Usuario não encontrado');
        }

        if (password) {
            password = await bcrypt.hash(password, 10);
        }

        if (email && email !== req.user.email) {
            await editProfileSchema.validate(req.body);

            const userEmailExists = await knex('users').where({ email }).first();

            if (userEmailExists) {
                return res.status(400).json('O email informado já está cadastrado.');
            }
        }

        const editedUser = await knex('users')
            .where({ id })
            .update({
                name,
                email,
                password,
                cpf,
                telephone
            });

        if (!editedUser) {
            return res.status(400).json("O perfil não foi editado");
        }
        const response = await knex('users').where({ id }).first();

        return res.status(200).json(response);

    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    registerUser,
    getProfile,
    editProfile
}