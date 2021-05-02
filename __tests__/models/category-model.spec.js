const pgtools = require('pgtools');
const secrets = require('../../secrets');
const config = {
  user: secrets.USER,
  password: secrets.PW,
  port: 5432,
  host: 'localhost'
};

beforeAll(() => {
  pgtools.createdb(config, 'cookBook-test-db', function (err, res) {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    console.log(res);

    // pgtools.dropdb(config, 'cookBook-test-db', function (err, res) {
    //   if (err) {
    //     console.error(err);
    //     process.exit(-1);
    //   }
    //   console.log(res);
    // });
  });
});
const Category = require('./../../src/models/category-model')();

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
