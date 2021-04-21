const Umzug = require('umzug');
const UmzugStorage = require('umzug-pg-storage');

const Category = require('./category-model');
const Recipe = require('./recipe-model');

module.exports = {
  Category,
  Recipe,

  sync: async () => {
    const storage = new UmzugStorage({ client: global.client });
    const umzug = new Umzug({ storage });

    await umzug.up();
  }
};
