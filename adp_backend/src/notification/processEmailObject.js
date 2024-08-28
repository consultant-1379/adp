/**
 * This function is used to process the compliance data and it'll be used to
 * create html email body for email
 * @param {Array} complianceArray Compliance data array to be processed
 * @param {Object} field the schema object for this field (compliance)
 * @returns Processed compliance array
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const processComplianceData = (complianceArray, field) => {
  let tempCompliance = [];
  let tempObj = {};
  let tempGroupObj = {};
  const compResp = [];
  const compArray = complianceArray || [];
  compArray.forEach((group) => {
    tempCompliance = [];
    tempGroupObj = {};
    field.items.forEach((itemTeamKey) => {
      if (itemTeamKey.field_name === 'group') {
        tempGroupObj.field = itemTeamKey.mail_name;
        tempGroupObj.value = group[itemTeamKey.field_name];
      }
      if (itemTeamKey.field_name === 'fields') {
        group.fields.forEach((compField) => {
          tempCompliance = [];
          tempCompliance.push(tempGroupObj);
          Object.keys(itemTeamKey.items.properties).forEach((prop) => {
            tempObj = {};
            tempObj.field = itemTeamKey.items.properties[prop].mail_name;
            tempObj.value = compField[prop];
            tempCompliance.push(tempObj);
          });
          compResp.push(tempCompliance);
        });
      }
    });
  });
  return compResp;
};


/**
 * This function is used to generate the values array for documentation
 * @param {Object} doc documentation object under processing
 * @param {string} version Release version if any
 * @returns Documentation array
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const generateArrObj = (doc, version, isCpiUpdated) => {
  const arrayObj = [
    {
      field: 'Version',
      value: version || '',
    },
    {
      field: 'Name',
      value: doc.name || '',
    },
    {
      field: 'URL',
      value: doc.external_link || '',
    },
    {
      field: 'Default',
      value: doc.default || false,
    },
    {
      field: 'Restricted',
      value: doc.restricted || false,
    },
  ];

  if (typeof isCpiUpdated !== 'undefined') {
    arrayObj.push({
      field: 'Is CPI Updated',
      value: isCpiUpdated,
    });
  }

  return arrayObj;
};

/**
 * Checks if object is in array
 * @param {object} obj object that needs to be checked
 * @param {array} list array in which object is needs to be checked
 * @returns {boolean} returns if object is in array or not
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
function containsObject(obj, list) {
  let i;
  for (i = 0; i < list.length; i += 1) {
    if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if two arrays are same of not
 * @param {array} arr1 First array
 * @param {array} arr2 Second array
 * @returns {boolean} result whether true or false
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
function areArraysSame(arr1, arr2) {
  const array1 = (Array.isArray(arr1) ? arr1 : []);
  const array2 = (Array.isArray(arr2) ? arr2 : []);
  let objectsAreSame = true;

  if (array1.length === 0 && array2.length === 0) {
    return true;
  }
  if (array1.length !== array2.length) {
    return false;
  }

  array1.every((e1) => {
    if (!containsObject(e1, array2)) {
      objectsAreSame = false;
      return objectsAreSame;
    }
    objectsAreSame = true;
    return objectsAreSame;
  });
  return objectsAreSame;
}

module.exports = {
  processComplianceData,
  generateArrObj,
  areArraysSame,
};
