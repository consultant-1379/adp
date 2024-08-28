// ============================================================================================= //
/**
* [ global.adp.permission.isFieldAdmin ]
* Return true or false
* @param {Object} SIGNUM The id of the User.
* @param {Object} ASSET The Asset Object.
* @return This functions is a <b>Promise</b>.
* Returns the ASSET if true ( Is Field Admin ),
* or undefined if not.
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (SIGNUM, ASSET) => new Promise(async (RESOLVE, REJECT) => {
  if (global.adp.permission.fieldPermissionCache === undefined
    || global.adp.permission.fieldPermissionCache === null) {
    await global.adp.permission.fieldListWithPermissions();
  }

  const isSO = (A) => {
    let result;
    if (A.team === undefined
      || A.team === null) {
      return result;
    }
    const byTeam = A.team.filter(e => (e.signum.trim()
      .toLowerCase() === SIGNUM.trim().toLowerCase())
      && (e.serviceOwner === true));
    if (byTeam.length > 0) {
      result = A;
    }
    return result;
  };

  await global.adp.permission.fieldPermissionCache.forEach(async (FIELD) => {
    const fieldValue = ASSET[FIELD.slug];
    if (fieldValue !== null && fieldValue !== undefined) {
      await global.adp.permission.checkFieldPermission(FIELD.id, fieldValue)
        .then((RULES) => {
          if (RULES !== undefined && RULES !== null) {
            if (RULES[SIGNUM.toLowerCase().trim()] !== undefined) {
              RESOLVE(ASSET); // Found a Rule
            } else {
              RESOLVE(isSO(ASSET)); // No Rules, maybe Service Owner?
            }
          } else {
            RESOLVE(isSO(ASSET)); // No Rules, maybe Service Owner?
          }
        })
        .catch((ERROR) => {
          REJECT(ERROR);
        });
    }
  });
});
// ============================================================================================= //
