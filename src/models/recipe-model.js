module.exports = (client) => {

  return {
    createRecipe(recipeTitle, recipeDescription, ingredients, duration, categoryId) {
      return client.query(`
                  INSERT into recipes (title, description, ingredients, duration, category)
                  VALUES ($1, $2, $3, $4, $5)
                  RETURNING *
        `, [recipeTitle, recipeDescription, ingredients, duration, categoryId]
      )
        .then(res => res.rows[0])
    },

    getAllRecipes() {
      return client.query(`
          SELECT *
          FROM recipes
      `)
        .then(res => res.rows)
    },

    getRecipeById(recipeId) {
      return client.query(`
                  SELECT *
                  FROM recipes
                  WHERE id = $1
        `, [recipeId]
      )
        .then(res => res.rows[0])
    },

    getAllRecipesOfOneCategory(categoryId) {
      return client.query(`
          SELECT *
          FROM recipes
          WHERE category = $1
      `, [categoryId])
        .then(res => res.rows)
    },

    updateRecipe(recipeId, recipeTitle, recipeDescription, ingredients, duration, categoryId) {
      return client.query(`
                  UPDATE recipes
                  SET title       = $1,
                      description = $2,
                      ingredients = $3,
                      duration    = $4,
                      category    = $5
                  WHERE id = $6
        `, [recipeTitle, recipeDescription, ingredients, duration, categoryId, recipeId]
      )
        .then(res => res.rows[0])
    },

    deleteRecipe(recipeId) {
      return client.query(`
                  DELETE
                  FROM recipes
                  WHERE id = $6
        `, [recipeTitle, recipeDescription, ingredients, duration, categoryId, recipeId]
      )
        .then(res => res.rows[0])
    },

    getRecipesByBuzzWords(buzzWord) {
      return client.query(`
                  Select *
                  FROM recipes
                  WHERE title ILIKE '%$1%'
                     OR description ILIKE '%$1%'
        `, [buzzWord]
      )
        .then(res => res.rows)
    }
  }
};


