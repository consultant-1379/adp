// ============================================================================================= //
/**
* [ global.adp.tags.newTag ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (TAGNAME, USEROBJ) => new Promise((RESOLVE, REJECT) => {
  const packName = 'global.adp.tags.newTag';
  const tagModel = new adp.models.Tag();
  let tagName = TAGNAME;
  tagName = tagName.trim();
  if (tagName.length === 0) {
    const errorMSG = 'Empty Tag';
    REJECT(errorMSG);
    return;
  }
  const tagFound = global.adp.tags.items.filter(t => t.tag.toLowerCase() === tagName.toLowerCase());
  if (tagFound.length === 0) {
    tagModel.getByName(tagName)
      .then((RES) => {
        if (RES.resultsReturned === 0) {
          const newTag = {
            group: '5c2941141c64cfbcea47e8b160047f46',
            type: 'tag',
            tag: `${tagName}`,
            createdby: `${USEROBJ.signum.trim().toLowerCase()}`,
            createdon: new Date(),
            order: 1,
          };
          tagModel.createOne(newTag)
            .then((expectedOBJ) => {
              if (expectedOBJ.ok === true) {
                adp.echoLog(`New tag "${tagName}" created!`, null, 200, packName);
                global.adp.tags.reload(true)
                  .then(() => {
                    RESOLVE(expectedOBJ.id);
                  });
              } else {
                const errorMSG = `ERROR: Return of Database is not true: "${expectedOBJ.ok}"`;
                const errorOBJ = {
                  databaseAnswer: expectedOBJ,
                };
                adp.echoLog(errorMSG, errorOBJ, 500, packName, true);
                REJECT(errorMSG);
              }
            })
            .catch((ERR) => {
              const errorText = 'Error in [ tagModel.createOne ]';
              const errorOBJ = {
                database: 'dataBaseTag',
                newTag,
                error: ERR,
              };
              adp.echoLog(errorText, errorOBJ, 500, packName, true);
            });
        } else {
          adp.echoLog(`Tag "${tagName}" already exists... cannot create!`, null, 500, packName, true);
          // eslint-disable-next-line no-underscore-dangle
          RESOLVE(RES.docs[0]._id);
        }
      })
      .catch((ERROR) => {
        const errorText = 'Error in [ tagModel.findByName ]';
        const errorOBJ = {
          database: 'dataBaseTag',
          error: ERROR,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
        REJECT();
      });
  } else {
    RESOLVE(tagFound[0].id);
  }
});
// ============================================================================================= //
