const yup = require('./yupConfig');

const editProfileSchema = yup.object().shape({
    email: yup.string().email(),
});

module.exports = editProfileSchema;