// ============================================================================================= //
/**
* Unit test for [ global.adp.microservice.validateListOptionSelections ]
* @author Cein [edaccei]
*/
// ============================================================================================= //
let shouldPassFindPromise;
let mockListoptionGroup;
let mockListoptionItem;

class MockListOptionModel {
  indexGroups() {
    return new Promise((resolve, reject) => {
      if (shouldPassFindPromise) {
        resolve({ docs: mockListoptionGroup });
      } else {
        reject();
      }
    });
  }

  indexItems() {
    return new Promise((resolve, reject) => {
      if (shouldPassFindPromise) {
        resolve({ docs: mockListoptionItem });
      } else {
        reject();
      }
    });
  }
}

describe('Testing [ global.adp.microservice.validateListOptionSelections ]', () => {
  beforeEach(() => {
    shouldPassFindPromise = true;
    mockListoptionGroup = [{
      'group-id': 1,
      slug: 'groupSlug',
    }];
    mockListoptionItem = [{
      'group-id': 1,
      'select-id': 1,
    }];
    global.adp = {};
    adp.models = {};
    adp.models.Listoption = MockListOptionModel;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.microservice = {};
    global.adp.microservice.validateListOptionSelections = require('./validateListOptionSelections'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('should pass validation if any listoptions passed by the microservice are not out of bound.', (done) => {
    const mockMS = {
      groupSlug: 1,
    };

    global.adp.microservice.validateListOptionSelections(mockMS)
      .then((resultObj) => {
        expect(resultObj.valid).toBeTruthy();
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('should fail validation if any listoptions passed by the microservice are out of bound.', (done) => {
    const mockMS = {
      groupSlug: 1000,
    };

    global.adp.microservice.validateListOptionSelections(mockMS)
      .then((resultObj) => {
        expect(resultObj.valid).toBeFalsy();
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('should fail on failure to retrieve listoption groups or items.', (done) => {
    const mockMS = {
      groupSlug: 1,
    };
    shouldPassFindPromise = false;

    global.adp.microservice.validateListOptionSelections(mockMS)
      .then((resultObj) => {
        expect(resultObj.valid).toBeFalsy();
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });
});
