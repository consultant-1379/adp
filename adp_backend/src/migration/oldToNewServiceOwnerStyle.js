// ============================================================================================= //
/**
* [ global.adp.migration.oldToNewServiceOwnerStyle ]
* Check if the Service Owner is not updated to the new format.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
/* eslint-disable no-param-reassign                                                              */
/* The mission of this method is rewrite the original object to update                           */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (MS) => {
  // Variable for control if there is a change
  let foundChange = false;
  // If the MS is not deleted and if the old Owner field exists
  if (MS.deleted !== true && MS.owner !== null && MS.owner !== undefined) {
    // The Team field is an Array
    if (Array.isArray(MS.team)) {
      // Get only registers where there is absolute NO MEMBERS in the Team with the
      // new rules for indicate a Service Owner.
      // [BLOCKER] Once the old Owner will not be deleted yet,
      //           this not allow this change in a second run.
      const filter = MS.team.filter(item => (item.serviceOwner === undefined));
      // So, if find any MS without the serviceOwner variable, length will be > 0.
      if (filter.length > 0) {
        // Variable "foundChange = true" to run the update on the end.
        foundChange = true;
        // For each MEMBER in TEAM...
        MS.team.forEach((item) => {
          // If the signum is...
          if (item.signum.trim().toLowerCase() === MS.owner.trim().toLowerCase()) {
            // ...the same in old Owner means this register belongs to the Service Owner.
            item.serviceOwner = true;
          } else {
            // ...different, is just a regular MEMBER of the TEAM.
            item.serviceOwner = false;
          }
        });
      }
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
