const yup = require('./yupConfig');

const registerUserSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().required()
});

module.exports = registerUserSchema;