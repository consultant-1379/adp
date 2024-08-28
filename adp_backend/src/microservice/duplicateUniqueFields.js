// ============================================================================================= //
/**
* [ adp.microservice.duplicateUniqueFields ]
* Search for duplicate fields that should be unique.
* SEARCHFOR could be null, for a full comparison or
* could contains a string, for a unique comparison.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
adp.docs.list.push(__filename);
// ============================================================================================= //
const duplicateUniqueFieldsForMongo = (SEARCHFOR, IDEXCEPT) => new Promise((RESOLVE, REJECT) => {
  const timer = new Date();
  const packName = 'adp.microservice.duplicateUniqueFields';
  const model = new adp.models.Adp();
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  if (SEARCHFOR === null || SEARCHFOR === undefined) {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    model.getAssetDuplicateNames()
      .then((RESULT) => {
        if (RESULT.docs.length === 0) {
          RESOLVE(true);
        } else {
          const filtered = { namesDuplicated: [] };
          RESULT.docs.forEach((ITEM) => {
            adp.echoLog(`>>>> WARNING >>>> WARNING >>>> "${ITEM._id.name}" is duplicated ${ITEM.count} times!!!`, null, 500, packName, true);
            filtered.namesDuplicated.push({ microservice: ITEM._id.name, quant: ITEM.count });
          });
          adp.echoLog(`All possible duplicated Asset names checked in ${(new Date()) - timer}ms`, null, 200, packName);
          if (filtered.namesDuplicated.length === 0) {
            RESOLVE(true);
          } else {
            RESOLVE(filtered);
          }
        }
      })
      .catch((ERROR) => {
        REJECT(ERROR);
      });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  } else {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const searchfor = (`${SEARCHFOR}`).trim().toLowerCase();
    let idExcept = null;
    if (IDEXCEPT !== null && IDEXCEPT !== undefined) {
      idExcept = (`${IDEXCEPT}`).trim();
    }
    model.getAssetDuplicateNames(searchfor, idExcept)
      .then((RESULT) => {
        if (RESULT.docs.length === 0) {
          RESOLVE(true);
        } else {
          const searchforSlug = adp.slugIt(searchfor);
          const thereIsDuplicateForName = RESULT.docs
            .filter(ITEM => (`${ITEM._id.name}`.trim().toLowerCase() === searchfor)
            && (!ITEM.ids.includes(idExcept)));
          const thereIsDuplicateForSlug = RESULT.docs
            .filter(ITEM => (adp.slugIt(`${ITEM._id.name}`.trim()) === searchforSlug)
            && (!ITEM.ids.includes(idExcept)));
          if (thereIsDuplicateForName.length === 0 && thereIsDuplicateForSlug.length === 0) {
            adp.echoLog(`SUCCESS: There is no duplicates for "${searchfor}" in ${(new Date()) - timer}ms`, null, 200, packName);
            RESOLVE(true);
          } else {
            let errorMSG = '';
            const hasID = idExcept !== null;
            const bName = thereIsDuplicateForName.length === 0;
            const bSlug = thereIsDuplicateForSlug.length === 0;
            let hasName = '';
            let hasSlug = '';
            if (!bName) {
              hasName = thereIsDuplicateForName[0]._id.name;
            }
            if (!bSlug) {
              hasSlug = adp.slugIt(thereIsDuplicateForSlug[0]._id.name);
            }
            if (hasID && !bName && bSlug) {
              errorMSG = `The name "${hasName}" belongs to another Microservice. You cannot use this name.`;
            } else if (hasID && bName && !bSlug) {
              errorMSG = `This name generates a link "${hasSlug}" which already belongs to another Microservice. You cannot use this name.`;
            } else if (hasID && !bName && !bSlug) {
              errorMSG = `The name "${hasName}" belongs to another Microservice. You cannot use this name.`;
            } else if (!hasID && !bName && bSlug) {
              errorMSG = `The name "${hasName}" already exists. You cannot use this name.`;
            } else if (!hasID && bName && !bSlug) {
              errorMSG = `This name generates a link "${hasSlug}" which already belongs to another Microservice. You cannot use this name.`;
            } else if (!hasID && !bName && !bSlug) {
              errorMSG = `The name "${hasName}" already exists. You cannot use this name.`;
            }
            adp.echoLog(`ERROR: There is duplicate(s) for "${searchfor}" in ${(new Date()) - timer}ms`, null, 200, packName);
            REJECT(errorMSG);
          }
        }
      })
      .catch((ERROR) => {
        REJECT(ERROR);
      });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
module.exports = (
  SEARCHFOR = null,
  IDEXCEPT = null,
) => new Promise((RESOLVE, REJECT) => {
  duplicateUniqueFieldsForMongo(SEARCHFOR, IDEXCEPT)
    .then(RESULT => RESOLVE(RESULT))
    .catch(ERROR => REJECT(ERROR));
});
// ============================================================================================= //
