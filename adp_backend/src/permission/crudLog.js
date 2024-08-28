// ============================================================================================= //
/**
* [ global.adp.permission.crudLog ]
* Create a register in Audit Log ( dataBaseLog )
* @param {Object} SIGNUM The id of the user.
* @param {Object} PERMISSION The JSON with the Permission to create.
* @return This functions is a <b>Promise</b>.
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable no-restricted-globals */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (
  SIGNUM,
  ROLE,
  ACTION,
  NEWPERMISSION,
  OLDPERMISSION,
) => new Promise((RESOLVE, REJECT) => {
  // ------------------------------------------------------------------------------------------- //
  const dbModelAdpLog = new adp.models.AdpLog();
  const logObject = {
    type: 'permission',
    datetime: new Date(),
    signum: SIGNUM,
    role: ROLE,
    desc: ACTION,
  };
  if (NEWPERMISSION !== null && NEWPERMISSION !== undefined) {
    logObject.new = NEWPERMISSION;
  }
  if (OLDPERMISSION !== null && OLDPERMISSION !== undefined) {
    logObject.old = OLDPERMISSION;
  }
  dbModelAdpLog.createOne(logObject)
    .then(() => {
      RESOLVE();
    })
    .catch((ERROR) => {
      REJECT(ERROR);
    });
  // ------------------------------------------------------------------------------------------- //
});
// ============================================================================================= //
