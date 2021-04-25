const { Client } = require('pg');
const client = new Client();
client.connect();

const Category = require('./category-model')(client);
const Recipe = require('./recipe-model')(client);

module.exports = {
  Category,
  Recipe
};
