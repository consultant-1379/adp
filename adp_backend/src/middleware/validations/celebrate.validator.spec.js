// ============================================================================================= //
/**
* Unit test for [ adp.middleware.validations.celebrate.validator ]
* @author Veerender Voskula [zvosvee]
*/
// ============================================================================================= //
const { Joi } = require('celebrate');

describe('Testing [ adp.middleware.validations.celebrate.validator ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    adp.mockSchema = {
      body: Joi.array().label('RBAC permission group array').min(1).items(
        Joi.string().required().min(8).label('Group Id'),
      ),
    };
    global.adp.mockRES = {};
    global.adp.mockNEXT = () => true;
    global.adp.echoLog = text => text;
    global.adp.setHeaders = () => ({ end() { return true; } });
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.docs.rest = [];

    adp.celebrateValidator = require('./celebrate.validator');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('success case: sending valid SCHEMA.', (done) => {
    adp.mockREQ = { body: ['123456789'], method: 'POST' };
    const validate = adp.celebrateValidator(adp.mockSchema);
    validate(adp.mockREQ, global.adp.mockRES, (err) => {
      expect(err).toBeNull();
      done();
    });
  });

  it('failed case: sending invalid SCHEMA.', (done) => {
    adp.mockREQ = { body: ['123458'], method: 'POST' };
    const validate = adp.celebrateValidator(adp.mockSchema);
    validate(adp.mockREQ, global.adp.mockRES, (err) => {
      if (err) {
        expect(err.details).toBeDefined();
      }
      done();
    });
  });
});
// ============================================================================================= //
