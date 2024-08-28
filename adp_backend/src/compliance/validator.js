/**
 * This function is used to fill the compliance array with default values in case of missing
 * @param {Array} complianceArray Compliance fields
 * @returns Array with comments filled with empty value in case of missing
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const replenish = (complianceArray) => {
  complianceArray.map(group => group.fields.forEach((field) => {
    const tempField = field;
    if (tempField.comment === undefined) {
      tempField.comment = '';
    } else {
      tempField.comment = tempField.comment.trim();
    }
    return tempField;
  }));
  return complianceArray;
};

/**
 * This method is used to check if there are any duplicate values in array
 * @param {array} arrayToCheck Data to check if there are any duplicate values
 * @param {string} field object key in case of array of object
 * @returns result of validation true/false
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const checkDuplicate = (arrayToCheck, field = null) => {
  let fields = [];
  if (field) {
    fields = arrayToCheck.map(ele => ele[field]);
  }
  return arrayToCheck.length === new Set(fields).size;
};

/**
 * This function is used to validate the compliance array
 * @param {Array} complianceArray Compliance fields
 * @returns Object with validation result. Returns error in case of invalid and
 * formatted array in case of valid.
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const validate = (complianceArray) => {
  let validationResult = '';
  if (!checkDuplicate(complianceArray, 'group')) {
    validationResult = 'Duplicate compliance groups are not allowed';
  } else {
    const complianceOptions = adp.clone(global.adp.complianceOptions.cache.options)
  || '{"answers":[],"groups":[]}';
    const { groups, answers } = JSON.parse(complianceOptions);
    const ansReqComment = answers.filter(ans => ans.commentRequired).map(ans => ans.id);
    const validAnswers = answers.map(ans => ans.id);
    complianceArray.every((comp) => {
      const validGroup = groups.find(group => group.id === comp.group);
      if (validGroup) {
        if (!checkDuplicate(comp.fields, 'field')) {
          validationResult = `Duplicate fields in group '${comp.group}' are not allowed`;
          return false;
        }
        comp.fields.every((field) => {
          const validField = validGroup.fields.find(tempField => tempField.id === field.field);
          if (validField) {
            if (field.answer && validAnswers.includes(field.answer)) {
              if (ansReqComment.includes(field.answer)) {
                if (field.comment && field.comment.trim()) {
                  return true;
                }
                validationResult = `Compliance group '${comp.group}' field '${field.field}' requires comment`;
                return false;
              }
              return true;
            }
            validationResult = `Compliance group '${comp.group}' field '${field.field}' - Invalid answer '${field.answer}'`;
            return false;
          }
          validationResult = `Compliance group '${comp.group}' - Invalid field '${field.field}'`;
          return false;
        });
        return true;
      }
      validationResult = `Compliance - Invalid group '${comp.group}'`;
      return false;
    });
  }
  if (validationResult) {
    return {
      valid: false,
      validationResult,
    };
  }
  const formattedArray = replenish(complianceArray);
  return {
    valid: true,
    formattedArray,
  };
};

module.exports = {
  validate,
};
