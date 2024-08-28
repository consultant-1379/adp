// ============================================================================================= //
/**
* Unit test for [ global.adp.migration.marketplaceFilterChange ]
* @author Omkar
*/
// ============================================================================================= //
describe('Testing [ global.adp.migration.marketplaceFilterChange ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.migration = {};
    global.adp.migration.marketplaceFilterChange = require('./maketplaceFilterChange'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should return "true" (nothing to change), if the parameter follow the rule.', () => {
    const obj = {
      category: 1,
      status: 4,
      serviceType: 5,
      serviceArea: 1,
    };

    expect(global.adp.migration.marketplaceFilterChange(obj)).toBeTruthy();
  });

  it('Should return updated object setting category to integer 3 if it is Idea Box.', () => {
    const obj = {
      category: 'Idea Box',
    };

    expect(global.adp.migration.marketplaceFilterChange(obj).category).toEqual(3);
  });

  it('Should return updated object setting category to integer 1 if it is Fully Supported for Reuse.', () => {
    const obj = {
      category: 'fully supported for reuse',
    };

    expect(global.adp.migration.marketplaceFilterChange(obj).category).toEqual(1);
  });

  it('Should return updated object setting category to integer 2 if it is Check Before for Reuse.', () => {
    const obj = {
      category: 'check before reuse',
    };

    expect(global.adp.migration.marketplaceFilterChange(obj).category).toEqual(2);
  });

  it('Should return updated object setting category to integer 4 if it is deprecated.', () => {
    const obj = {
      category: 'deprecated',
    };

    expect(global.adp.migration.marketplaceFilterChange(obj).category).toEqual(4);
  });

  it('Should return updated object setting serviceArea to 7 if serviceType is 1, 2 or 4.', () => {
    let obj = {
      serviceType: 1,
    };

    expect(global.adp.migration.marketplaceFilterChange(obj).serviceArea).toEqual(7);
    obj = {
      serviceType: 2,
    };

    expect(global.adp.migration.marketplaceFilterChange(obj).serviceArea).toEqual(7);
    obj = {
      serviceType: 4,
    };

    expect(global.adp.migration.marketplaceFilterChange(obj).serviceArea).toEqual(7);
  });

  it('Should return updated object setting status to integer 4 if it is string 4.', () => {
    const obj = {
      status: '4',
    };

    expect(global.adp.migration.marketplaceFilterChange(obj).status).toEqual(3);
  });

  it('Should return updated object setting status to integer if it is string.', () => {
    const obj = {
      status: '1',
    };

    expect(global.adp.migration.marketplaceFilterChange(obj).status).toEqual(1);
  });

  it('Should return updated object setting alignment to integer if it is string.', () => {
    const obj = {
      alignment: '1',
    };

    expect(global.adp.migration.marketplaceFilterChange(obj).alignment).toEqual(1);
  });
});
// ============================================================================================= //
