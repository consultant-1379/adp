/**
* Unit test for [ adp.validations.startDateEndDateValidation]
* @author Abhishek Singh[zihabns]
*/
const validator = require('./startDateEndDateValidation');

describe('Testing [ startDateEndDateValidation ] behavior.', () => {
  it('test for invalid start date format', () => {
    expect(validator('2020-342-114', '2021-03-21')).toEqual('startDate is required and should be in YYYY-MM-DD Format');
  });

  it('test for invalid end date format', () => {
    expect(validator('2020-11-25', '2021-642-224')).toEqual('endDate is required and should be in YYYY-MM-DD Format');
  });

  it('test for start date greater then end date', () => {
    expect(validator('2020-11-25', '2020-03-22')).toEqual('startDate should not exceed endDate');
  });

  it('test for valid start and end dates', () => {
    expect(validator('2020-12-18', '2021-03-21')).toEqual(true);
  });
});
