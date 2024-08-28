// ============================================================================================= //
/**
* Unit test for [ adp.middleware.validations.adpSchemaValidator ]
* @author Veerender Voskula [zvosvee]
*/
// ============================================================================================= //
class MockJsonschema {
  validate() {
    return adp.response;
  }
}

describe('Testing [ adp.middleware.validations.adpSchemaValidator ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.mockRES = {};
    global.adp.mockNEXT = () => true;
    global.adp.echoLog = text => text;
    global.adp.setHeaders = () => ({ end() { return true; } });
    global.Jsonschema = MockJsonschema;
    adp.schema = { properties: {} };
    global.adp.getSizeInMemory = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.docs.rest = [];
    global.adp.Answers = require('../../answers/AnswerClass');
    adp.common = {};
    adp.common.validations = {};
    adp.common.validations.adpSchemaValidator = require('./adpSchemaValidator'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Failed case donot proceed: sending empty body and empty SCHEMA.', (done) => {
    adp.mockREQ = { };
    adp.schemaValidator = adp.common.validations.adpSchemaValidator();
    const result = adp.schemaValidator(adp.mockREQ, global.adp.mockRES, global.adp.mockNEXT);

    expect(result).toBeFalsy();
    done();
  });

  it('Failed case donot proceed: sending OBJ and empty SCHEMA', (done) => {
    adp.mockREQ = { body: { _id: 'esupuse' } };
    adp.schemaValidator = adp.common.validations.adpSchemaValidator();
    const result = adp.schemaValidator(adp.mockREQ, global.adp.mockRES, global.adp.mockNEXT);

    expect(result).toBeFalsy();
    done();
  });

  it('Failed case donot proceed: sending OBJ and invalid SCHEMA', (done) => {
    adp.mockREQ = { body: { _id: 'esupuse' } };
    adp.schema = { properties: { } };
    adp.response = { errors: [{ stack: '_id is not part of the schema' }] };
    adp.schemaValidator = adp.common.validations.adpSchemaValidator();
    const result = adp.schemaValidator(adp.mockREQ, global.adp.mockRES, global.adp.mockNEXT);

    expect(result).toBeFalsy();
    done();
  });

  it('Failed case show errors and dont proceed: sending OBJ and valid SCHEMA.', (done) => {
    adp.mockREQ = { body: { _id: 'esupuse' } };
    adp.schema = { properties: { field1: {} } };
    adp.response = { errors: [{ stack: 'instance.field1 should be valid' }] };
    adp.schemaValidator = adp.common.validations.adpSchemaValidator(adp.schema);
    const RESULT = adp.schemaValidator(adp.mockREQ, global.adp.mockRES, global.adp.mockNEXT);

    expect(RESULT).toBeFalsy();
    done();
  });

  it('Failed case show errors: dont proceed: sending OBJ array and valid SCHEMA.', (done) => {
    adp.mockREQ = { body: [{ _id: 'esupuse' }] };
    adp.schema = { items: { properties: { field1: {} } } };
    adp.response = { errors: [{ stack: 'instance.field1 should be valid' }] };
    adp.schemaValidator = adp.common.validations.adpSchemaValidator(adp.schema);
    const RESULT = adp.schemaValidator(adp.mockREQ, global.adp.mockRES, global.adp.mockNEXT);

    expect(RESULT).toBeFalsy();
    done();
  });

  it('Success case dont show errors: proceed: sending OBJ and valid SCHEMA.', (done) => {
    adp.mockREQ = { body: { _id: 'esupuse' } };
    adp.schema = { items: { properties: { _id: {} } } };
    adp.response = { errors: [] };
    adp.schemaValidator = adp.common.validations.adpSchemaValidator(adp.schema);
    const RESULT = adp.schemaValidator(adp.mockREQ, global.adp.mockRES, global.adp.mockNEXT);

    expect(RESULT).toBeTruthy();
    done();
  });
});
// ============================================================================================= //
