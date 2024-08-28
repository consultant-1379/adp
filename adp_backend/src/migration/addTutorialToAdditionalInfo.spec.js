// ============================================================================================= //
/**
* Unit tests for [ global.adp.migration.addTutorialToAdditionalInfo ]
* @author Githu Jeeva Savy [zjeegit]
*/

// ============================================================================================= //
describe('Testing [ global.adp.migration.addTutorialToAdditionalInfo ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];

    adp = {};
    adp.migration = {};
    adp.migration.addTutorialToAdditionalInfo = require('./addTutorialToAdditionalInfo');

    adp.tutorials = {};
    adp.tutorials.getBySlug = (slug) => {
      let obj = null;
      switch (slug) {
        case 'mock-tutorial-slug':
          obj = {
            code: 200,
            title: 'My First Tutorial Service',
          };
          return new Promise(RES => RES(obj));
        default:
          obj = {
            code: 500,
          };
          return new Promise((RES, REJ) => REJ(obj));
      }
    };
  });

  afterEach(() => {
    adp = null;
    global.adp = null;
  });

  it('Should get a title from the microservice', (done) => {
    const mockAsset = {
      tutorial: 'https://mockurl/mock-service/mock-tutorial-slug',
    };
    adp.migration.addTutorialToAdditionalInfo(mockAsset)
      .then((RES) => {
        expect(RES.additional_information[0]).toBeDefined();
        expect(RES.additional_information[0].category).toBe('tutorial');
        expect(RES.additional_information[0].title).toBe('My First Tutorial Service');
        expect(RES.additional_information[0].link).toBe('https://mockurl/mock-service/mock-tutorial-slug');
        done();
      }, done.fail);
  });

  it('Should not get the name of the tutorial', (done) => {
    const mockAsset = {
      tutorial: 'error',
    };
    global.adp.migration.addTutorialToAdditionalInfo(mockAsset)
      .then(() => {
        done.fail();
      })
      .catch((RES) => {
        expect(RES.code).toBe(500);
        expect(RES.message).toBe('Failed to add additional information');
        expect(RES.data.MS).toBeDefined();
        expect(RES.data.error.code).toBe(500);
        done();
      });
  });

  it('Should do nothing to microservice if tutorial field is not there', (done) => {
    const mockAsset = {
      _id: 'asset',
    };
    global.adp.migration.addTutorialToAdditionalInfo(mockAsset)
      .then((RES) => {
        expect(RES._id).toBe('asset');
        done();
      }, done.fail);
  });
});
