// ============================================================================================= //
/**
* [ global.adp.microservices.denormalize ]
* Returns an object which contains the denormalized fields of the provided microservice.
* @param {Object} ASSET The microservice object to find denormalized data for.
* @return {Object} An object containing the denormalized fields only.
* @author John Dolan [ejohdol], Armando Schiavon Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = ASSET => new Promise(async (RESOLVE, REJECT) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  let objectToReturn = {};
  global.adp.listOptions.get()
    .then((OPTIONS) => {
      const lookup = JSON.parse(OPTIONS);
      const fields = {};
      lookup.forEach((LOOKITEM) => {
        fields[LOOKITEM.slug] = LOOKITEM.id;
      });
      // --------------------------------------------------------------------------------------- //
      const checkLevel = (THISASSET) => {
      // --------------------------------------------------------------------------------------- //
        const internalObjectToReturn = {};
        //   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   //
        Object.keys(THISASSET).forEach((KEY) => {
          //   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   --- //
          let foundKey = [];
          let foundKeyItem = null;
          let itemValue = null;
          let fieldName = null;
          switch (KEY) {
            case 'categoryId': // Exception - The name and the Slug are differents!
              foundKey = lookup.filter(ITEM => ITEM.slug === 'documentation-categories');
              if (foundKey.length === 1) {
                // eslint-disable-next-line prefer-destructuring
                foundKeyItem = foundKey[0];
                itemValue = THISASSET.categoryId;
                fieldName = 'categoryId';
              }
              break;
            case 'titleId': // Exception - The name and the Slug are differents!
              foundKey = lookup.filter(ITEM => ITEM.slug === 'documentation-titles');
              if (foundKey.length === 1) {
                // eslint-disable-next-line prefer-destructuring
                foundKeyItem = foundKey[0];
                itemValue = THISASSET.titleId;
                fieldName = 'titleId';
              }
              break;
            case 'menu_auto':
              internalObjectToReturn[KEY] = THISASSET[KEY] ? 'Automated' : 'Manual';
              break;
            case 'compliance':
              internalObjectToReturn[KEY] = global.adp.compliance
                .denormalize.denormalizeFields(THISASSET[KEY]);
              break;
            default: // The name and the Slug are the same!
              foundKey = lookup.filter(ITEM => ITEM.slug === KEY);
              if (foundKey.length === 1) {
                // eslint-disable-next-line prefer-destructuring
                foundKeyItem = foundKey[0];
                fieldName = foundKeyItem.slug;
                itemValue = THISASSET[foundKeyItem.slug];
              } else {
                itemValue = THISASSET[KEY];
                if (Array.isArray(itemValue)) {
                  const subObjectToReturn = [];
                  itemValue.forEach((SUBITEMVALUE) => {
                    subObjectToReturn.push(
                      typeof SUBITEMVALUE === 'object' ? checkLevel(SUBITEMVALUE) : SUBITEMVALUE,
                    );
                  });
                  internalObjectToReturn[KEY] = subObjectToReturn;
                }
                itemValue = null;
              }
              break;
          }
          if (itemValue !== null) {
            const foundItem = foundKeyItem.items.filter(SUBITEM => SUBITEM.id === itemValue);
            if (foundItem.length === 1) {
              const foundItemObject = foundItem[0];
              if (foundItemObject.adminOnly) {
                internalObjectToReturn[fieldName] = null;
              } else {
                internalObjectToReturn[fieldName] = (foundItemObject.code && foundItemObject.code !== '0')
                  ? `${foundItemObject.code} : ${foundItemObject.name}` : `${foundItemObject.name}`;
              }
            }
          }
          //   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   --- //
        });
        //   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   //
        return internalObjectToReturn;
      // --------------------------------------------------------------------------------------- //
      };
      // --------------------------------------------------------------------------------------- //
      objectToReturn = checkLevel(ASSET);
      RESOLVE(objectToReturn);
    })
    .catch((ERROR) => {
      const packName = 'adp.microservices.denormalize';
      adp.echoLog('Error in [ adp.listOptions.get ]', { error: ERROR }, 500, packName, true);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
