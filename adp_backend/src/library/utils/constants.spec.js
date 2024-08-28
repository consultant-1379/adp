/**
* Unit test for [ adp.utils.constants]
* @author Veerender Voskula[zvosvee]
*/
const constants = require('./constants');

describe('Testing [ constants ] behavior.', () => {
  it('test for DATE_UTILS constant exists', () => {
    expect(constants.DATE_UTILS.YYYY_MM_DD_REGEX).toBeTruthy();
  });

  it('test for GROUPS constant exists', () => {
    expect(constants.GROUPS.DEFAULT_GROUP).toBe('Internal Users Group');
  });

  it('test for HTTP STATUS constant exists', () => {
    expect(constants.HTTP_STATUS['400']).toBe('User not found');
  });

  it('test for ROLE constant exists', () => {
    expect(constants.ROLE.ADMIN).toBe('admin');
  });
});
