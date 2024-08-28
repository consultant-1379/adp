// ============================================================================================= //
/**
* Unit test for [ adp.middleware.validations.joi.validator ]
* @author Veerender Voskula [zvosvee]
*/
// ============================================================================================= //
const Joi = require('joi');

class MockAnswer {
  setCode(code) { adp.AnswersMockResp.setCode = code; }

  setMessage(message) { adp.AnswersMockResp.setMessage = message; }

  setData() {}

  setLimit() {}

  setTotal() {}

  setPage() {}

  setSize() {}

  setTime() {}

  getAnswer() {}
}

describe('Testing [ adp.middleware.validations.joi.validator ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.mockRES = {};
    global.adp.mockNEXT = () => true;
    global.adp.echoLog = text => text;
    global.adp.setHeaders = () => ({ end() { return true; } });
    adp.mockSchema = {
      body: Joi.array().label('RBAC permission group array').min(1).items(
        Joi.string().required().min(8).label('Group Id'),
      ),
    };
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.docs.rest = [];
    adp.AnswersMockResp = { setCode: null, setMessage: null };
    adp.Answers = MockAnswer;
    adp.joiValidator = require('./joi.validator').joiValidator;
    adp.validateRequestSchema = require('./joi.validator').validateRequestSchema;
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Failed case donot proceed: sending empty SCHEMA.', (done) => {
    adp.mockREQ = { };
    const validate = adp.joiValidator();
    validate(adp.mockREQ, global.adp.mockRES, global.adp.mockNEXT);

    expect(adp.AnswersMockResp.setCode).toBe(400);
    expect(adp.AnswersMockResp.setMessage).toBe('400 Bad Request - Schema not found');
    done();
  });

  it('Failed case donot proceed: validateRequestSchema sending empty SCHEMA.', (done) => {
    adp.mockREQ = { };
    const validate = adp.validateRequestSchema();

    expect(validate.message).toBe('Schema not found');
    done();
  });

  it('failed case: sending SCHEMA but no property and no request object', (done) => {
    adp.mockREQ = { };
    const validate = adp.joiValidator(adp.mockSchema);
    validate(adp.mockREQ, global.adp.mockRES, global.adp.mockNEXT);

    expect(adp.AnswersMockResp.setMessage).toBe('400 Bad Request - Input data not found for validating against schema');
    expect(adp.AnswersMockResp.setCode).toBe(400);
    done();
  });

  it('failed case: sending SCHEMA, property and no request object', (done) => {
    adp.mockREQ = { };
    const validate = adp.joiValidator(adp.mockSchema, 'body');
    validate(adp.mockREQ, global.adp.mockRES, global.adp.mockNEXT);

    expect(adp.AnswersMockResp.setMessage).toBe('400 Bad Request - Input data not found for validating against schema');
    expect(adp.AnswersMockResp.setCode).toBe(400);
    done();
  });

  it('failed case: sending SCHEMA, property but valid empty request object', (done) => {
    adp.mockREQ = { body: {} };
    const validate = adp.joiValidator(adp.mockSchema, 'body');
    validate(adp.mockREQ, global.adp.mockRES, global.adp.mockNEXT);

    expect(adp.AnswersMockResp.setMessage).toBe('400 Bad Request - "RBAC permission group array" must be an array');
    expect(adp.AnswersMockResp.setCode).toBe(400);
    done();
  });

  it('failed case: sending SCHEMA, property but invalid payload', (done) => {
    adp.mockREQ = { body: ['mockid'] };
    const validate = adp.joiValidator(adp.mockSchema, 'body');
    validate(adp.mockREQ, global.adp.mockRES, global.adp.mockNEXT);

    expect(adp.AnswersMockResp.setMessage).toBe('400 Bad Request - "Group Id" length must be at least 8 characters long');
    expect(adp.AnswersMockResp.setCode).toBe(400);
    done();
  });

  it('success case: sending SCHEMA, property valid payload', (done) => {
    adp.mockREQ = { body: ['123456789'] };
    const validate = adp.joiValidator(adp.mockSchema, 'body');
    validate(adp.mockREQ, global.adp.mockRES, global.adp.mockNEXT);

    expect(adp.AnswersMockResp.setCode).toBe(null);
    expect(adp.AnswersMockResp.setMessage).toBe(null);
    done();
  });
});
// ============================================================================================= //
