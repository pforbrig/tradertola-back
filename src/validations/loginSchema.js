const yup = require('./yupConfig');

const loginSchema = yup.object().shape({
    email: yup.string().required().email(),
    password: yup.string().required()
});

module.exports = loginSchema;