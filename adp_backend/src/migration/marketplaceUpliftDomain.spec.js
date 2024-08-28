// ============================================================================================= //
/**
* Unit test for [ global.adp.migration.marketplaceUpliftDomain ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
describe('Testing [ global.adp.migration.marketplaceUpliftDomain ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.migration = {};
    global.adp.migration.marketplaceUpliftDomain = require('./marketplaceUpliftDomain'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should return "true" (nothing to change), if service category is 1 and domain is 1.', () => {
    const obj = {
      service_category: 1,
      domain: 1,
    };

    expect(global.adp.migration.marketplaceUpliftDomain(obj)).toBeTruthy();
  });

  it('Should return "true" (nothing to change), if service category is 2 and domain is 1.', () => {
    const obj = {
      service_category: 2,
      domain: 1,
    };

    expect(global.adp.migration.marketplaceUpliftDomain(obj)).toBeTruthy();
  });

  it('Should return updated object, if service category is 4 and domain is 1.', () => {
    const obj = {
      service_category: 4,
      domain: 1,
    };
    global.adp.migration.marketplaceUpliftDomain(obj).then((res) => {
      expect(res.domain).toEqual(7);
    });
  });

  it('Should return updated object, if service category is 1 and domain is 4.', () => {
    const obj = {
      service_category: 1,
      domain: 4,
    };
    global.adp.migration.marketplaceUpliftDomain(obj).then((res) => {
      expect(res.domain).toEqual(1);
    });
  });
});
// ============================================================================================= //
