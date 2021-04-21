const App = require('./src/app');
const Umzug = require('umzug');
const umzug = new Umzug({ /* ... options ... */ });
const models = require('./src/models');

(async () => {
  const app = await App();
  await models.sync();
})();
