const axios = require('axios');

const brapiAxiosInstance = axios.create({
    baseURL: 'https://brapi.ga/api/quote/',
});

module.exports = brapiAxiosInstance;