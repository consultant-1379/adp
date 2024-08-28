// ============================================================================================= //
/**
* [ global.adp.versionSort ]
* Sort dynamic array function for "Versions".
* @param {String} FIELD String or Array of Strings:
* The name of the field/fields which should be sorted.
* @return {JSON} Returns the order.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (FIELD) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const versionSortInternalFunction = (FIELDNAME) => {
    const regExpExtraSpaces = new RegExp(/(\s\s+)/gim);
    const specialChars = new RegExp((/\W+/gim));
    let field = FIELDNAME;
    let sortOrder = 1;
    if (field[0] === '-') {
      sortOrder = -1;
      field = field.substr(1);
    }
    return (FULLOBJECTA, FULLOBJECTB) => {
      let valueA = FULLOBJECTA[field];
      let valueB = FULLOBJECTB[field];
      if (typeof valueA === 'string') {
        valueA = valueA.replace(regExpExtraSpaces, ' ');
        valueA = valueA.toUpperCase();
      }
      if (typeof valueB === 'string') {
        valueB = valueB.replace(regExpExtraSpaces, ' ');
        valueB = valueB.toUpperCase();
      }
      valueA = valueA.split(specialChars);
      valueB = valueB.split(specialChars);
      const valueALen = valueA.length;
      const valueBLen = valueB.length;
      let smallest = valueALen;
      if (smallest > valueBLen) {
        smallest = valueBLen;
      }
      let index = 0;
      let draw = true;
      let result = 0;
      for (index = 0; index < smallest; index += 1) {
        let targetA = valueA[index];
        let targetB = valueB[index];
        let isAllNumbers = true;
        if (!Number.isNaN(parseInt(targetA, 10))) {
          targetA = parseInt(targetA, 10);
        } else {
          isAllNumbers = false;
        }
        if (!Number.isNaN(parseInt(targetB, 10))) {
          targetB = parseInt(targetB, 10);
        } else {
          isAllNumbers = false;
        }
        if (isAllNumbers) {
          if (targetA < targetB) {
            result = -1;
            draw = false;
            index = smallest;
          } else if (targetA > targetB) {
            result = 1;
            draw = false;
            index = smallest;
          } else {
            draw = true;
          }
        } else if (`${targetA}` < `${targetB}`) {
          result = -1;
          draw = false;
          index = smallest;
        } else if (`${targetA}` > `${targetB}`) {
          result = 1;
          draw = false;
          index = smallest;
        } else {
          draw = true;
        }
      }
      if (draw) {
        return 0;
      }
      return result * sortOrder;
    };
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const versionSortMultipleInternalFunction = (argumentsArray) => {
    const props = argumentsArray;
    return (obj1, obj2) => {
      let i = 0;
      let result = 0;
      const numberOfProperties = props.length;
      /* eslint-disable no-await-in-loop */
      while (result === 0 && i < numberOfProperties) {
        result = versionSortInternalFunction(props[i])(obj1, obj2);
        i += 1;
      }
      /* eslint-enable no-await-in-loop */
      return result;
    };
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  if (Array.isArray(FIELD)) {
    return versionSortMultipleInternalFunction(FIELD);
  }
  return versionSortInternalFunction(FIELD);
};
// ============================================================================================= //
