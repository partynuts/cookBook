const request = require('supertest');
// const Category = require('./../../src/models/category-model');
const app = require('../../server');
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
let Category;

describe('category controller', () => {
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

  beforeEach(async () => {
    client = new Client({
      user: secrets.USER,
      password: secrets.PW,
      database: 'cookBook-test-db'
    });
    await client.connect();

    try {
      const tableQuery = await fs.readFile(__dirname + '/../../schema/01_category.sql');
      const createdTable = await client.query(tableQuery.toString());
    } catch (e) {
      console.log("error", e)
    }
    Category = require('./../../src/models/category-model')(client);
  });

  afterEach(async () => {
    const droppedTable = await client.query(`DROP TABLE categories`);
    await client.end();
  });

  describe('POST /api/categories', () => {
    it('should create a new category with title and description in db and return 201', async () => {
      await request(app)
        .post(`/api/categories`)
        .send({
          categoryTitle: "Suppen", categoryDescription: "Suppen aller Art. Ob cremige Suppen oder Hühnersuppen, " +
            "hier findet sich alles was der Suppenliebhaber begehrt."
        })
        .expect(201)
        .then(res => {
          expect(res.body.categorytitle).toEqual('Suppen');
          expect(res.body.categorydescription).toEqual("Suppen aller Art. Ob cremige Suppen oder Hühnersuppen, " +
            "hier findet sich alles was der Suppenliebhaber begehrt.");
          expect(res.body.id).toBeDefined();
        });

      const categories = await Category.getAllCategories();
      expect(categories[0].categoryTitle).toEqual();
    });
    it('should return 400 and error message if category title already exists', async () => {
      await Category.createCategory('Suppen');

      await request(app)
        .post(`/api/categories`)
        .send({
          categoryTitle: "Suppen", categoryDescription: "Suppen aller Art. Ob cremige Suppen oder Hühnersuppen, " +
            "hier findet sich alles was der Suppenliebhaber begehrt."
        })
        .expect(400)
        .then(res => {
          expect(res.body.errorMsg).toEqual('Diese Kategorie gibt es bereits.')
        });

      const categories = await Category.getAllCategories();
      expect(categories).toHaveLength(1);
    });
  });
  describe('GET /api/categories', () => {
    it('should return an empty array if no categories available', async () => {
      await request(app)
        .get(`/api/categories`)
        .expect(200, [])
    });
    it('should return all categories if categories exist', async () => {
      const category1 = await Category.createCategory('Suppen', "Leckere Suppen");
      const category2 = await Category.createCategory('Salate', 'Leckere Salate');

      await request(app)
        .get(`/api/categories`)
        .expect(200, [category1, category2])
    });
  });
  describe('GET /api/categories/:categoryId', () => {
    it('should return 200 and the category related to inserted id', async () => {
      const category = await Category.createCategory('Alkoholfreie Drinks', 'Cocktails und Co. ohne Alkohol')
      await request(app)
        .get(`/api/categories/${category.id}`)
        .expect(200, category)
    });
    it('should return 404 if the category does not exist', async () => {
      await request(app)
        .get(`/api/categories/6`)
        .expect(404)
        .then(res => {
          expect(res.body.errorMsg).toEqual('Diese Kategorie gibt es nicht.')
        });
    })
  });
  describe('PUT /api/categories/:categoryId', () => {
    it('should update the respective category and return 200 and the updated category data', async () => {
      const category = await Category.createCategory('Alkoholfreie Drinks', 'Cocktails und Co. ohne Alkohol')

      await request(app)
        .put(`/api/categories/${category.id}`)
        .send({ categoryTitle: 'Alkoholfreie Getränke', categoryDescription: 'Cocktails und Co. ohne Alkohol' })
        .expect(200, { categorytitle: 'Alkoholfreie Getränke', categorydescription: 'Cocktails und Co. ohne Alkohol', id: category.id })

      const updatedCategory = await Category.getCategoryById(category.id);

      expect(updatedCategory).toEqual({
        categorytitle: 'Alkoholfreie Getränke',
        categorydescription: 'Cocktails und Co. ohne Alkohol',
        id: category.id
      })
    });
    it('should return 404 if the category does not exist', async () => {
      await request(app)
        .put(`/api/categories/25cf7e37-e8a1-408e-b404-5687541adbb0`)
        .expect(404)
        .then(res => {
          expect(res.body.errorMsg).toEqual('Diese Kategorie gibt es nicht.')
        });
    });
    it('should return 400 if no body is provided', async () => {
      const category = await Category.createCategory('Alkoholfreie Drinks', 'Cocktails und Co. ohne Alkohol')

      await request(app)
        .put(`/api/categories/${category.id}`)
        .expect(400)
        .then(res => {
          expect(res.body.errorMsg).toEqual('Bitte geben sie einen gültigen Titel und Beschreibung an.')
        });
    });
    it('should return 400 if the provided body is invalid', async () => {
      const category = await Category.createCategory('Alkoholfreie Drinks', 'Cocktails und Co. ohne Alkohol')

      await request(app)
        .put(`/api/categories/${category.id}`)
        .send({ categoryTitle: 999, categoryDescription: 'Cocktails und Co. ohne Alkohol' })
        .expect(400)
        .then(res => {
          expect(res.body.errorMsg).toEqual('Bitte geben sie einen gültigen Titel und Beschreibung an.')
        });
      //
      // await request(app)
      //   .put(`/api/categories/${category.id}`)
      //   .send({ categoryTitle: 'name@mail.com', categoryDescription: 'Cocktails und Co. ohne Alkohol' })
      //   .expect(400)
      //   .then(res => {
      //     expect(res.body.errorMsg).toEqual('Diese Kategorie gibt es nicht.')
      //   });
    });
  });
  describe('DELETE /api/categories/:categoryId', () => {
    it('should return 204 if deletion successful', async () => {
      const category = await Category.createCategory('Alkoholfreie Drinks', 'Cocktails und Co. ohne Alkohol')

      await request(app)
        .delete(`/api/categories/${category.id}`)
        .expect(204)
    });
    it('should return 404 if category does not exist', async () => {
      await request(app)
        .delete(`/api/categories/25cf7e37-e8a1-408e-b404-5687541adbb0`)
        .expect(404)
        .then(res => {
          expect(res.body.errorMsg).toEqual('Diese Kategorie gibt es nicht.')
        });
    });
  });
});
