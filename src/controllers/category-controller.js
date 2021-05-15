module.exports = function categoryController(app, Category) {
  app.post('/api/categories', async (req, res) => {
    const foundCategory = await Category.getCategoryByTitle(req.body.categoryTitle);
    if (foundCategory) {
      return res.status(400).json({ errorMsg: 'Diese Kategorie gibt es bereits.' });
    }
    const newCategory = await Category.createCategory(req.body.categoryTitle, req.body.categoryDescription);
    return res.status(201).json(newCategory);
  });

  app.get('/api/categories', async (req, res) => {
    if (req.query.search) {
      const foundCategory = await Category.getCategoryByTitle(req.query.search);
      if (foundCategory) {
        return res.status(200).json(foundCategory);
      }
      const allCategories = await Category.getAllCategories();

      return res.status(200).json(allCategories);
    }

    const allCategories = await Category.getAllCategories();

    return res.status(200).json(allCategories);
  });

  app.get('/api/categories/:categoryId', async (req, res) => {
    try {
      const foundCategory = await Category.getCategoryById(req.params.categoryId);
      if (!foundCategory) {
        return res.status(404).json({ errorMsg: 'Diese Kategorie gibt es nicht.' })
      }
      return res.status(200).json(foundCategory)
    } catch (e) {
      console.log('ERROR', e)
      return res.status(404).json({ errorMsg: 'Diese Kategorie gibt es nicht.' })
    }
  });

  app.put('/api/categories/:categoryId', async (req, res) => {
    const foundCategory = await Category.getCategoryById(req.params.categoryId);
    if (!foundCategory) {
      return res.status(404).json({ errorMsg: 'Diese Kategorie gibt es nicht.' })
    }
    if (Object.keys(req.body).length === 0 || Object.values(req.body).some(value => typeof value !== 'string')) {

      return res.status(400).json({ errorMsg: 'Bitte geben sie einen gültigen Titel und Beschreibung an.' })
    }

    const updatedCategory = await Category.updateCategory(req.params.categoryId, req.body.categoryTitle, req.body.categoryDescription);
    return res.status(200).json(updatedCategory)
  });

  app.delete('/api/categories/:categoryId', async (req, res) => {
    const foundCategory = await Category.getCategoryById(req.params.categoryId);

    if (!foundCategory) {
      return res.status(404).json({ errorMsg: 'Diese Kategorie gibt es nicht.' })
    }
    const deletedCategory = Category.deleteCategory(req.params.categoryId);
    return res.status(204).json(deletedCategory)
  });

  app.delete('/api/categories', async (req, res) => {
    const foundCategory = await Category.getCategoryByTitle(req.query.search);

    if (!foundCategory) {
      return res.status(404).json({ errorMsg: 'Diese Kategorie gibt es nicht.' })
    }
    const deletedCategory = await Category.deleteCategoryByTitle(req.query.search);

    return res.status(204).json(deletedCategory)
  })
};
