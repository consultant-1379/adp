/**
* Unit test for [ adp.validations.dateValidations]
* @author Veerender Voskula[zvosvee]
*/
const dateValidations = require('./dateValidations');

describe('Testing [ dateValidations ] behavior.', () => {
  it('test for valid yyyy-mm-dd format', () => {
    expect(dateValidations.isValidYYYYMMDDDateFormat('2013-12-31')).toBeTruthy();
  });

  it('test for invalid yyyy-mm-dd format', () => {
    expect(dateValidations.isValidYYYYMMDDDateFormat('213-12-31')).toBeFalsy();
  });
});
