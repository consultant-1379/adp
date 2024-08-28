// ============================================================================================= //
/**
* [ global.adp.migration.domainField ]
* Check if the domain Field exists.
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
  // Only runs if the field DOMAIN does not exist in the Microservice.
  // [BLOCKER] Once the domain field exists, the value is not changed.
  if (MS.domain === undefined) {
    /* Migration Rules:
    --- For all the existing services with alignment = ( ADP Core[1]/ADP Other Generic[2]),
    the value for this field will be 'Common Asset'.
    --- 'Other' for the services with alignment Other [3]
    */
    // If alignment is 1 or 2, Domain should be 1.
    // Alignment should be a number, but for retro compatibility, could be string.
    if ((MS.alignment === 1 || MS.alignment === '1') || (MS.alignment === 2 || MS.alignment === '2')) {
      MS.domain = 1;
      // Variable "foundChange = true" to run the update on the end.
      foundChange = true;
    // If alignment is 3, Domain should be 6.
    } else if (MS.alignment === 3 || MS.alignment === '3') {
      MS.domain = 6;
      // Variable "foundChange = true" to run the update on the end.
      foundChange = true;
    // If some alignment is wrong, set domain to null. This will make the Frontend display
    // a dropdown without pre-selected option. The field is required, the user will be forced
    // to choose one option.
    } else {
      MS.domain = null;
      // Variable "foundChange = true" to run the update on the end.
      foundChange = true;
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
