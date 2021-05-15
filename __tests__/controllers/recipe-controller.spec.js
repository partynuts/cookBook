const request = require('supertest');
// const Recipe = require('./../../src/models/recipe-model');
const app = require('../../server');
const secrets = require('../../secrets');
const { Client } = require('pg');
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

describe('recipe controller', () => {
  beforeEach(async () => {
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
    const droppedTableR = await client.query(`DROP TABLE recipes`);
    const droppedTableC = await client.query(`DROP TABLE categories`);
    await client.end();
  });
  describe('POST api/recipes', () => {
    it('should create new recipe in db and return 201', async () => {
      const category = await Category.createCategory('Salate');

      await request(app)
        .post(`/api/recipes`)
        .send({
          title: 'Quinoa Salat',
          description: 'Gesunder Quinoa Salat, perfekt für den Sommer',
          ingredients: ['Quinoa', 'Tomaten', 'Gurke'],
          duration: '30 Minuten',
          category: category.id
        })
        .expect(201)
        .then(res => {
          expect(res.body.title).toEqual('Quinoa Salat');
          expect(res.body.description).toEqual('Gesunder Quinoa Salat, perfekt für den Sommer');
          expect(res.body.ingredients).toEqual(['Quinoa', 'Tomaten', 'Gurke']);
          expect(res.body.duration).toEqual('30 Minuten');
          expect(res.body.id).toBeDefined();
        });

      const recipes = await Recipe.getAllRecipes();

      expect(recipes).toHaveLength(1);
    });
  });
  describe('GET /api/recipes', () => {
    it('should return 200 and an empty array if no recipes exist', async () => {
      await request(app)
        .get(`/api/recipes`)
        .expect(200, [])
    });
    it('should return 200 and all recipes if recipes exist', async () => {
      const category1 = await Category.createCategory('Salate');
      const category2 = await Category.createCategory('Suppen');

      const recipe1 = await Recipe.createRecipe({
          title: 'Quinoa Salat',
          description: 'Gesunder Quinoa Salat, perfekt für den Sommer',
          ingredients: ['Quinoa', 'Tomaten', 'Gurke'],
          duration: '30 Minuten',
          category: category1.id
        }
      );
      const recipe2 = await Recipe.createRecipe({
          title: 'Tomatensuppe',
          description: 'Fruchtige Tomatensuppe',
          ingredients: ['Tomaten', 'Gemüsebrühe'],
          duration: '30 Minuten',
          category: category2.id
        }
      );

      await request(app)
        .get(`/api/recipes`)
        .expect(200, [recipe1, recipe2])
    });
    it('should return all recipes with the respective buzzword', async () => {
      const category1 = await Category.createCategory('Salate');
      const category2 = await Category.createCategory('Suppen');

      const recipe1 = await Recipe.createRecipe({
          title: 'Gurkensalat',
          description: 'Frisch und leicht, tolle Beilage zu Schnitzel und anderen Gerichten.',
          ingredients: ['Gurke', 'Dill', 'Sauerrahm'],
          duration: '30 Minuten',
          category: category1.id
        }
      );
      const recipe2 = await Recipe.createRecipe({
          title: 'Kalte Gurkensuppe',
          description: 'Erfrischende Suppe mit wenig Kalorien und eine tolle Vorspeise im Sommer.',
          ingredients: ['Gurke', 'anderes Zeug'],
          duration: '30 Minuten',
          category: category2.id
        }
      );

      await request(app)
        .get('/api/recipes')
        .query({ search: 'Gurke' })
        .expect(200, [recipe1, recipe2]);

      const foundRecipes = await Recipe.getRecipesByBuzzWords(['Gurke']);

      expect(foundRecipes).toHaveLength(2);
    });
    it('should return all recipes with the respective buzzwords', async () => {
      const category1 = await Category.createCategory('Salate');
      const category2 = await Category.createCategory('Suppen');

      const recipe1 = await Recipe.createRecipe({
          title: 'Gurkensalat',
          description: 'Frisch und leicht, tolle Beilage zu Schnitzel und anderen Gerichten.',
          ingredients: ['Gurke', 'Dill', 'Sauerrahm'],
          duration: '30 Minuten',
          category: category1.id
        }
      );
      const recipe2 = await Recipe.createRecipe({
          title: 'Quinoa Salat',
          description: 'Gesunder Quinoa Salat, perfekt für den Sommer',
          ingredients: ['Quinoa', 'Tomaten', 'Gurke'],
          duration: '30 Minuten',
          category: category1.id
        }
      );
      const recipe3 = await Recipe.createRecipe({
          title: 'Tomatensuppe',
          description: 'Fruchtige Tomatensuppe',
          ingredients: ['Tomaten', 'Gemüsebrühe'],
          duration: '30 Minuten',
          category: category2.id
        }
      );

      await request(app)
        .get('/api/recipes')
        .query({ search: ['Gurke', 'Tomate'] })
        .expect(200, [recipe1, recipe3]);

      const foundRecipes = await Recipe.getRecipesByBuzzWords(['Gurke', 'Tomate']);

      expect(foundRecipes).toHaveLength(2);
    });
  });
  describe('GET /api/recipes/:id', () => {
    it('should return 200 and the recipe related to the inserted recipe id', async () => {
      const category1 = await Category.createCategory('Salate');

      const recipe1 = await Recipe.createRecipe({
          title: 'Quinoa Salat',
          description: 'Gesunder Quinoa Salat, perfekt für den Sommer',
          ingredients: ['Quinoa', 'Tomaten', 'Gurke'],
          duration: '30 Minuten',
          category: category1.id
        }
      );

      await request(app)
        .get(`/api/recipes/${recipe1.id}`)
        .expect(200, recipe1);

      const foundRecipe = await Recipe.getRecipeById(recipe1.id);
      expect(foundRecipe).toEqual(recipe1);
    });
    it('should return 404 if the recipe does not exist', async () => {
      await request(app)
        .get(`/api/recipes/b710c0dc-3860-47dd-8662-b34179e6e400`)
        .expect(404)
    });
  });
  describe('GET /api/recipes/category/:categoryId', () => {
    it('should return 200 and all recipes of a certain category', async () => {
      const category1 = await Category.createCategory('Salate');

      const recipe1 = await Recipe.createRecipe({
          title: 'Quinoa Salat',
          description: 'Gesunder Quinoa Salat, perfekt für den Sommer',
          ingredients: ['Quinoa', 'Tomaten', 'Gurke'],
          duration: '30 Minuten',
          category: category1.id
        }
      );

      const recipe2 = await Recipe.createRecipe({
        title: 'Melonen Salat',
        description: 'Frisch und leicht, perfekt für den Sommer',
        ingredients: ['Wassermelone', 'Fetakäse', 'Minze'],
        duration: '15 Minuten',
        category: category1.id
      });

      await request(app)
        .get(`/api/recipes/category/${category1.id}`)
        .expect(200, [recipe1, recipe2]);

      const recipesByCategory = await Recipe.getAllRecipesOfOneCategory(category1.id);

      expect(recipesByCategory).toHaveLength(2);
    });
    it('should return an empty array and a message if there are no recipes in the specified category', async () => {
      const category1 = await Category.createCategory('Salate');

      await request(app)
        .get(`/api/recipes/category/${category1.id}`)
        .expect(404)
        .then(res => {
          expect(res.body.msg).toEqual('Es gibt noch keine Rezepte in dieser Kategorie.')
        });
    })
  });
  describe('PUT /api/recipes/:id', () => {
    it('should return 200 and the updated recipe', async () => {
      const category1 = await Category.createCategory('Salate');

      const recipe1 = await Recipe.createRecipe({
        title: 'Quinoa Salat',
        description: 'Gesunder Quinoa Salat, perfekt für den Sommer',
        ingredients: ['Quinoa', 'Tomaten', 'Gurke'],
        duration: '30 Minuten',
        category: category1.id
      });

      await request(app)
        .put(`/api/recipes/${recipe1.id}`)
        .send({
          title: 'Quinoa Salat',
          description: 'Gesunder Quinoa Salat',
          ingredients: ['Quinoa', 'Tomaten', 'Gurke'],
          duration: '30 Minuten',
          category: category1.id
        })
        .expect(200, {...recipe1, description: 'Gesunder Quinoa Salat'});

      const updatedRecipe = await Recipe.updateRecipe(recipe1.id, {title: 'Quinoa Salat',
        description: 'Gesunder Quinoa Salat',
        ingredients: ['Quinoa', 'Tomaten', 'Gurke'],
        duration: '30 Minuten',
        category: category1.id});

      console.log("UPDATED ", updatedRecipe)

      expect(updatedRecipe).toEqual({
        id: recipe1.id,
        title: 'Quinoa Salat',
        description: 'Gesunder Quinoa Salat',
        ingredients: ['Quinoa', 'Tomaten', 'Gurke'],
        duration: '30 Minuten',
        category: category1.id
      });
    });
    it('should return 400 if no body is provided', async () => {
      const category1 = await Category.createCategory('Salate');

      const recipe1 = await Recipe.createRecipe({title: 'Quinoa Salat',
        description: 'Gesunder Quinoa Salat, perfekt für den Sommer',
        ingredients: ['Quinoa', 'Tomaten', 'Gurke'],
        duration: '30 Minuten',
        category: category1.id}
      );

      await request(app)
        .put(`/api/recipes/${recipe1.id}`)
        .send()
        .expect(400);
    });
    it('should return 400 if provided body is invalid', async () => {
      const category1 = await Category.createCategory('Salate');

      const recipe1 = await Recipe.createRecipe({
        title: 'Quinoa Salat',
        description: 'Gesunder Quinoa Salat, perfekt für den Sommer',
        ingredients: ['Quinoa', 'Tomaten', 'Gurke'],
        duration: '30 Minuten',
        category: category1.id
      });

      await request(app)
        .put(`/api/recipes/${recipe1.id}`)
        .send({
          title: {},
          description: 'Gesunder Quinoa Salat',
          ingredients: ['Quinoa', 'Tomaten', 'Gurke'],
          duration: '30 Minuten',
          category: category1.id
        })
        .expect(400);
    });
  });
  describe('DELETE /api/recipes/:id', () => {
    it('should delete the respective recipe and return 200 and success msg', async () => {
      const category1 = await Category.createCategory('Salate');

      const recipe1 = await Recipe.createRecipe({
        title: 'Quinoa Salat',
        description: 'Gesunder Quinoa Salat, perfekt für den Sommer',
        ingredients: ['Quinoa', 'Tomaten', 'Gurke'],
        duration: '30 Minuten',
        category: category1.id
      });

      await request(app)
        .delete(`/api/recipes/${recipe1.id}`)
        .expect(200)
        .then(res => {
          expect(res.body.successMsg).toEqual('Rezept wurde erfolgreich gelöscht.')
        });
    });
    it('should return 404 if recipe does not exist', async () => {
      await request(app)
        .delete(`/api/recipes/7`)
        .expect(404)
    })
  })
});
