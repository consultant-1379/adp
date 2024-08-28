// ============================================================================================= //
/**
* [global.adp.migration.statusToServiceMaturity]
* Converting listoption status to service maturity
* All MS with unrestricted set will be remove to indicate item not set
* find design and rules in Story ADPPRG-20395
* @author Cein [edaccei]
*/
// ============================================================================================= //
/* eslint-disable no-underscore-dangle */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = MS => new Promise((resolve) => {
  let updatedMSObj = MS;
  const noRestriction = (typeof updatedMSObj.restricted === 'undefined' || updatedMSObj.restricted === 0);
  const isGSorRS = (updatedMSObj.service_category === 1 || updatedMSObj.service_category === 2);
  const migrationCanRun = (typeof updatedMSObj.status !== 'undefined' && typeof updatedMSObj.service_maturity === 'undefined');

  /**
   * Rules for Service Categories Generic Services or Reuseable Services
   * and PRA services
   * @param {obj} msObject the microservice object to update
   * @param {bool} noRestriction the microservice Restriction Status is unrestricted
   * @author Cein
   */
  function assignServiceCatgoryGSorRS(msObject, notRestricted) {
    const noHelm = (typeof msObject.helmurl === 'undefined' || msObject.helmurl.trim() === '');
    const noGit = (typeof msObject.giturl === 'undefined' || msObject.giturl.trim() === '');
    const newMSObj = msObject;
    if (newMSObj.status === 3) {
      if (!noHelm && !noGit) {
        // pra -> RFCU || RFNCU
        newMSObj.status = (notRestricted ? 7 : 6);
      } else if (noHelm && !noGit) {
        // pra -> DS
        newMSObj.status = 8;
      } else {
        // pra -> idea
        newMSObj.status = 1;
      }
    }

    // in development
    if (updatedMSObj.status === 2) {
      // no git the Idea else Development started
      updatedMSObj.status = (noGit ? 1 : 8);
    }
    return newMSObj;
  }

  if (migrationCanRun) {
    if (isGSorRS) {
      updatedMSObj = assignServiceCatgoryGSorRS(updatedMSObj, noRestriction);
    }

    // PRA not in Service Category GS or RS
    if (updatedMSObj.status === 3) {
      // pra -> RFCU || RFNCU
      updatedMSObj.status = (noRestriction ? 7 : 6);
    }

    // PoC -> idea
    if (updatedMSObj.status === 4) {
      updatedMSObj.status = 1;
    }

    // in development -> DS
    if (updatedMSObj.status === 2) {
      updatedMSObj.status = 8;
    }

    // remove unrestricted values
    if (typeof updatedMSObj.restricted !== 'undefined' && updatedMSObj.restricted === 0) {
      updatedMSObj.restricted = undefined;
    }

    // remove status and add service_maturity
    updatedMSObj.service_maturity = updatedMSObj.status;
    updatedMSObj.status = undefined;

    resolve(updatedMSObj);
  } else {
    resolve(true);
  }
});
