const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const dbClient = require('./src/models');
const categoryController = require('./src/controllers/category-controller');
const recipeController = require('./src/controllers/recipe-controller');


  app.use(bodyParser.json());
categoryController(app, dbClient.Category);
recipeController(app, dbClient.Recipe);
module.exports = app;


// module.exports = server;
// console.log(models.Category.getAllCategories().then(res => console.log(res)));
