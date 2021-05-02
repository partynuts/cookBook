const secrets = require('../../secrets');
const { Client } = require('pg');
const client = new Client({
  user: secrets.USER,
  password: secrets.PW,
  database: secrets.DB
});
client.connect();

const Category = require('./category-model')(client);
const Recipe = require('./recipe-model')(client);

module.exports = {
  Category,
  Recipe
};