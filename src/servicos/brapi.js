const axios = require('axios');

const instaciaAxiosBrapi = axios.create({
    baseURL: 'https://brapi.ga/api/quote/',
});

module.exports = instaciaAxiosBrapi;