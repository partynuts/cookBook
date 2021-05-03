const pgtools = require('pgtools');
const { Client } = require('pg');
const secrets = require('../../secrets');
const config = {
  user: secrets.USER,
  password: secrets.PW,
  port: 5432,
  host: 'localhost'
};
let client;
let Category;

beforeAll(async () => {
  pgtools.createdb(config, 'cookBook-test-db', function (err, res) {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    console.log(res);
  });

  client = new Client({
    user: secrets.USER,
    password: secrets.PW,
    database: 'cookBook-test-db'
  });
  await client.connect();
  client.query(`CREATE TEMPORARY TABLE IF NOT EXISTS categories`);
  Category = require('./../../src/models/category-model')(client);
});

afterAll(async () => {
  pgtools.dropdb(config, 'cookBook-test-db', function (err, res) {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    console.log(res);
  });
});

describe('category model', () => {


  describe('createCategory', () => {
    it('should create a new category in db', () => {
      const createdCategory = {
        id: 1,
        categoryTitle: 'Salate',
        categoryDescription: 'Leckere Salate'
      };

      expect(Category.createCategory('Salate', "Leckere Salate")).toEqual(createdCategory)
    });
  });
});
