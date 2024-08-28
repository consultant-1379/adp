const dateValidations = require('./dateValidations');

/**
* [ adp.validations.startDateEndDateValidation ]
* utility for start and end date validation
* @param {string} startDate in format YYYY-MM-DD
* @param {string} endDate in format YYYY-MM-DD
* @return Error string in case of error, otherwise true if not errors
* @author Omkar Sadegaonkar[zsdgmkr]
*/

module.exports = (startDate, endDate) => {
  if (!dateValidations.isValidYYYYMMDDDateFormat(startDate)) {
    return 'startDate is required and should be in YYYY-MM-DD Format';
  }
  if (!dateValidations.isValidYYYYMMDDDateFormat(endDate)) {
    return 'endDate is required and should be in YYYY-MM-DD Format';
  }
  if (new Date(startDate) > new Date(endDate)) {
    return 'startDate should not exceed endDate';
  }
  return true;
};
