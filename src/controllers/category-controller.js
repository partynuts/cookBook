const { Router } = require("express");
const controller = Router();
const { createCategory } = require('../models.category-model');

controller.post('/api/categories', async (req, res) => {
  console.log("CREATING CATEGORY", req.body);
  const foundCategory = await getCategoryByTitle(req.body.categoryTitle);
  if (foundCategory) {
    return res.status(400).json({ errorMsg: 'Diese Kategorie gibt es bereits.' });
  }
  const newCategory = await createCategory(req.body.categoryTitle, req.body.categoryDescription);
  return res.status(201).json(newCategory);
});
