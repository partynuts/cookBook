module.exports = (client) => {

  return {
    createCategory(categoryTitle, categoryDescription) {
      return client.query(`
                  INSERT into categories (categoryTitle, categoryDescription)
                  VALUES ($1, $2)
                  RETURNING *
        `, [categoryTitle, categoryDescription]
      )
        .then(res => res.rows[0])
    },

    getAllCategories() {
      return client.query(`
          SELECT *
          FROM categories
      `)
        .then(res => res.rows);
    },

    getCategoryById(categoryId) {
      return client.query(`
                  SELECT *
                  FROM categories
                  WHERE id = $1
        `, [categoryId]
      )
        .then(res => res.rows[0]);
    },

    getCategoryByTitle(categoryTitle) {
      return client.query(`
                  SELECT *
                  FROM categories
                  WHERE Lower(categoryTitle) = Lower($1)
        `, [categoryTitle]
      )
        .then(res => res.rows[0])
    },

    updateCategory(categoryId, categoryTitle, categoryDescription) {
      return client.query(`
                  UPDATE categories
                  SET categoryTitle       = $1,
                      categoryDescription = $2
                  WHERE id = $3
                  RETURNING *
        `, [categoryTitle, categoryDescription, categoryId]
      )
        .then(res => res.rows[0])
    },

    deleteCategory(categoryId) {
      return client.query(`
                  DELETE
                  FROM categories
                  WHERE id = $1
        `, [categoryId]
      )
        .then(res => res[0])
    },

    deleteCategoryByTitle(categoryTitle) {
      return client.query(`
                  DELETE
                  FROM categories
                  WHERE categoryTitle = $1
        `, [categoryTitle]
      )
        .then(res => res[0])
    }
  }
};
