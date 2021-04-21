async function up() {
  await global.client.query(`
      CREATE TABLE IF NOT EXISTS categories
      (
          id                  SERIAL PRIMARY KEY,
          categoryTitle       VARCHAR(250),
          categoryDescription VARCHAR(250)
      );
  `)
}

async function down() {
  await global.client.query('DROP TABLE IF EXISTS categories');
}

module.exports = { up, down };
