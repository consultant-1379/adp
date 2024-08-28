// ============================================================================================= //
/**
* [ global.adp.user.create ]
* Create a User in Database.
* @param {JSON} USEROBJ a JSON Object with the User. Must follow the schema.
* @return Return ID for OK, Code 500 if something went wrong.
* @author Armando Schiavon Dias [escharm], Veerender
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
const userPermissionsController = require('../userPermissionGroup/userPermissionGroup.controller');
// ============================================================================================= //
module.exports = async (USEROBJ) => {
  const packName = 'global.adp.user.create';
  const dbModel = new adp.models.Adp();
  const newUSER = USEROBJ;
  const isValid = global.adp.user.validateSchema(USEROBJ);
  let clearedSignum = '';
  if (isValid === true) {
    let foundSomething = false;
    let errorMessage = null;
    if (newUSER.signum !== null && newUSER.signum !== undefined) {
      clearedSignum = newUSER.signum.trim().toLowerCase();
    }
    await global.adp.user.read(clearedSignum)
      .then((RESULT) => {
        if (RESULT.docs.length === 0) {
          adp.echoLog(`"${clearedSignum}" is a new user!`, null, 200, packName);
          foundSomething = false;
        } else {
          errorMessage = `Impossible create: "${clearedSignum}" because already exists on Database!`;
          adp.echoLog(errorMessage, null, 400, packName, true);
          foundSomething = true;
        }
      })
      .catch(() => {
        foundSomething = false;
      });
    if (foundSomething) {
      return { code: 400, message: errorMessage };
    }
    /* eslint-disable no-underscore-dangle */
    if (newUSER.signum !== null && newUSER.signum !== undefined) {
      clearedSignum = newUSER.signum.trim().toLowerCase();
    }
    newUSER._id = clearedSignum;
    newUSER.type = 'user';
    newUSER.role = 'author';
    newUSER.modified = `${new Date()}`;
    delete newUSER._rev;
    /* eslint-enable no-underscore-dangle */
    return dbModel.createOne(newUSER)
      .then(async (expectedOBJ) => {
        if (expectedOBJ.ok === true) {
          adp.echoLog(`"${newUSER.signum}" successful created!`, null, 200, packName);
          const groupID = adp.getDefaultRBACGroupID(newUSER._id);
          return userPermissionsController
            .updateUserPermissionGroup(
              newUSER._id,
              [groupID],
            )
            .then((response) => {
              adp.echoLog(`successfully updated default permission group for user ${newUSER._id}`,
                { data: response, origin: 'user.create' }, 200, packName);
              global.adp.masterCache.clear('ALLUSERS', null, newUSER.signum);
              return 200;
            }).catch((errorUpdateUser) => {
              adp.echoLog(`Failed to update default permission group for user ${newUSER._id}`,
                { error: errorUpdateUser, origin: 'user.create' }, errorUpdateUser.code, packName, true);
              return errorUpdateUser.code;
            });
        }
        return 500;
      })
      .catch(() => {
        const obj = { code: 500, message: 'Internal Server Error' };
        return obj;
      });
  }
  const errorText = `"${newUSER.signum}" doesn't match with user schema!`;
  adp.echoLog(errorText, { newUser: newUSER }, 400, packName, true);
  return isValid;
};
// ============================================================================================= //
