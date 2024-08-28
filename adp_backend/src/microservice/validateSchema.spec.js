// ============================================================================================= //
/**
* Unit test for [ global.adp.microservice.validateSchema ]
* @author Armando Schiavon Dias [escharm], Omkar Sadegaonkar [ zsdgmkr ]
*/
// ============================================================================================= //
describe('Testing [ global.adp.microservice.validateSchema ]', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.Jsonschema = require('jsonschema').Validator;
    adp.assets = {};
    adp.assets.BuildAssetSchemaClass = require('./../assets/BuildAssetSchemaClass');

    global.adp.microservice = {};
    global.adp.microservice.validateSchema = require('./validateSchema'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });
  const validJSON = {
    name: 'Testing Name',
    description: 'Testing Description text...',
    report_service_bugs: 'Test Link',
    request_service_support: 'Test Link',
    version: '1.0b',
    category: 1,
    serviceType: 1,
    service_maturity: 1,
    owner: 'eTestUser',
    approval: 'approved',
    documentation: [{ doc: 'doc1' }, { doc: 'doc1' }],
    team: [{ user: 'eTest' }, { user: 'eAnotherTest' }],
    teamMails: [{ mail: 'test1@mail.se' }, { mail: 'test2@mail.se' }],
    likes: 9000,
    adp_strategy: 'Some test adp strategy text',
    adp_organization: 'Some test adp organization text',
    adp_realization: 'Some test adp realization text',
    additional_info: 'Some test additional info text',
    approval_comment: 'Some test approval comment text',
  };
  it('[ global.adp.microservice.validateSchema ] with a valid JSON should return true', () => {
    expect(global.adp.microservice.validateSchema(validJSON)).toBeTruthy();
  });
  const oneFiledInvalidJSON = {
    name: 'Testing Name',
    description: 'Testing Description text...',
    version: '1.0b',
    category: 1, // Invalid field
    serviceType: 1,
    service_maturity: 1,
    owner: 'eTestUser',
    approval: 'approved',
    documentation: null,
    team: [{ user: 'eTest' }, { user: 'eAnotherTest' }],
    teamMails: [{ mail: 'test1@mail.se' }, { mail: 'test2@mail.se' }],
    likes: 9000,
    adp_strategy: 'Some test adp strategy text',
    adp_organization: 'Some test adp organization text',
    adp_realization: 'Some test adp realization text',
    additional_info: 'Some test additional info text',
    approval_comment: 'Some test approval comment text',
  };
  it('[ global.adp.microservice.validateSchema ] with an invalid field in JSON should return an array ( error list )', () => {
    if (Array.isArray(global.adp.microservice.validateSchema(oneFiledInvalidJSON))) {
      expect(true).toBeTruthy();
    } else {
      expect(true).toBeFalsy();
    }
  });
  const missingFieldsJSON = {
    name: 'Testing Name',
    description: 'Testing Description text...',
    version: '1.0b',
    category: 1,
    serviceType: 1,
    service_maturity: 1,
    // Field 'Team' is missing
    teamMails: [{ mail: 'test1@mail.se' }, { mail: 'test2@mail.se' }],
    adp_realization: 'Some test adp realization text',
    additional_info: 'Some test additional info text',
    approval_comment: 'Some test approval comment text',
  };
  it('[ global.adp.microservice.validateSchema ] with missing fields in JSON should return an array ( error list )', () => {
    if (Array.isArray(global.adp.microservice.validateSchema(missingFieldsJSON))) {
      expect(true).toBeTruthy();
    } else {
      expect(true).toBeFalsy();
    }
  });
});
// ============================================================================================= //
