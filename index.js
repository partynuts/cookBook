const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const models = require('./src/models');

app.use(bodyParser.json());
app.listen(port, () => console.log(`cook book app listening on port ${port}`));

// console.log(models.Category.getAllCategories().then(res => console.log(res)));
