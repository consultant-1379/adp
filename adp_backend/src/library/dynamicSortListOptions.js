// ============================================================================================= //
/**
* [ global.adp.dynamicSortListOptions ]
* Sort dynamic array function, following an ListOptions field.
* @param {String} FIELD String or Array of Strings:
* The name of the field/fields which should be sorted - from ListOptions.
* @return {JSON} Returns the order.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (FIELD, LISTOPTIONS) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const listOptions = LISTOPTIONS;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const dynamicSortListOptionsInternalFunction = (FIELDNAME) => {
    const regExpExtraSpaces = new RegExp(/(\s\s+)/gim);
    let field = FIELDNAME;
    let sortOrder = 1;
    if (field[0] === '-') {
      sortOrder = -1;
      field = field.substr(1);
    }
    const isListOptionField = listOptions.some(ITEM => ITEM.slug === field);
    if (!isListOptionField) {
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
    }
    return (a, b) => {
      const listOptionFilteredArray = listOptions.filter((ITEM) => {
        if (ITEM.slug === field) {
          return true;
        }
        return false;
      });
      let result = 0;
      if (Array.isArray(listOptionFilteredArray) && listOptionFilteredArray.length > 0) {
        const listOptionItems = listOptionFilteredArray[0].items;
        const itemA = listOptionItems.filter(ITEM => ITEM.id === a[field]);
        const itemB = listOptionItems.filter(ITEM => ITEM.id === b[field]);
        if (Array.isArray(itemA) && Array.isArray(itemB) && itemA.length > 0 && itemB.length > 0) {
          const orderA = itemA[0].order;
          const orderB = itemB[0].order;
          if (orderA < orderB) {
            result = -1;
          } else if (orderA > orderB) {
            result = 1;
          } else {
            result = 0;
          }
        }
      }
      return result * sortOrder;
    };
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const dynamicSortMultipleListOptionsInternalFunction = (argumentsArray) => {
    const props = argumentsArray;
    return (obj1, obj2) => {
      let i = 0;
      let result = 0;
      const numberOfProperties = props.length;
      /* eslint-disable no-await-in-loop */
      while (result === 0 && i < numberOfProperties) {
        result = dynamicSortListOptionsInternalFunction(props[i])(obj1, obj2);
        i += 1;
      }
      /* eslint-enable no-await-in-loop */
      return result;
    };
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  if (Array.isArray(FIELD)) {
    return dynamicSortMultipleListOptionsInternalFunction(FIELD);
  }
  return dynamicSortListOptionsInternalFunction(FIELD);
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
};
// ============================================================================================= //
