const knex = require('../connection');
const bcrypt = require('bcrypt');
//const schemaCadastroUsuario = require('../validacoes/schemaCadastroUsuario');
//const schemaAtualizarUsuario = require('../validacoes/schemaAtualizarUsuario');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        //await schemaCadastroUsuario.validate(req.body);

        const emailExists = await knex('users').where({ email }).first();

        if (emailExists) {
            return res.status(400).json("O email já existe");
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

        return res.status(200).json(usuario[0]);

    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const obterPerfil = async (req, res) => {
    return res.status(200).json(req.usuario);
};

const editarPerfil = async (req, res) => {
    let { nome, email, senha, cpf, telefone } = req.body;
    const { id } = req.usuario;

    if (!nome && !email && !senha && !cpf && !telefone) {
        return res.status(400).json('Você deve informar ao menos um campo para atualizar');
    }

    try {
        const usuarioExiste = await knex('users').where({ id }).first();

        if (!usuarioExiste) {
            return res.status(404).json('Usuario não encontrado');
        }

        if (senha) {
            senha = await bcrypt.hash(senha, 10);
        }

        if (email && email !== req.usuario.email) {
            await schemaAtualizarUsuario.validate(req.body);

            const emailUsuarioExiste = await knex('users').where({ email }).first();

            if (emailUsuarioExiste) {
                return res.status(400).json('O email informado já está cadastrado.');
            }
        }

        const usuarioEditado = await knex('users')
            .where({ id })
            .update({
                nome,
                email,
                senha,
                cpf,
                telefone
            });

        if (!usuarioEditado) {
            return res.status(400).json("O perfil não foi editado");
        }
        const resposta = await knex('users').where({ id }).first();

        return res.status(200).json(resposta);

    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    registerUser,
    obterPerfil,
    editarPerfil
}