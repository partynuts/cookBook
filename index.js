const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const models = require('./src/models');

app.use(bodyParser.json());
const server = app.listen(port, () => console.log(`cook book app listening on port ${port}`));

module.exports = server;
// console.log(models.Category.getAllCategories().then(res => console.log(res)));
