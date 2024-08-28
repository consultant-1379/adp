/* eslint-disable no-param-reassign */
// ============================================================================================= //
/**
* [ global.adp.migration.marketplaceFilterValuesChange]
* Changes : 1. Category "Idea Box" changed to "Incubating".
*           2. Merge PRA+Devops with PRA. Delete the field PRA+Devops.
*           3. Service Area (i) Data & Marketing [1], (ii) Management & Monitoring [2] and
*              (iii) Domain Specific[4] to other [5].
* The field serviceType should call serviceArea.
* Convert string in number, if the field is known.
* category pass by a conversion, to become number
* @author Omkar Sadegaonkar [esdgmkr], Armando Schiavon Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (MS) => {
// Variable for control if there is a change
  let foundChange = false;
  if (MS.category !== undefined) {
    if (typeof MS.category === 'string') {
      if (MS.category === 'Idea Box') {
        MS.category = 'Incubating';
        foundChange = true;
      }
    }
  }
  if (MS.status !== undefined && (MS.status === '4' || MS.status === 4)) {
    MS.status = 3;
    foundChange = true;
  }
  if (MS.serviceType !== undefined && (MS.serviceType === '1' || MS.serviceType === 1 || MS.serviceType === '2' || MS.serviceType === 2 || MS.serviceType === '4' || MS.serviceType === 4 || MS.serviceType === '5' || MS.serviceType === 5)) {
    MS.serviceType = 7;
    foundChange = true;
  }
  if (MS.serviceType !== undefined && (MS.serviceType === '3' || MS.serviceType === 3)) {
    MS.serviceType = 6;
    foundChange = true;
  }
  if (MS.serviceType !== '' && MS.serviceType !== undefined && MS.serviceType !== null) {
    if (!Number.isNaN(MS.serviceType)) {
      MS.serviceArea = parseInt(MS.serviceType, 10);
    }
    MS.serviceType = ''; // Empty String will be deleted from Database on Update.
    foundChange = true;
  }
  if (typeof MS.serviceArea === 'string') {
    if (!Number.isNaN(MS.serviceArea)) {
      MS.serviceArea = parseInt(MS.serviceArea, 10);
      foundChange = true;
    }
  }

  if (typeof MS.status === 'string') {
    if (!Number.isNaN(MS.status)) {
      MS.status = parseInt(MS.status, 10);
      foundChange = true;
    }
  }
  if (typeof MS.alignment === 'string') {
    if (!Number.isNaN(MS.alignment)) {
      MS.alignment = parseInt(MS.alignment, 10);
      foundChange = true;
    }
  }
  if (typeof MS.category === 'string') {
    switch (MS.category.toLowerCase()) {
      case 'fully supported for reuse':
        MS.category = 1;
        foundChange = true;
        break;
      case 'check before reuse':
        MS.category = 2;
        foundChange = true;
        break;
      case 'incubating':
        MS.category = 3;
        foundChange = true;
        break;
      case 'deprecated':
        MS.category = 4;
        foundChange = true;
        break;
      default:
        break;
    }
  }
  if (!foundChange) {
  // Everything is right, no changes...
    return true;
  }
  // Something is different, should update...
  return MS;
};
// ============================================================================================= //
