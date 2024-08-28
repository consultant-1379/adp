// ============================================================================================= //
/**
* [ adp.contributions.progress ]
* Retrieve the last reading commit status of selected Asset.
* @param {String} ID _id or slug of the Microservice.
* @param {String} EXECUTION Unique ID of the execution.
* @param {String} ACTION String about the action.
* @param {String} TARGET If "SELF" returns only the current ID. Otherwise, returns all.
* @return {JSON} Returns a JSON Object containing the information.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (ID, EXECUTION, ACTION, TARGET = null) => new Promise((RESOLVE) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  if (adp.contributions.contributorsStatisticsProgress === undefined) {
    adp.contributions.contributorsStatisticsProgress = {};
  }
  const instanceID = `${ID}_${EXECUTION}`;
  if (adp.contributions.contributorsStatisticsProgress[instanceID] === undefined) {
    adp.contributions.contributorsStatisticsProgress[instanceID] = {};
  }
  const progress = adp.contributions.contributorsStatisticsProgress[instanceID];
  const action = (`${ACTION}`).trim().toUpperCase();
  if (progress.keeptUntil === undefined) {
    const dateObject = new Date();
    dateObject.setHours(dateObject.getHours() + 12);
    progress.keeptUntil = dateObject;
  }
  progress.status = `${action}ED`;
  progress[`${action.toLowerCase()}At`] = new Date();
  Object.keys(adp.contributions.contributorsStatisticsProgress).forEach((KEY) => {
    if (adp.contributions.contributorsStatisticsProgress[KEY].keeptUntil < new Date()) {
      delete adp.contributions.contributorsStatisticsProgress[KEY];
    }
  });
  if (TARGET === 'SELF') {
    RESOLVE(instanceID);
  } else {
    RESOLVE(adp.contributions.contributorsStatisticsProgress);
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
