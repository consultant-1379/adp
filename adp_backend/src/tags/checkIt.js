// ============================================================================================= //
/**
* [ global.adp.tags.checkIt ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (TAGS, USEROBJ) => new Promise(async (RESOLVE, REJECT) => {
  const packName = 'global.adp.tags.checkIt';
  await global.adp.tags.reload()
    .catch((ERROR) => {
      const errorText = 'Error on [ adp.tags.reload ]';
      const errorObject = { error: ERROR };
      adp.echoLog(errorText, errorObject, 500, packName, true);
    });
  if (Array.isArray(TAGS)) {
    if (TAGS.length > 0) {
      let onlyString = true;
      TAGS.forEach((ITEM) => {
        if (typeof ITEM !== 'string') {
          onlyString = false;
        }
      });
      if (onlyString) {
        RESOLVE(TAGS);
        return;
      }
    }
  }
  let tags = TAGS;
  const result = [];
  const promises = [];
  const saveNew = (LABEL) => {
    promises.push(global.adp.tags.newTag(LABEL, USEROBJ)
      .then((RES) => {
        result.push(RES);
      })
      .catch((ERR) => {
        const errorText = 'Error in [ adp.tags.newTag ]';
        const errorOBJ = {
          label: LABEL,
          user: USEROBJ,
          error: ERR,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
        REJECT(ERR);
      }));
  };
  let tagsAreOk = true;
  const regExpOnlyAlphaNumericAndSpace = new RegExp(/([a-zA-Z0-9 ])+/gim);
  tags.forEach((TAG) => {
    if (tagsAreOk) {
      const tag = TAG;
      tag.label = tag.label.trim();
      if (tag.label.length === 0) {
        const err = 'Tag cannot be empty or contain only spaces.';
        adp.echoLog(err, { label: tag.label, user: USEROBJ }, 400, packName, true);
        REJECT(err);
        tagsAreOk = false;
      }
      if (tagsAreOk) {
        const alphaNumericSpace = tag.label.match(regExpOnlyAlphaNumericAndSpace).toString();
        if (alphaNumericSpace !== tag.label) {
          const err = `The Tag "${tag.label}" contains invalid characters.`;
          adp.echoLog(err, { label: tag.label, user: USEROBJ }, 400, packName, true);
          REJECT(err);
          tagsAreOk = false;
        }
        if (tagsAreOk) {
          const regExpMoreThanOneSpace = new RegExp(/( )+( )/gim);
          tag.label = tag.label.replace(regExpMoreThanOneSpace, ' ');
          tag.label = tag.label.toLowerCase()
            .split(' ')
            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
        }
      }
    }
  });
  if (tagsAreOk) {
    const tagsClear = [];
    tags.forEach((T) => {
      const already = tagsClear.filter(E => E.label.toLowerCase() === T.label.toLowerCase());
      if (already.length === 0) {
        tagsClear.push(T);
      }
    });
    tags = tagsClear;
  }
  if (!tagsAreOk) {
    return;
  }
  let somethingNew = false;
  tags.forEach((tag) => {
    let isCorrectID = true;
    const haveID = (tag.id !== null && tag.id !== undefined && tag.id !== '');
    if (haveID) {
      const tagInMemoryByID = global.adp.tags.items.filter(t => t.id === tag.id);
      const tagInMemoryByLabel = global.adp.tags.items
        .filter(t => t.tag.toLowerCase() === tag.label.toLowerCase());
      if (tagInMemoryByID.length === 1 && tagInMemoryByLabel.length === 1) {
        if (tagInMemoryByID[0].id !== tagInMemoryByLabel[0].id) {
          isCorrectID = false;
          let errorMSG = `The Tag [${tag.label}] is trying to be saved with the ID [${tag.id}],`;
          errorMSG = `${errorMSG} but this ID belongs to [${tagInMemoryByID[0].tag}].`;
          const errorOBJ = { label: tag.label, id: tag.id, existId: tagInMemoryByID[0] };
          adp.echoLog(errorMSG, errorOBJ, 500, packName, true);
          REJECT(errorMSG);
          return;
        }
      } else if (tagInMemoryByID.length === 0 && tagInMemoryByLabel.length === 1) {
        isCorrectID = false;
        let errorMSG = `The Tag [${tag.label}] is trying to be saved with the ID [${tag.id}],`;
        errorMSG = `${errorMSG} but this ID doesn't exists.`;
        errorMSG = `${errorMSG} The correct ID for this Tag is [${tagInMemoryByLabel[0].id}].`;
        errorMSG = `${errorMSG} Please, resend this request with the correct ID.`;
        const errorOBJ = {
          label: tag.label,
          id: tag.id,
          correctId: tagInMemoryByLabel[0].id,
          correctObject: tagInMemoryByLabel[0],
        };
        adp.echoLog(errorMSG, errorOBJ, 500, packName, true);
        REJECT(errorMSG);
        return;
      } else if (tagInMemoryByID.length === 1 && tagInMemoryByLabel.length === 0) {
        isCorrectID = false;
        let errorMSG = `The Tag [${tag.label}] is trying to be saved with the ID [${tag.id}],`;
        errorMSG = `${errorMSG} but this ID belongs to [${tagInMemoryByID[0].tag}].`;
        const errorOBJ = {
          label: tag.label,
          id: tag.id,
          existsId: tagInMemoryByID[0].id,
          existsObject: tagInMemoryByID[0],
        };
        adp.echoLog(errorMSG, errorOBJ, 500, packName, true);
        REJECT(errorMSG);
        return;
      } else if (tagInMemoryByID.length === 0 && tagInMemoryByLabel.length === 0) {
        isCorrectID = false;
        let errorMSG = `The Tag [${tag.label}] is trying to be saved with the ID [${tag.id}],`;
        errorMSG = `${errorMSG} but the ID and the Tag are unknown.`;
        errorMSG = `${errorMSG} To save a new Tag, send an empty string as Tag ID.`;
        const errorOBJ = {
          label: tag.label,
          id: tag.id,
        };
        adp.echoLog(errorMSG, errorOBJ, 500, packName, true);
        REJECT(errorMSG);
        return;
      }
      if (isCorrectID) {
        const tagFound = global.adp.tags.items.filter(t => t.id === tag.id);
        if (tagFound.length === 0) {
          const tagFoundByName = global.adp.tags.items
            .filter(t => t.tag.toLowerCase() === tag.label.toLowerCase());
          if (tagFoundByName.length === 0) {
            // New Tag and add the New Code to Result
            somethingNew = true;
            saveNew(tag.label);
          } else {
            // Add Exists Code to Result
            result.push(tagFoundByName[0].id);
          }
        } else if (tagFound.length === 1) {
          // Add Exists Code to Result
          result.push(tag.id);
        }
      }
    } else {
      // New Tag and add the New Code to Result
      somethingNew = true;
      saveNew(tag.label);
    }
  });
  Promise.all(promises)
    .then((RESULTS) => {
      if (Array.isArray(RESULTS) && RESULTS.length > 0) {
        adp.echoLog(RESULTS, null, 200, packName);
      }
      RESOLVE(result);
      if (somethingNew) {
        // Reloading Tags in Memory
        global.adp.tags.reload()
          .catch((ERROR) => {
            const errorText = 'Error on [ adp.tags.reload ] in Promise.all';
            const errorObject = { error: ERROR };
            adp.echoLog(errorText, errorObject, 500, packName, true);
          });
      }
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ Promise.all ]';
      const errorOBJ = {
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
