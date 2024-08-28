// ============================================================================================= //
/**
* [ adp.validations.dateValidations ]
* utility for date validations
* @author Veerender Voskula[zvosvee]
*/
// ============================================================================================= //

const isValidYYYYMMDDDateFormat = value => /^\d{4}-\d{2}-(0[1-9]|[12]\d|3[01])$/gi.test(value);

module.exports = {
  isValidYYYYMMDDDateFormat,
};
