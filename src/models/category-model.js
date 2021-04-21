const Category = module.exports = {

  createCategory(categoryTitle, categoryDescription) {
    return global.cient.query(`
                INSERT into categories (categoryTitle, categoryDescription)
                VALUES ($1, $2)
                RETURNING *
      `, [categoryTitle, categoryDescription]
    )
      .then(res => res.rows[0])
  },

  getAllCategories() {
    return global.client.query(`
        SELECT *
        FROM categories
    `)
      .then(res => res.rows);
  },

  getCategoryById(categoryId) {
    return global.client.query(`
                SELECT *
                FROM categories
                WHERE id = $1
      `, [categoryId]
    )
      .then(res => res.rows[0]);
  },

  updateCategory(categoryId, categoryTitle, categoryDescription) {
    return global.client.query(`
                UPDATE categories
                SET categoryTitle       = $1,
                    categoryDescription = $2
                WHERE id = $3
                RETURNING *
      `, [categoryTitle, categoryDescription, categoryId]
    )
      .then(res => res.rows[0])
  },

  removeCategory(categoryId) {
    return global.client.query(`
        DELETE
        FROM categories
        WHERE id = $1
    `, [categoryId]
    )
      .then(res => res)
  }
};
