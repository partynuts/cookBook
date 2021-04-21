const Recipe = module.exports = {

  createRecipe(recipeTitle, recipeDescription, ingredients, duration, categoryId) {
    return global.client.query(`
                INSERT into recipes (title, description, ingredients, duration, category)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
      `, [recipeTitle, recipeDescription, ingredients, duration, categoryId]
    )
      .then(res => res.rows[0])
  },

  getAllRecipes() {
    return global.client.query(`
        SELECT *
        FROM recipes
    `)
      .then(res => res.rows)
  },

  getRecipeById(recipeId) {
    return global.client.query(`
                SELECT *
                FROM recipes
                WHERE id = $1
      `, [recipeId]
    )
      .then(res => res.rows[0])
  },

  UpdateRecipe(recipeId, recipeTitle, recipeDescription, ingredients, duration, categoryId) {
    return global.client.query(`
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

  removeRecipe(recipeId) {
    return global.client.query(`
                DELETE
                FROM recipes
                WHERE id = $6
      `, [recipeTitle, recipeDescription, ingredients, duration, categoryId, recipeId]
    )
      .then(res => res.rows[0])
  },

  getRecipeByBuzzWord(buzzWord) {
    return global.client.query(`
        Select *
        FROM recipes
        WHERE title ILIKE '%$1%' OR descriptio ILIKE '%$1%'
    `, [buzzWord]
    )
      .then(res => res.rows)
  }

};


