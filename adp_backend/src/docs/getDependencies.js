// ============================================================================================= //
/**
* [ global.adp.docs.getDependencies ]
* Analyse the code and return an array with all API Objects.
* This file is able to analyse itself.
* @param {str} CODE Code to analyse.
* @return {array} An array with the dependencies.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (CODE) => {
  if (CODE === undefined || CODE === null) {
    return ['No Dependencies'];
  }
  if (CODE === '' || CODE === [] || CODE === {}) {
    return ['No Dependencies'];
  }
  if (typeof CODE !== 'string' && !(CODE instanceof String)) {
    return ['No Dependencies'];
  }
  const clearExpectionStepOne = CODE.replace('/global\\.adp\\.docs\\.list\\.push\\(__filename\\)/gim', '');
  const clearExpectionStepTwo = clearExpectionStepOne.replace(/global\.adp\.docs\.list\.push\(__filename\)/gim, '');
  const regExGetInternalObjects = new RegExp(/((global.)([.A-Za-z0-9])+)/gim);
  const objectNamesArray = clearExpectionStepTwo.match(regExGetInternalObjects);
  if (objectNamesArray === null || objectNamesArray === undefined) {
    return ['No Dependencies'];
  }
  const uniqueElementsArray = objectNamesArray
    .filter((elem, pos, arr) => arr
      .indexOf(elem) === pos);
  return uniqueElementsArray;
};
// ============================================================================================= //
