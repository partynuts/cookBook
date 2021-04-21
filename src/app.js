const { Client } = require('pg');

module.exports = async () => {

  global.client = new Client();
  global.client.connect();
};

