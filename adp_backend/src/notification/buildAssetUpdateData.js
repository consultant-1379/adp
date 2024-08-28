// ============================================================================================= //
/**
* [ global.adp.notification.buildAssetUpdateData ]
*/
/* eslint-disable camelcase */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const {
  processComplianceData,
  generateArrObj,
  areArraysSame,
} = global.adp.notification.processEmailObject;
/**
 * This method is used to set appropriate documentation variables in case of automated
 * or manual way
 * @param {Object} emailAsset Current Microservice object
 * @param {Object} emailOldAsset Old Microservice object
 * @return Updated asset object
 * @author Omkar
 */
const setDocumentation = (emailAsset, emailOldAsset) => {
  const emailAssetHere = emailAsset;
  const emailOldAssetHere = emailOldAsset;
  if (emailAssetHere.menu_auto !== emailOldAssetHere.menu_auto) {
    // Check the documentation mode and consider appropriate documentation
    if (emailAssetHere.menu_auto) {
      emailAssetHere.menu = {};
      emailOldAssetHere.repo_urls = {};
    } else {
      emailAssetHere.repo_urls = {};
      if (emailOldAssetHere.menu) { emailOldAssetHere.menu = {}; }
    }
  }
  return [emailAssetHere, emailOldAssetHere];
};

/**
 * This method is used to get the difference between objects
 * @param {object} objectField the field object from schema
 * @param {object} emailAsset updated email asset
 * @param {object} emailOldAsset old email asset
 * @return the old object and updated object delta
 * @author Omkar
 */
const getObjectDelta = (objectField, emailAsset, emailOldAsset) => {
  const tempRepoUrls = [];
  const tempRepoUrlsOld = [];
  let tempObj = {};
  objectField.properties.forEach(((property) => {
    tempObj = {};
    if (emailAsset[objectField.field_name][property.field_name]
            !== emailOldAsset[objectField.field_name][property.field_name]) {
      if (emailAsset[objectField.field_name][property.field_name]) {
        tempObj.field = property.mail_name;
        tempObj.value = emailAsset[objectField.field_name][property.field_name];
        tempRepoUrls.push(tempObj);
      }
      tempObj = {};
      if (emailOldAsset[objectField.field_name][property.field_name]) {
        tempObj.field = property.mail_name;
        tempObj.value = emailOldAsset[objectField.field_name][property.field_name];
        tempRepoUrlsOld.push(tempObj);
      }
    }
  }));
  return [tempRepoUrls, tempRepoUrlsOld];
};

/**
 * This method is used to convert given documentation menu object into documentation array
 * @param {Object} field mail schema for the field
 * @param {*} mailObj email asset data
 * @returns processed array
 * @author Omkar
 */
