const pgtools = require('pgtools');
const { Client } = require('pg');
const secrets = require('../../secrets');
const fs = require('fs').promises;
const config = {
  user: secrets.USER,
  password: secrets.PW,
  port: 5432,
  host: 'localhost'
};
let client;
let Recipe;
let Category;

// beforeAll(async (done) => {
//   const dbRes = await pgtools.createdb(config, 'cookBook-test-db');
//   client = new Client({
//     user: secrets.USER,
//     password: secrets.PW,
//     database: 'cookBook-test-db'
//   });
//   await client.connect();
//   done();
// });
//
// afterAll(async (done) => {
//   await client.end();
//   const dbRes = await pgtools.dropdb(config, 'cookBook-test-db');
//   done();
// });



describe('recipe model', () => {beforeEach(async () => {
  client = new Client({
    user: secrets.USER,
    password: secrets.PW,
    database: 'cookBook-test-db'
  });
  await client.connect();

  try {
    const tableQuery2 = await fs.readFile(__dirname + '/../../schema/01_category.sql');
    const createdTable2 = await client.query(tableQuery2.toString());
    const tableQuery = await fs.readFile(__dirname + '/../../schema/02_recipe.sql');
    const createdTable = await client.query(tableQuery.toString());
  } catch (e) {
    console.log("error", e)
  }
  Recipe = require('./../../src/models/recipe-model')(client);
  Category = require('./../../src/models/category-model')(client);
});

  afterEach(async () => {
    const droppedTable = await client.query(`DROP TABLE recipes`);
    const droppedTable2 = await client.query(`DROP TABLE categories`);
    await client.end();

  });

  describe('createRecipe', () => {
    it('should create a new recipe in the db table recipes', async () => {
      const category = await Category.createCategory('Salate', "Leckere Salate");

      const recipe = {
        title: 'Quinoa Salat',
        description: 'Gesunder Quinoa Salat, perfekt für den Sommer',
        ingredients: ['Quinoa', 'Tomaten', 'Gurke'],
        duration: '30 Minuten',
        category: category.id
      };

      const createdRecipe = await Recipe.createRecipe(
        'Quinoa Salat',
        'Gesunder Quinoa Salat, perfekt für den Sommer',
        ['Quinoa', 'Tomaten', 'Gurke'],
        '30 Minuten',
        category.id
      );
      expect(createdRecipe.title).toEqual(recipe.title);
      expect(createdRecipe.category).toEqual(category.id);
    });
  });
  describe('getAllRecipes', () => {
    it('should return all recipes from db table recipes', async () => {
      const category = await Category.createCategory('Salate', "Leckere Salate");
      const category2 = await Category.createCategory('Suppen', "Leckere Suppen");

      const createdRecipe1 = await Recipe.createRecipe(
        'Quinoa Salat',
        'Gesunder Quinoa Salat, perfekt für den Sommer',
        ['Quinoa', 'Tomaten', 'Gurke'],
        '30 Minuten',
        category.id
      );

      const createdRecipe2 = await Recipe.createRecipe(
        'Quinoa Salat',
        'Gesunder Quinoa Salat, perfekt für den Sommer',
        ['Quinoa', 'Tomaten', 'Gurke'],
        '30 Minuten',
        category2.id
      );

      const allRecipes = await Recipe.getAllRecipes();

      expect(allRecipes).toHaveLength(2);
      expect(allRecipes).toEqual([createdRecipe1, createdRecipe2]);
    });
  });
  describe('getRecipeById', () => {
    it('should return recipe with inserted id from db table recipes', async () => {
      const category = await Category.createCategory('Salate', "Leckere Salate");

      const createdRecipe1 = await Recipe.createRecipe(
        'Quinoa Salat',
        'Gesunder Quinoa Salat, perfekt für den Sommer',
        ['Quinoa', 'Tomaten', 'Gurke'],
        '30 Minuten',
        category.id
      );

      const createdRecipe2 = await Recipe.createRecipe(
        'Quinoa Salat',
        'Gesunder Quinoa Salat, perfekt für den Sommer',
        ['Quinoa', 'Tomaten', 'Gurke'],
        '30 Minuten',
        category.id
      );

      const foundRecipe = await Recipe.getRecipeById(createdRecipe1.id);

      expect(foundRecipe).toEqual(createdRecipe1);
      expect(foundRecipe.title).toEqual(createdRecipe1.title);
    });
  });
  describe('getAllRecipesOfOneCategory', () => {
    it('should return all recipes of one category from db table recipes', async () => {
      const category1 = await Category.createCategory('Salate', "Leckere Salate");
      const category2 = await Category.createCategory('Suppen', "Leckere Suppen");

      const createdRecipe1 = await Recipe.createRecipe(
        'Quinoa Salat',
        'Gesunder Quinoa Salat, perfekt für den Sommer',
        ['Quinoa', 'Tomaten', 'Gurke'],
        '30 Minuten',
        category1.id
      );
      const createdRecipe2 = await Recipe.createRecipe(
        'Gemischter Salat',
        'Leckerere Salat, perfekt für den Sommer',
        ['Eisbergsalat', 'Tomaten', 'Gurke'],
        '15 Minuten',
        category1.id
      );
      const createdRecipe3 = await Recipe.createRecipe(
        'Hühnersuppe',
        'Kraftbrühe gut für den Darm',
        ['Huhn', 'Suppengrün'],
        '18 Stunden',
        category2.id
      );

      const foundRecipes = await Recipe.getAllRecipesOfOneCategory(category1.id);

      expect(foundRecipes).toEqual([createdRecipe1, createdRecipe2]);
      expect(foundRecipes).toHaveLength(2);
    });
  });
  describe('updateRecipe', () => {
    it('should update recipes with inserted id from db table recipes', async () => {
      const category1 = await Category.createCategory('Salate', "Leckere Salate");

      const createdRecipe1 = await Recipe.createRecipe(
        'Quinoa Salat',
        'Gesunder Quinoa Salat, perfekt für den Sommer',
        ['Quinoa', 'Tomaten', 'Gurke'],
        '30 Minuten',
        category1.id
      );

      const updatedRecipe = await Recipe.updateRecipe(createdRecipe1.id, 'Bunter Quinoa Salat',
        'Gesunder Quinoa Salat, perfekt für den Sommer',
        ['Quinoa', 'Tomaten', 'Gurke', 'Käse'],
        '30 Minuten',
        category1.id);

      console.log("UPDATE ", updatedRecipe)

      expect(updatedRecipe).toEqual({
        id: createdRecipe1.id,
        title: 'Bunter Quinoa Salat',
        description: 'Gesunder Quinoa Salat, perfekt für den Sommer',
        ingredients: ['Quinoa', 'Tomaten', 'Gurke', 'Käse'],
        duration: '30 Minuten',
        category: category1.id
      });
    });
  });
  describe('deleteRecipe', () => {
    it('should delete recipe with inserted id from db table recipes', async () => {
      const category1 = await Category.createCategory('Salate', "Leckere Salate");

      const createdRecipe1 = await Recipe.createRecipe(
        'Quinoa Salat',
        'Gesunder Quinoa Salat, perfekt für den Sommer',
        ['Quinoa', 'Tomaten', 'Gurke'],
        '30 Minuten',
        category1.id
      );

      const createdRecipe2 = await Recipe.createRecipe(
        'Gemischter Salat',
        'Leckerere Salat, perfekt für den Sommer',
        ['Eisbergsalat', 'Tomaten', 'Gurke'],
        '15 Minuten',
        category1.id
      );

      const deletedRecipe = await Recipe.deleteRecipe(createdRecipe2.id)
      const remainingRecipes = await Recipe.getAllRecipes()

      expect(remainingRecipes).toHaveLength(1)
      expect(remainingRecipes).toEqual([createdRecipe1])
    });
  });
  describe('getRecipesByBuzzWords', () => {
    it('should get recipe with inserted buzzword from db table recipes', async () => {
      const category1 = await Category.createCategory('Salate', "Leckere Salate");

      const createdRecipe1 = await Recipe.createRecipe(
        'Quinoa Salat',
        'Gesunder Quinoa Salat, perfekt für den Sommer',
        ['Quinoa', 'Tomaten', 'Gurke'],
        '30 Minuten',
        category1.id
      );

      const createdRecipe2 = await Recipe.createRecipe(
        'Gemischter Salat',
        'Leckerere Salat, perfekt für den Sommer',
        ['Eisbergsalat', 'Tomaten', 'Gurke'],
        '15 Minuten',
        category1.id
      );

      const foundRecipe = await Recipe.getRecipesByBuzzWords('Salat');

      expect(foundRecipe).toEqual([createdRecipe2, createdRecipe1]);
    });
  });
});
