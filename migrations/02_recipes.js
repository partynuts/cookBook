async function up() {
  await global.client.query(`
      CREATE TABLE IF NOT EXISTS recipes
      (
          id          SERIAL PRIMARY KEY,
          title       VARCHAR(250),
          description VARCHAR(250),
          ingredients ARRAY,
          duration    VARCHAR(250),
          category    INTEGER,
          CONSTRAINT fk_category
              FOREIGN KEY (category)
                  REFERENCES categories (id)
      );
  `)
}

async function down() {
  await global.client.query('DROP TABLE IF EXISTS recipes');
}

module.exports = { up, down };
