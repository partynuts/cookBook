// const categoryModel = require('./../../src/models/category-model');
const controller = require('../../src/routes/category-controller');
const expectedCategoryJson = {
  "categoryDescription": "Leckere Salate",
  "categorytitle": "Salate",
  "id": "123abc",
};
const mockedReq = { body: {} };
const mockedJson = jest.fn().mockImplementation(data => data);
const mockedRes = {
  status: jest.fn().mockReturnValue({ json: mockedJson })
};
const mockedErrorJson = { errorMsg: 'Diese Kategorie gibt es bereits.' };
const mockedEmptyArrJson = {};
const mockedPost = jest.fn().mockImplementation(async (path, callback) => {
  expect(await callback(mockedReq, mockedRes)).toEqual(expectedCategoryJson);
});
const mockedFailPost = jest.fn().mockImplementation(async (path, callback) => {
  expect(await callback(mockedReq, mockedRes)).toEqual(mockedErrorJson);
});
const mockedGet = jest.fn().mockImplementation(async (path, callback) => {
  expect(await callback(mockedReq, mockedRes)).toEqual(mockedEmptyArrJson)
});
const mockedSuccessGet = jest.fn().mockImplementation(async (path, callback) => {
  expect(await callback(mockedReq, mockedRes)).toEqual(expectedCategoryJson);
});


describe('category controller', () => {
  describe('POST /api/categories', () => {
    it('should create category and return 201 if successful', () => {
      const mockedApp = {
        post: mockedPost,
        get: jest.fn().mockResolvedValue()
      };
      const mockedModel = {
        createCategory: jest.fn().mockResolvedValue({
          id: '123abc',
          categorytitle: 'Salate',
          categoryDescription: 'Leckere Salate'
        }),
        getAllCategories: jest.fn().mockResolvedValue(),
        getCategoryByTitle: jest.fn().mockResolvedValue()
      };
      controller(mockedApp, mockedModel);
      expect(mockedApp.post).toHaveBeenCalled();

      setTimeout(() => {
        expect(mockedRes.status).toHaveBeenCalledWith(expectedCategoryJson);
      });
    });

    it('should return 400 if category already exists', () => {
      const mockedApp = {
        post: mockedFailPost,
        get: jest.fn().mockResolvedValue()
      };
      const mockedModel = {
        getCategoryByTitle: jest.fn().mockResolvedValue({})
      };
      controller(mockedApp, mockedModel);
      expect(mockedApp.post).toHaveBeenCalled();

      setTimeout(() => {
        expect(mockedRes.status).toHaveBeenCalledWith(400);
      });
    });
  });
  describe('GET /api/categories', () => {
    it('should return 200 and an empty array if no categories available', async () => {
      const mockedApp = {
        post: jest.fn().mockResolvedValue(),
        get: mockedGet
      };
      const mockedModel = {
        getAllCategories: jest.fn().mockResolvedValue({}),
      };
      controller(mockedApp, mockedModel);

      expect(mockedApp.get).toHaveBeenCalled();
      setTimeout(() => {
        expect(mockedRes.status).toHaveBeenCalledWith(200);
      });
    });

    it('should return 200 and all existing categories', async () => {
      const mockedApp = {
        post: jest.fn().mockResolvedValue(),
        get: mockedSuccessGet
      };
      const mockedModel = {
        getAllCategories: jest.fn().mockResolvedValue({}),
      };
      controller(mockedApp, mockedModel);

      expect(mockedApp.get).toHaveBeenCalled();
      setTimeout(() => {
        expect(mockedRes.status).toHaveBeenCalledWith(200);
      });
    })
  });
});
