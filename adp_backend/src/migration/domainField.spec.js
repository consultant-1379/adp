// ============================================================================================= //
/**
* Unit test for [ global.adp.migration.domainField ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.migration.domainField ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.migration = {};
    global.adp.migration.domainField = require('./domainField'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should return "true" (nothing to change), if the parameter follow the rule.', () => {
    const obj = {
      alignment: 1,
      domain: 1,
    };

    expect(global.adp.migration.domainField(obj)).toBeTruthy();
  });

  it('Should return the updated object, setting domain to 1 if alignment is 1, if domain field does not exists.', () => {
    const obj = {
      alignment: 1,
    };
    const expectedObj = {
      alignment: 1,
      domain: 1,
    };

    expect(global.adp.migration.domainField(obj)).toEqual(expectedObj);
  });

  it('Should return the updated object, setting domain to 1 if alignment is 2, if domain field does not exists.', () => {
    const obj = {
      alignment: 2,
    };
    const expectedObj = {
      alignment: 2,
      domain: 1,
    };

    expect(global.adp.migration.domainField(obj)).toEqual(expectedObj);
  });

  it('Should return the updated object, setting domain to 6 if alignment is 3, if domain field does not exists.', () => {
    const obj = {
      alignment: 3,
    };
    const expectedObj = {
      alignment: 3,
      domain: 6,
    };

    expect(global.adp.migration.domainField(obj)).toEqual(expectedObj);
  });

  it('Should return "true", if domain field already exists.', () => {
    const obj = {
      alignment: 1,
      domain: 2,
    };

    expect(global.adp.migration.domainField(obj)).toBeTruthy();
  });

  it('Should return the updated object, setting domain field to null, if domain and alignment are not defined.', () => {
    const obj = {
    };
    const expectedObj = {
      domain: null,
    };

    expect(global.adp.migration.domainField(obj)).toEqual(expectedObj);
  });
});
// ============================================================================================= //
