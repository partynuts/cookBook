module.exports = function recipeController(app, Recipe) {
  app.post('/api/recipes', async (req, res) => {
    if (!req.body.recipeTitle || !req.body.recipeDescription || !req.body.ingredients || !req.body.categoryId) {
      return res.status(400).json({ errorMsg: 'Bitte füllen sie alle Felder aus.' })
    }
    const newRecipe = await Recipe.createRecipe(req.body)
    return res.status(201).json(newRecipe)
  });

  app.get('/api/recipes', async (req, res) => {
    if (req.query.search) {
      console.log('QUERY SEARCH: ', req.query.search)
      const foundRecipe = await Recipe.getRecipesByBuzzWords(req.query.search);
      if (foundRecipe && foundRecipe.length > 0) {
        console.log("FOUND!")
        return res.status(200).json(foundRecipe)
      }
      console.log("NOT FOUND")
      const allRecipes = await Recipe.getAllRecipes();

      return res.status(200).json(allRecipes);
    }
    const allRecipes = await Recipe.getAllRecipes();

    return res.status(200).json(allRecipes);
  });

  app.get('/api/recipes/:id', async (req, res) => {
    try {
      const foundRecipe = await Recipe.getRecipeById(req.params.id);
      if (!foundRecipe) {
        return res.status(404).json({ errorMsg: 'Wir haben leider nichts gefunden.' });
      }

      return res.status(200).json(foundRecipe);
    } catch (e) {
      console.log("ERROR", e);
      return res.status(404).json({ errorMsg: 'Wir haben leider nichts gefunden.' });
    }
  });

  app.get('/api/recipes/category/:categoryId', async (req, res) => {
    try {
      const foundRecipes = await Recipe.getAllRecipesOfOneCategory(req.params.categoryId);
      console.log('FOUND', foundRecipes, req.params.categoryId);

      if (!foundRecipes || foundRecipes.length <= 0) {
        return res.status(200).json({ msg: 'Es gibt noch keine Rezepte in dieser Kategorie.' })
      }

      return res.status(200).json(foundRecipes);
    } catch (e) {
      console.log('ERROR', e);
      return res.status(404).json({ errorMsg: 'Diese Kategorie gibt es nicht.' })
    }
  });

  app.put('/api/recipes/:id', async (req, res) => {
    const { ingredients, recipeTitle, recipeDescription, categoryId } = req.body;
    try {
      const foundRecipe = await Recipe.getRecipeById(req.params.id);
      if (!foundRecipe) {
        return res.status(404).json({ errorMsg: 'Wir haben leider nichts gefunden.' });
      }
      if (!req.body || !Array.isArray(ingredients) || typeof recipeTitle !== 'string' || typeof recipeDescription !== 'string' || typeof categoryId !== 'string') {

        return res.status(400).json({ errorMsg: 'Bitte geben sie einen gültigen Titel, Beschreibung, Zutaten und Kategorie an.' })
      }
      const updatedRecipe = await Recipe.updateRecipe(req.params.id, req.body);

      return res.status(200).json(updatedRecipe);
    } catch (e) {
      console.log('ERROR', e);
      return res.status(404).json({ errorMsg: 'Dieses Rezept gibt es nicht.' });
    }
  });

  app.delete('/api/recipes/:id', async (req, res) => {
    try {
      const foundRecipe = await Recipe.getRecipeById(req.params.id);

      if (!foundRecipe) {
        return res.status(404).json({ errorMsg: 'Dieses Rezept gibt es nicht.' });
      }

      await Recipe.deleteRecipe(req.params.id);
      return res.status(200).json({ successMsg: 'Rezept wurde erfolgreich gelöscht.' })
    } catch (e) {
      console.log('ERROR', e);
      return res.status(404).json({ errorMsg: 'Dieses Rezept gibt es nicht.' });
    }

  });
};
