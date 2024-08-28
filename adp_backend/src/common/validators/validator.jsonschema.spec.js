// ============================================================================================= //
/**
* Unit test for [ adp.rbac.validateSchema ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
const validator = require('./validator.jsonschema');

class MockJsonschema {
  validate() {
    return adp.response;
  }
}

describe('Testing [ jsonschema.validator ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    adp.emptyResp = false;
    adp.echoLog = text => text;
    global.Jsonschema = MockJsonschema;
    adp.config = {};
    adp.config.schema = { mock: { properties: { field1: {} } } };
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Successful case, sending empty OBJ and SCHEMA.', (done) => {
    const testObj = {};
    adp.response = { errors: [] };
    const result = validator(testObj, 'mock');

    expect(result).toBeTruthy();
    done();
  });

  it('Negative case, sending invalid OBJ and valid SCHEMA.', (done) => {
    const testObj = { field1: 'FIELD 1' };
    adp.schema = { properties: { field1: {} } };
    adp.response = { errors: [{ stack: 'instance.field1 should be valid' }] };
    const result = validator(testObj, 'mock');

    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toEqual(1);
    done();
  });

  it('Negative case, sending invalid OBJ with unwanted field.', (done) => {
    const testObj = { field1: 'FIELD 1', field2: 'FIELD 2' };
    adp.schema = { properties: { field1: {} } };
    adp.response = { errors: [] };
    const result = validator(testObj, 'mock');

    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toEqual(1);
    done();
  });
});
// ============================================================================================= //
