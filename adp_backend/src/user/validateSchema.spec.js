// ============================================================================================= //
/**
* Unit test for [ global.adp.user.validateSchema ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.user.validateSchema ]', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.Jsonschema = require('jsonschema').Validator; // eslint-disable-line global-require
    global.adp.config = {};
    global.adp.config.schema = {};
    global.adp.config.schema.user = {
      id: '/user',
      type: 'object',
      properties: {
        signum: {
          description: 'Signum for the User',
          type: 'string',
        },
        name: {
          description: 'The Name of the User',
          type: 'string',
        },
        email: {
          description: 'The Email of the User',
          type: 'string',
        },
        role: {
          description: 'The Role of the User',
          type: 'string',
        },
      },
      required: ['signum', 'name', 'email'],
    };
    global.adp.user = {};
    global.adp.user.validateSchema = require('./validateSchema'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  const validJSON = {
    signum: 'etesuse',
    name: 'Test Super User',
    email: 'etesuse@null.null',
    role: 'author',
  };
  it('[ global.adp.user.validateSchema ] with a valid JSON should return true', () => {
    expect(global.adp.user.validateSchema(validJSON)).toBeTruthy();
  });

  const oneFiledInvalidJSON = {
    signum: 'etesuse',
    name: 'Test Super User',
    email: 123,
    role: 'author',
  };
  it('[ global.adp.user.validateSchema ] with an invalid field in JSON should return an array ( error list )', () => {
    if (Array.isArray(global.adp.user.validateSchema(oneFiledInvalidJSON))) {
      expect(true).toBeTruthy();
    } else {
      expect(true).toBeFalsy();
    }
  });

  const missingFieldsJSON = {
    signum: 'etesuse',
    name: 'Test Super User',
  };
  it('[ global.adp.user.validateSchema ] with missing fields in JSON should return an array ( error list )', () => {
    if (Array.isArray(global.adp.user.validateSchema(missingFieldsJSON))) {
      expect(true).toBeTruthy();
    } else {
      expect(true).toBeFalsy();
    }
  });
});
// ============================================================================================= //
