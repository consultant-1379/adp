// ============================================================================================= //
/**
* [ global.adp.dynamicSort ]
* Sort dynamic array function.
* @param {String} FIELD String or Array of Strings:
* The name of the field/fields which should be sorted.
* @return {JSON} Returns the order.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (FIELD) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const dynamicSortInternalFunction = (FIELDNAME) => {
    const regExpExtraSpaces = new RegExp(/(\s\s+)/gim);
    let field = FIELDNAME;
    let sortOrder = 1;
    if (field[0] === '-') {
      sortOrder = -1;
      field = field.substr(1);
    }
    return (a, b) => {
      let result = 0;
      let aF = a[field];
      let bF = b[field];
      if (typeof aF === 'string') {
        aF = aF.replace(regExpExtraSpaces, ' ');
        aF = aF.toUpperCase();
      }
      if (typeof bF === 'string') {
        bF = bF.replace(regExpExtraSpaces, ' ');
        bF = bF.toUpperCase();
      }
      if (aF < bF) {
        result = -1;
      } else if (aF > bF) {
        result = 1;
      }
      return result * sortOrder;
    };
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const dynamicSortMultipleInternalFunction = (argumentsArray) => {
    const props = argumentsArray;
    return (obj1, obj2) => {
      let i = 0;
      let result = 0;
      const numberOfProperties = props.length;
      /* eslint-disable no-await-in-loop */
      while (result === 0 && i < numberOfProperties) {
        result = dynamicSortInternalFunction(props[i])(obj1, obj2);
        i += 1;
      }
      /* eslint-enable no-await-in-loop */
      return result;
    };
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  if (Array.isArray(FIELD)) {
    return dynamicSortMultipleInternalFunction(FIELD);
  }
  return dynamicSortInternalFunction(FIELD);
};
// ============================================================================================= //
