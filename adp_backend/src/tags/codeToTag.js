// ============================================================================================= //
/**
* [ global.adp.tags.codeToTag ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (PARAM, MODE) => new Promise((RESOLVE) => {
  let result = PARAM;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const codeToTag = (P) => {
    const code = parseInt(P, 10);
    let preResult = P;
    if (Number.isNaN(code)) {
      preResult = P;
    } else if (MODE === 'GROUP') {
      const group = global.adp.tags.groups.filter(g => g.group === code);
      if (group !== undefined) {
        if (group.length === 1) {
          preResult = group[0].name;
        }
      }
    } else {
      preResult = global.adp.tags.items.filter(i => i.id === code);
      if (preResult.length === 1) {
        preResult = preResult[0].tag;
      } else {
        preResult = P;
      }
    }
    return preResult;
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  if (PARAM !== null) {
    let stringResult = '';
    if (PARAM.indexOf(',') >= 0) {
      const myArray = PARAM.split(',');
      myArray.forEach((arrayItem) => {
        const tag = codeToTag(arrayItem);
        if (stringResult === '') {
          stringResult = tag;
        } else {
          stringResult = `${stringResult},${tag}`;
        }
      });
      RESOLVE(stringResult);
      return stringResult;
    }
  }
  result = codeToTag(PARAM);
  RESOLVE(result);
  return result;
});
// ============================================================================================= //
