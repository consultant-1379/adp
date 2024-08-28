// ============================================================================================= //
/**
* [ global.adp.notification.buildAssetData ]
*/
/* eslint-disable camelcase */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
/**
 * This function is used  to check if documentation exists, if yes, then doc mode will be shown
 * else no need to show doc mode
 * @param {Array} emailAsset Email asset data
 * @author Omkar
 */
const eliminateDocMode = (emailAsset) => {
  const emailAssetHere = emailAsset;
  // Check the documentation mode and consider appropriate documentation
  if (emailAssetHere.menu_auto) {
    delete emailAssetHere.menu;
    if (!Object.values(emailAssetHere.repo_urls).some(url => url)) {
      delete emailAssetHere.repo_urls;
      delete emailAssetHere.menu_auto;
    }
  } else {
    delete emailAssetHere.repo_urls;
    // check if valid documentation (manual) object exists
    const manualDevelopmentExists = emailAsset.menu.manual.development
                                    && emailAsset.menu.manual.development.length;
    const manualReleaseExists = emailAsset.menu.manual.release
                                && emailAsset.menu.manual.release.length;
    if (!(manualDevelopmentExists || manualReleaseExists)) {
      delete emailAssetHere.menu;
      delete emailAssetHere.menu_auto;
    }
  }
  return emailAssetHere;
};

