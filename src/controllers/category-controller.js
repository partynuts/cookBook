const { Router } = require("express");
const controller = Router();

controller.post('/api/categories', async (req, res) => {
  console.log("CREATING CATEGORY")
});
