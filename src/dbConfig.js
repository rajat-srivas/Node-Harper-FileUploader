const hyperive = require('harperive');
require('dotenv').config();

const dbConfig = {
    harperHost: process.env.DB_InstanceUrl,
    username: process.env.DB_Username,
    password: process.env.DB_Password,
    schema: process.env.DB_Schema
};
const Client = hyperive.Client;
const dbSetter = new Client(dbConfig);

module.exports = dbSetter;