module.exports = MAILOBJECT => new Promise(async (RESOLVE) => {
  const packName = 'global.adp.notification.buildAssetData';
  const assetData = [];
  let tempObject = {};
  const emailSchema = MAILOBJECT.mailSchema;
  let emailAsset = MAILOBJECT.asset; // the microservice data being saved
  const { enableHighlight } = MAILOBJECT;
  let denormalized = {};

  emailAsset = await eliminateDocMode(emailAsset);
  await global.adp.microservices.denormalize(emailAsset)
    .then((DENORMALIZED) => {
      denormalized = DENORMALIZED;
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ adp.microservices.denormalize ]. Because of this error, denormalized = {} but the function continues.';
      adp.echoLog(errorText, { error: ERROR }, 500, packName, false);
      denormalized = {};
    });
  emailSchema.forEach((field) => {
    tempObject = {
      field: '', value: '', oldvalue: '', items: { values: [], oldValues: [] }, highlight: enableHighlight && field.notify_admin_on_change,
    };
    tempObject.field = field.mail_name;
    if (('items' in field || Array.isArray(emailAsset[field.field_name])) && emailAsset[field.field_name] !== undefined) {
      tempObject.value = '';
      tempObject.items.values = [];
      switch (field.field_name) {
        case 'tags': {
          const tempTags = [];
          let tempTagObj = {};
          if (emailAsset.tags !== null && emailAsset.tags !== undefined) {
            emailAsset[field.field_name].forEach((tag) => {
              const myLabel = global.adp.tags.getLabel(tag);
              if (myLabel !== 'ERROR') {
                tempTagObj = {};
                tempTagObj.field = '';
                tempTagObj.value = myLabel;
                tempTags.push(tempTagObj);
              } else {
                tempTags.push('INVALID TAG');
              }
            });
            tempObject.items.values.push(tempTags);
          }
          break;
        }
        case 'team':
        case 'additional_information': {
          let tempArray = [];
          let tempObj = {};
          emailAsset[field.field_name].forEach((result, index) => {
            tempObj = {};
            tempArray = [];
            field.items.forEach((itemKey) => {
              tempObj = {};
              tempObj.field = itemKey.mail_name;
              if (JSON.stringify(denormalized) !== '{}' && denormalized[field.field_name] && itemKey.field_name in denormalized[field.field_name][index]) {
                tempObj.value = denormalized[field.field_name][index][itemKey.field_name];
              } else {
                tempObj.value = result[itemKey.field_name];
              }
              tempArray.push(tempObj);
            });
            tempObject.items.values.push(tempArray);
          });
          break;
        }
        case 'compliance': {
          let tempArray = [];
          if (field.field_name in denormalized) {
            tempArray = denormalized[field.field_name];
          } else {
            tempArray = emailAsset[field.field_name];
          }
          tempObject.items.values = global.adp.notification.processEmailObject
            .processComplianceData(tempArray, field);
          break;
        }
        default: {
          const tempArray = emailAsset[field.field_name].map(val => (
            { field: '', value: val }
          ));
          tempObject.items.values.push(tempArray);
          break;
        }
      }
    } else if (field.type === 'object' && emailAsset[field.field_name]) {
      if (field.properties) {
        switch (field.field_name) {
          case 'repo_urls': {
            const tempRepoUrls = [];
            let tempObj = {};
            field.properties.forEach(((property) => {
              tempObj = {};
              if (emailAsset[field.field_name][property.field_name]) {
                tempObj.field = property.mail_name;
                tempObj.value = emailAsset[field.field_name][property.field_name];
                tempRepoUrls.push(tempObj);
              }
            }));
            if (tempRepoUrls.length) {
              tempObject.items.values.push(tempRepoUrls);
            }
            break;
          }
          case 'menu': {
            const mailObj = emailAsset;
            const tempDocsArray = [];
            field.properties.forEach(((mainProp) => {
              if (mailObj[field.field_name][mainProp.field_name]) {
                if (mainProp.mail_order && mainProp.properties) {
                  mainProp.properties.forEach((subProp) => {
                    if (subProp.mail_order) {
                      let docs = [];
                      let isCpiUpdated = '';
                      let releaseVersion = '';
                      docs = mailObj[field.field_name][mainProp.field_name][subProp.field_name];
                      if (subProp.field_name === 'development') {
                        if (subProp.items && subProp.items.length) {
                          if (docs && docs.length) {
                            docs.forEach((doc) => {
                              releaseVersion = 'In Development';
                              tempDocsArray.push(
                                global.adp.notification.processEmailObject
                                  .generateArrObj(doc, releaseVersion),
                              );
                            });
                          }
                        }
                      } else if (docs.length) {
                        docs.forEach((releaseVersionDocs) => {
                          const { is_cpi_updated, version } = releaseVersionDocs;
                          isCpiUpdated = is_cpi_updated ? 'Yes' : 'No';
                          releaseVersion = version;
                          docs = releaseVersionDocs.documents;
                          if (subProp.items && subProp.items.length) {
                            if (docs && docs.length) {
                              docs.forEach((doc) => {
                                if (emailAsset.check_cpi) {
                                  tempDocsArray.push(
                                    global.adp.notification.processEmailObject
                                      .generateArrObj(doc, releaseVersion, isCpiUpdated),
                                  );
                                } else {
                                  tempDocsArray.push(
                                    global.adp.notification.processEmailObject
                                      .generateArrObj(doc, releaseVersion),
                                  );
                                }
                              });
                            }
                          }
                        });
                      }
                    }
                  });
                }
              }
            }));
            if (tempDocsArray.length) {
              tempObject.items.values = tempDocsArray;
            }
            break;
          }
          default: {
            return [];
          }
        }
      }
    } else {
      if (field.field_name in denormalized) {
        if (!(denormalized[field.field_name] === undefined
           || denormalized[field.field_name] === null)) {
          tempObject.value = denormalized[field.field_name];
        } else {
          delete tempObject.value;
        }
      } else if (field.field_name === 'check_cpi') {
        tempObject.value = emailAsset[field.field_name] ? 'Yes' : 'No';
      } else {
        tempObject.value = emailAsset[field.field_name];
      }
      tempObject.items.values = [];
    }
    if (tempObject.value || tempObject.items.values.length) {
      assetData.push(tempObject);
    }
    return true;
  });

  // eslint-disable-next-line no-param-reassign
  MAILOBJECT.assetData = assetData;
  RESOLVE(MAILOBJECT);
});
// ============================================================================================= //
