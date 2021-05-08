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

beforeAll(async (done) => {
  const dbRes = await pgtools.createdb(config, 'cookBook-test-db');
  client = new Client({
    user: secrets.USER,
    password: secrets.PW,
    database: 'cookBook-test-db'
  });
  await client.connect();
  done();
});

afterAll(async (done) => {
  await client.end();
  const dbRes = await pgtools.dropdb(config, 'cookBook-test-db');
  done();
});

beforeEach(async () => {
  try {
    const tableQuery = await fs.readFile(__dirname + '/../../schema/01_category.sql');
    const createdTable = await client.query(tableQuery.toString());
  } catch (e) {
    console.log("error", e)
  }
  Category = require('./../../src/models/category-model')(client);
});

afterEach(async () => {
  const droppedTable = await client.query(`DROP TABLE categories`)
});

describe('category model', () => {
  describe('createCategory', () => {
    it('should create a new category in db table categories', async () => {
      const createdCategory = {
        id: 1,
        categoryTitle: 'Salate',
        categoryDescription: 'Leckere Salate'
      };

      const category = await Category.createCategory('Salate', "Leckere Salate");

      expect(category.categorytitle).toEqual(createdCategory.categoryTitle)
      expect(category.categorydescription).toEqual(createdCategory.categoryDescription)
      expect(category.id).toBeDefined()
    });
  });
  describe('getAllCategories', () => {
    it('should return all categories from db table categories', async () => {
      const category1 = await Category.createCategory('Salate', "Leckere Salate");
      const category2 = await Category.createCategory('Suppen', "Cremige Suppen");
      const allCategories = await Category.getAllCategories();

      expect(allCategories).toHaveLength(2);
      expect(allCategories).toEqual([category1, category2])
    });
  });
  describe('getCategoryById', () => {
    it('should return the category with inserted id from table categories', async () => {
      const category1 = await Category.createCategory('Salate', "Leckere Salate");
      const category2 = await Category.createCategory('Suppen', "Cremige Suppen");

      const foundCategory = await Category.getCategoryById(category1.id);

      expect(foundCategory).toEqual(category1)
      expect(foundCategory.categorytitle).toEqual('Salate')
    });
  });
  describe('getCategoryByTitle', () => {
    it('should return the category with inserted title from table categories', async () => {
      const category1 = await Category.createCategory('Salate', "Leckere Salate");
      const category2 = await Category.createCategory('Suppen', "Cremige Suppen");

      const foundCategory = await Category.getCategoryByTitle(category1.categorytitle);

      expect(foundCategory).toEqual(category1);
      expect(foundCategory.categorydescription).toEqual('Leckere Salate')
    });
  });
  describe('updateCategory', () => {
    it('should update category with inserted info in table categories', async () => {
      const category1 = await Category.createCategory('Salate', "Leckere Salate");
      const category2 = await Category.createCategory('Suppen', "Cremige Suppen");

      const updatedCategory = await Category.updateCategory(category2.id, 'Cremige Suppen', 'Cremige Suppen');

      expect(updatedCategory).toEqual({id: category2.id, categorytitle: 'Cremige Suppen', categorydescription: 'Cremige Suppen'});
      expect(updatedCategory.categorydescription).toEqual('Cremige Suppen')
    });
  });
  describe('deleteCategory', () => {
    it('should delete category from table categories', async () => {
      const category1 = await Category.createCategory('Salate', "Leckere Salate");
      const category2 = await Category.createCategory('Suppen', "Cremige Suppen");

      const deletedCategory = await Category.deleteCategory(category1.id);
      const remainingCategories = await Category.getAllCategories()

      expect(remainingCategories).toHaveLength(1)
      expect(remainingCategories).toEqual([{id: category2.id, categorytitle: 'Suppen', categorydescription: 'Cremige Suppen'}]);
    });
  });

});
