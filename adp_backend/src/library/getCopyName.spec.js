// ============================================================================================= //
/**
* Unit test for [ middleware.rbac.groups.createDuplicate ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
const getCopyName = require('./getCopyName');

describe('Testing [ utils.shared.getCopyName ] behavior', () => {
  it('Get name with word COPY word appended if nothing in duplicate.', (done) => {
    const oldName = 'test';
    const allNames = ['test 1', 'test 2'];

    expect(getCopyName(oldName, allNames)).toEqual('test Copy');
    done();
  });

  it('Get name with word COPY 1 word appended if one in duplicate.', (done) => {
    const oldName = 'test';
    const allNames = ['test 1', 'test 2', 'test Copy'];

    expect(getCopyName(oldName, allNames)).toEqual('test Copy 1');
    done();
  });
});
// ============================================================================================= //
