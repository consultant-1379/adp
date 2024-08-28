// ============================================================================================= //
/**
* [ global.adp.tags.getLabel ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (PARAM) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const packName = 'global.adp.tags.getLabel';
  let preResult;
  if (global.adp.tags !== undefined && global.adp.tags !== null) {
    if (Array.isArray(global.adp.tags.items)) {
      const tagItems = global.adp.clone(global.adp.tags.items);
      if (Array.isArray(tagItems)) {
        preResult = [];
        tagItems.forEach((TAGITEM) => {
          if (typeof PARAM === 'string') {
            if (TAGITEM.id === PARAM) {
              preResult.push(TAGITEM);
            }
          } else {
            const checkTagItem = (TAGITEM !== undefined && TAGITEM !== null);
            const checkParam = (PARAM !== undefined && PARAM !== null);
            if (checkTagItem && checkParam) {
              if (TAGITEM.id === PARAM.id && TAGITEM.tag === PARAM.label) {
                preResult.push(TAGITEM);
              }
            }
          }
        });
        if (Array.isArray(preResult)) {
          if (preResult.length === 1) {
            return preResult[0].tag;
          }
          if (preResult.length === 0) {
            const errorText = `The tag "${PARAM}" was not found on [ adp.tags.items ]`;
            const errorOBJ = {
              parameter: PARAM,
              tags: adp.tags.items,
            };
            adp.echoLog(errorText, errorOBJ, 500, packName, true);
            return 'ERROR';
          }
          if (preResult.length > 1) {
            const errorText = `The tag "${PARAM}" has more than one match on [ adp.tags.items ]`;
            const errorOBJ = {
              parameter: PARAM,
              preResult,
              tags: adp.tags.items,
            };
            adp.echoLog(errorText, errorOBJ, 500, packName, true);
            return 'ERROR';
          }
        }
      } else {
        const errorText = '[ adp.clone ] fail to clone [ adp.tags.items ]';
        const errorOBJ = {
          parameter: PARAM,
          preResult,
          tags: adp.tags.items,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
      }
    } else {
      const errorText = '[ adp.tags.items ] is not an Array';
      const errorOBJ = {
        tags: adp.tags.items,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
    }
  } else {
    const errorText = '[ adp.tags ] looks invalid';
    const errorOBJ = {
      tags: adp.tags,
    };
    adp.echoLog(errorText, errorOBJ, 500, packName, true);
  }
  return 'ERROR';
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
};
// ============================================================================================= //
