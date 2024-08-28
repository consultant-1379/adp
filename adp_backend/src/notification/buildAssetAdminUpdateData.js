// ============================================================================================= //
/**
* [ global.adp.notification.buildAssetAdminUpdateData ]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = MAILOBJECT => new Promise(async (RESOLVE) => {
  const packName = 'global.adp.notification.buildAssetAdminUpdateData';
  const assetUpdateData = [];
  let tempObject = {};
  const emailSchema = MAILOBJECT.mailSchema;
  const emailAsset = MAILOBJECT.asset;
  const emailOldAsset = MAILOBJECT.oldAsset;
  const { notifyFields, enableHighlight } = MAILOBJECT;
  let denormalized = {};
  let denormalizedOld = {};

  let isDirtyNotifyField = false;
  if (Array.isArray(notifyFields)) {
    isDirtyNotifyField = fieldName => notifyFields.filter(
      fieldInfo => fieldInfo.slug === fieldName && fieldInfo.dirty,
    ).length > 0;
  }

  await global.adp.microservices.denormalize(emailAsset)
    .then((DENORMALIZED) => {
      denormalized = DENORMALIZED;
    })
    .catch((ERROR) => {
      adp.echoLog('Error in [ adp.microservices.denormalize(emailAsset) ]', { error: ERROR, emailAsset }, 500, packName, true);
      denormalized = {};
    });

  await global.adp.microservices.denormalize(emailOldAsset)
    .then((DENORMALIZEDOLD) => {
      denormalizedOld = DENORMALIZEDOLD;
    })
    .catch((ERROR) => {
      adp.echoLog('Error in [ adp.microservices.denormalize(emailOldAsset) ]', { error: ERROR, emailOldAsset }, 500, packName, true);
      denormalizedOld = {};
    });

  if (Array.isArray(emailSchema)) {
    emailSchema.forEach((field) => {
      tempObject = {
        field: '',
        value: '',
        oldvalue: '',
        items: { values: [], oldValues: [] },
        highlight: field.notify_admin_on_change && enableHighlight,
      };
      if (isDirtyNotifyField(field.field_name)) {
        // Possibly redundant check...
        if ((emailAsset[field.field_name] !== emailOldAsset[field.field_name])
        && !(emailAsset[field.field_name] === '' && emailOldAsset[field.field_name] === undefined)) {
          if (emailOldAsset[field.field_name] === undefined && emailAsset[field.field_name] !== '') {
            emailOldAsset[field.field_name] = '';
          }
          tempObject.field = field.mail_name;
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
        return true;
      }
      return false;
    });
  }
  // eslint-disable-next-line no-param-reassign
  MAILOBJECT.assetData = assetUpdateData;
  RESOLVE(MAILOBJECT);
});
// ============================================================================================= //
