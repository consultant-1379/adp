// ============================================================================================= //
/**
* Unit test for [ global.adp.migration.oldToNewServiceOwnerStyle ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.migration.oldToNewServiceOwnerStyle ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.migration = {};
    global.adp.migration.oldToNewServiceOwnerStyle = require('./oldToNewServiceOwnerStyle'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should return "true" (nothing to change), if the parameter follow the rule.', () => {
    const obj = {
      owner: 'esupuse',
      team: [
        { signum: 'esupuse', serviceOwner: true },
        { signum: 'etesuse', serviceOwner: false },
        { signum: 'emesuse', serviceOwner: false },
      ],
    };

    expect(global.adp.migration.oldToNewServiceOwnerStyle(obj)).toBeTruthy();
  });

  it('Should return the updated object, if the parameter does not follow the rule.', () => {
    const obj = {
      owner: 'esupuse',
      team: [
        { signum: 'esupuse' },
        { signum: 'etesuse' },
        { signum: 'emesuse' },
      ],
    };
    const expectObj = {
      owner: 'esupuse',
      team: [
        { signum: 'esupuse', serviceOwner: true },
        { signum: 'etesuse', serviceOwner: false },
        { signum: 'emesuse', serviceOwner: false },
      ],
    };

    expect(global.adp.migration.oldToNewServiceOwnerStyle(obj)).toEqual(expectObj);
  });

  it('Should return "true" (nothing to change), if the parameter is soft deleted.', () => {
    const obj = {
      owner: 'esupuse',
      team: [
        { signum: 'esupuse' },
        { signum: 'etesuse' },
        { signum: 'emesuse' },
      ],
      deleted: true,
    };

    expect(global.adp.migration.oldToNewServiceOwnerStyle(obj)).toBeTruthy();
  });

  it('Should return "true" (nothing to change), if TEAM is not an Array.', () => {
    const obj = {
      owner: 'esupuse',
    };

    expect(global.adp.migration.oldToNewServiceOwnerStyle(obj)).toBeTruthy();
  });
});
// ============================================================================================= //