const converDocObjIntoArray = (field, mailObj, microserviceCpiValue) => {
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
                    tempDocsArray.push(generateArrObj(doc, releaseVersion));
                  });
                }
              }
            } else if (docs && docs.length) {
              docs.forEach((releaseVersionDocs) => {
                const { is_cpi_updated, version } = releaseVersionDocs;
                isCpiUpdated = is_cpi_updated ? 'Yes' : 'No';
                releaseVersion = version;
                docs = releaseVersionDocs.documents;
                if (subProp.items && subProp.items.length) {
                  if (docs && docs.length) {
                    docs.forEach((doc) => {
                      // If the Microservice itself has CPI enabled, then pass the variable
                      if (microserviceCpiValue) {
                        tempDocsArray.push(generateArrObj(doc, releaseVersion, isCpiUpdated));
                      } else {
                        tempDocsArray.push(generateArrObj(doc, releaseVersion));
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
  return tempDocsArray;
};

module.exports = MAILOBJECT => new Promise(async (RESOLVE) => {
  const packName = 'global.adp.notification.buildAssetUpdateData';
  const assetUpdateData = [];
  let tempObject = {};
  const emailSchema = MAILOBJECT.mailSchema;
  let emailAsset = MAILOBJECT.asset;
  let emailOldAsset = MAILOBJECT.oldAsset;
  const { enableHighlight } = MAILOBJECT;
  let denormalized = {};
  let denormalizedOld = {};
  let arraysAreSame;

  [emailAsset, emailOldAsset] = await setDocumentation(emailAsset, emailOldAsset);
  await global.adp.microservices.denormalize(emailAsset)
    .then((DENORMALIZED) => {
      denormalized = DENORMALIZED;
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ adp.microservices.denormalize(emailAsset) ]. Because of this error, denormalized = {} but the function continues.';
      adp.echoLog(errorText, { error: ERROR, emailAsset }, 500, packName, false);
      denormalized = {};
    });

  await global.adp.microservices.denormalize(emailOldAsset)
    .then((DENORMALIZEDOLD) => {
      denormalizedOld = DENORMALIZEDOLD;
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ adp.microservices.denormalize(emailOldAsset) ]. Because of this error, denormalizedOld = {} but the function continues.';
      adp.echoLog(errorText, ERROR, 500, packName, false);
      denormalizedOld = {};
    });

  emailSchema.forEach((field) => {
    tempObject = {
      field: '', value: '', oldvalue: '', items: { values: [], oldValues: [] }, highlight: field.notify_admin_on_change && enableHighlight,
    };
    tempObject.field = field.mail_name;
    if (Array.isArray(emailAsset[field.field_name])
      || Array.isArray(emailOldAsset[field.field_name])) {
      switch (field.field_name) {
        case 'tags': {
          arraysAreSame = areArraysSame(emailAsset[field.field_name],
            emailOldAsset[field.field_name]);
          if (!arraysAreSame) {
            let tempTags = [];
            let tempTagObj = {};
            let fullTags = [];
            if (emailAsset.tags) {
              emailAsset.tags.forEach((tag) => {
                const myLabel = global.adp.tags.getLabel(tag);
                fullTags.push(myLabel);
              });
              emailAsset.tags = fullTags;
            } else {
              emailAsset.tags = [];
            }
            fullTags = [];
            if (emailOldAsset.tags) {
              emailOldAsset.tags.forEach((tag) => {
                const myLabel = global.adp.tags.getLabel(tag);
                fullTags.push(myLabel);
              });
              emailOldAsset.tags = fullTags;
            } else {
              emailOldAsset.tags = [];
            }
            fullTags = [];
            tempObject.value = '';
            tempObject.oldvalue = '';
            emailAsset[field.field_name].forEach((tag) => {
              tempTagObj = {};
              tempTagObj.field = '';
              tempTagObj.value = tag;
              tempTags.push(tempTagObj);
            });
            tempObject.items.values.push(tempTags);
            tempTags = [];
            tempTagObj = {};
            emailOldAsset[field.field_name].forEach((tag) => {
              tempTagObj = {};
              tempTagObj.field = '';
              tempTagObj.value = tag;
              tempTags.push(tempTagObj);
            });
            tempObject.items.oldValues.push(tempTags);
            assetUpdateData.push(tempObject);
          }
          break;
        }
        case 'team':
        case 'additional_information': {
          arraysAreSame = areArraysSame(emailAsset[field.field_name],
            emailOldAsset[field.field_name]);
          if (!arraysAreSame) {
            let tempArray = [];
            let tempObj = {};
            tempObject.value = '';
            tempObject.oldvalue = '';
            emailAsset[field.field_name].forEach((result, index) => {
              tempObj = {};
              tempArray = [];
              field.items.forEach((itemKey) => {
                tempObj = {};
                tempObj.field = itemKey.mail_name;
                if (JSON.stringify(denormalized) !== '{}' && itemKey.field_name in denormalized[field.field_name][index]) {
                  tempObj.value = denormalized[field.field_name][index][itemKey.field_name];
                } else {
                  tempObj.value = result[itemKey.field_name];
                }
                tempArray.push(tempObj);
              });
              tempObject.items.values.push(tempArray);
            });
            if (emailOldAsset[field.field_name] !== undefined) {
              emailOldAsset[field.field_name].forEach((result, index) => {
                tempObj = {};
                tempArray = [];
                field.items.forEach((itemKey) => {
                  tempObj = {};
                  tempObj.field = itemKey.mail_name;
                  if (JSON.stringify(denormalizedOld) !== '{}' && itemKey.field_name in denormalizedOld[field.field_name][index]) {
                    tempObj.value = denormalizedOld[field.field_name][
                      index][itemKey.field_name];
                  } else {
                    tempObj.value = result[itemKey.field_name];
                  }
                  tempArray.push(tempObj);
                });
                tempObject.items.oldValues.push(tempArray);
              });
            } else {
              tempObject.items.oldValues = [];
            }
            assetUpdateData.push(tempObject);
          }
          break;
        }
        case 'compliance': {
          const tempArray = (field.field_name in denormalized)
            ? denormalized[field.field_name] : emailAsset[field.field_name];
          const tempArrayOld = (field.field_name in denormalizedOld)
            ? denormalizedOld[field.field_name] : emailOldAsset[field.field_name];
          const tempCompArray = processComplianceData(tempArray, field);
          const tempCompOldArray = processComplianceData(tempArrayOld, field);
          if (!areArraysSame(tempCompArray, tempCompOldArray)) {
            tempObject.items.values = tempCompArray;
            tempObject.items.oldValues = tempCompOldArray;
            assetUpdateData.push(tempObject);
          }
          break;
        }
        default: {
          const data = Array.isArray(emailAsset[field.field_name])
            ? emailAsset[field.field_name] : [];
          const oldData = Array.isArray(emailOldAsset[field.field_name])
            ? emailOldAsset[field.field_name] : [];
          const tempArray = data.map(val => (
            { field: '', value: val }
          ));
          const tempArrayOld = oldData.map(val => (
            { field: '', value: val }
          ));
          if (!areArraysSame(tempArray, tempArrayOld)) {
            tempObject.items.values.push(tempArray);
            tempObject.items.oldValues.push(tempArrayOld);
            assetUpdateData.push(tempObject);
          }
          break;
        }
      }
    } else if (field.type === 'object') {
      if (field.properties) {
        switch (field.field_name) {
          case 'repo_urls': {
            const [tempUrls, tempUrlsOld] = getObjectDelta(field, emailAsset, emailOldAsset);
            if (tempUrls.length || tempUrlsOld.length) {
              tempObject.items.values.push(tempUrls);
              tempObject.items.oldValues.push(tempUrlsOld);
              assetUpdateData.push(tempObject);
            }
            break;
          }
          case 'menu': {
            const tempDocsArray = converDocObjIntoArray(field, emailAsset, emailAsset.check_cpi);
            const tempDocsOldArray = converDocObjIntoArray(
              field, emailOldAsset, emailAsset.check_cpi,
            );
            if (!areArraysSame(tempDocsArray, tempDocsOldArray)) {
              tempObject.items.values = tempDocsArray;
              tempObject.items.oldValues = tempDocsOldArray;
              assetUpdateData.push(tempObject);
            }
            break;
          }
          default: {
            break;
          }
        }
      }
    } else if (((emailAsset[field.field_name] !== emailOldAsset[field.field_name])
    && !(emailAsset[field.field_name] === '' && emailOldAsset[field.field_name] === undefined))
    && (field.field_name !== 'date_created')) {
      if (emailOldAsset[field.field_name] === undefined && emailAsset[field.field_name] !== '') {
        emailOldAsset[field.field_name] = '';
      }
      if (field.field_name in denormalized) {
        tempObject.value = denormalized[field.field_name];
      } else {
        tempObject.value = emailAsset[field.field_name];
      }
      if (field.field_name in denormalizedOld) {
        tempObject.oldvalue = denormalizedOld[field.field_name];
      } else if (field.field_name === 'check_cpi') {
        const oldValue = !emailAsset.check_cpi ? 'Yes' : 'No';
        const newValue = emailAsset.check_cpi ? 'Yes' : 'No';

        tempObject.oldvalue = oldValue;
        tempObject.value = newValue;
      } else {
        tempObject.oldvalue = emailOldAsset[field.field_name];
      }
      tempObject.items.values = [];
      tempObject.items.oldValues = [];
      assetUpdateData.push(tempObject);
    }
  });
  // eslint-disable-next-line no-param-reassign
  MAILOBJECT.assetData = assetUpdateData;
  RESOLVE(MAILOBJECT);
});
// ============================================================================================= //
