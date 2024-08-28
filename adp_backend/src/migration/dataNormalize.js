// ============================================================================================= //
/**
* [ global.adp.migration.dataNormalize ]
* Look the field names and try to convert to numbers, following the listOptions
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (MS) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  if (global.adp.listOptions === undefined
    || global.adp.listOptions === null) {
    return false;
  }
  if (global.adp.listOptions.cache === undefined
    || global.adp.listOptions.cache === null) {
    return false;
  }
  if (global.adp.listOptions.cache.options === undefined
    || global.adp.listOptions.cache.options === null) {
    return false;
  }
  const listOptions = JSON.parse(global.adp.listOptions.cache.options);
  Object.keys(MS).forEach((KEY) => {
    const theValue = MS[KEY];
    const listOptionsByKey = listOptions.filter((ITEM) => {
      if (ITEM.slug === KEY) {
        return true;
      }
      return false;
    });
    if (Array.isArray(listOptionsByKey)) {
      const { items } = listOptionsByKey[0];
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      const findObjectByName = items.filter((OPTION) => {
        const stringOne = `${OPTION.name.trim().toLowerCase()}`;
        const stringTwo = `${theValue.trim().toLowerCase()}`;
        if (stringOne === stringTwo) {
          return true;
        }
        return false;
      });
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      if (Array.isArray(findObjectByName)) {
        if (findObjectByName.length === 1) {
          // eslint-disable-next-line no-param-reassign
          MS[KEY] = findObjectByName[0].id;
        }
      }
    }
  });
  return MS;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
};
// ============================================================================================= //
