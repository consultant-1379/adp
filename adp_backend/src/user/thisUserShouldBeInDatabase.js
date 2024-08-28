// ============================================================================================= //
/**
* [ global.adp.user.thisUserShouldBeInDatabase ]
* Check if user is in Database, if yes, return the user data.
* If not, read the LDAP, create the user in Database and then, returns the user data.
* If the user do not exists in LDAP, reject with the error.
* @param {String} ID A simple String, with the ID of the User/Signum.
* @author Armando Dias [ zdiaarm ], Veerender
*/
// ============================================================================================= //
/* eslint-disable no-underscore-dangle */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
const userPermissionsGroupController = require('../userPermissionGroup/userPermissionGroup.controller');
// ============================================================================================= //
const packName = 'global.adp.user.thisUserShouldBeInDatabase';
const cacheObject = 'ALLUSERS';

/**
 * Fetches user data from the users db
 * Loads the entire users db into memory due to couch performance problems
 * @param {string} signum the users ericsson signum
 * @returns {promise} array containing the single user.
 * If the user is not found a empty array is returned.
 * @author Cein
 */
const retrieveUserFromDb = async (signum) => {
  const timer = (new Date()).getTime();
  const adpModel = new global.adp.models.Adp();
  const cacheHolderInMilliseconds = 120000;
  let usersResp;
  let msgState = '';

  try {
    usersResp = await adpModel.getById(signum);
    msgState = `The user [ ${signum} ]`;
  } catch (errorFetchingUsers) {
    adp.echoLog('Error trying to fetch user/s', { error: errorFetchingUsers, signum, msgState }, 500, packName, true);
    return Promise.reject(errorFetchingUsers);
  }


  if (Array.isArray(usersResp.docs)) {
    const msg = `${msgState} retrieved from database ( ${adp.getSizeInMemory(usersResp, true)} ) in ${(new Date()).getTime() - timer}ms`;
    adp.echoLog(msg, null, 200, packName, false);
    const responseTemplate = global.adp.clone(usersResp);
    delete responseTemplate.docs;
    const IdLow = signum.toLowerCase();
    const IdUp = signum.toUpperCase();
    const dbUsers = usersResp.docs;
    let dbUser = null;
    dbUsers.forEach((USER) => {
      if ((dbUser === null && USER._id && (IdLow === USER._id || IdUp === USER._id))) {
        dbUser = USER;
      }
      const toCache = global.adp.clone(responseTemplate);
      toCache.docs = [USER];
      global.adp.masterCache.set(
        cacheObject,
        null,
        USER._id,
        { resolve: true, value: toCache },
        cacheHolderInMilliseconds,
      );
    });
    if (dbUser === null || dbUser === undefined) {
      adp.echoLog(`[ ${signum} ] not found in the db`, null, 404, packName);
      return [];
    }
    return [dbUser];
  }
  const error = `Failed to fetch ${msgState} from the db`;
  adp.echoLog(error, { databaseAnswer: usersResp }, 500, packName, true);
  return Promise.reject(error);
};

module.exports = ID => new Promise((MAINRESOLVE, MAINREJECT) => {
  const timer = new Date();
  const dbModel = new adp.models.Adp();
  // ------------------------------------------------------------------------------------------- //
  const thisUserShouldBeInDatabaseACTION = () => new Promise((RESOLVE, REJECT) => {
    const id = ID.trim().toLowerCase();
    retrieveUserFromDb(id)
      .then((userArr) => {
        if (userArr.length > 0) {
          const justUser = userArr[0];
          delete justUser._rev;
          RESOLVE(userArr);
        } else {
          global.adp.userbysignum.search(id, 'STRICT')
            .then((RESULTFROMLDAP) => {
              if (RESULTFROMLDAP.data.usersFound !== undefined) {
                const userObj = RESULTFROMLDAP.data.usersFound[0];
                const newUserObj = {
                  _id: userObj.uid,
                  signum: userObj.signum,
                  name: userObj.name,
                  email: userObj.email,
                  role: 'author',
                  marketInformationActive: true,
                };
                newUserObj._id = newUserObj._id.trim().toLowerCase();
                if (newUserObj.signum !== undefined && newUserObj.signum !== null) {
                  newUserObj.signum = newUserObj.signum.trim().toLowerCase();
                }
                const isValid = global.adp.user.validateSchema(newUserObj);
                if (isValid) {
                  newUserObj.type = 'user';
                  newUserObj.modified = `${new Date()}`;
                  dbModel.createOne(newUserObj)
                    .then((USERCREATED) => {
                      if (USERCREATED.ok === true) {
                        const groupID = adp.getDefaultRBACGroupID(newUserObj._id);
                        userPermissionsGroupController
                          .updateUserPermissionGroup(
                            newUserObj._id,
                            [groupID],
                          )
                          .then(() => {
                            adp.echoLog(`[ ${newUserObj._id} ] successfully updated permissions`, null, 200, packName);
                            retrieveUserFromDb(newUserObj._id)
                              .then((newUserArr) => {
                                if (newUserArr.length > 0) {
                                  const newUser = newUserArr[0];
                                  delete newUser._rev;
                                  const endTimer = (new Date()).getTime() - (timer.getTime());
                                  adp.echoLog(`[ ${newUser.signum} ] successful created in ${endTimer}ms`, null, 200, packName);
                                  RESOLVE(newUserArr);
                                } else {
                                  const endTimer = (new Date()).getTime() - (timer.getTime());
                                  const errorMSG = `Cannot read USER ${ID} from Database in ${endTimer}ms`;
                                  REJECT(errorMSG);
                                }
                              })
                              .catch((ERROR) => {
                                adp.echoLog('Error on [ retrieveUserFromDb ] from [ thisUserShouldBeInDatabaseACTION ]', { error: ERROR }, 500, packName);
                                REJECT(ERROR);
                              });
                          }).catch((errorUpdateUser) => {
                            adp.echoLog(`Error on [ adp.userPermissions.updateUsersPermissionGroup ] in ${(new Date()).getTime() - (timer.getTime())}ms`,
                              { error: errorUpdateUser, origin: 'user.thisUsershouldBeInDatabase' }, 500, packName);
                            const errorObj = {
                              message: `Failed to update default permission group for user ${newUserObj._id}`,
                              code: 500,
                              data: { newUserObj, origin: 'user.thisUsershouldBeInDatabase' },
                            };
                            REJECT(errorObj);
                          });
                      } else {
                        const endTimer = (new Date()).getTime() - (timer.getTime());
                        const errorMSG = `USER ${ID} was not created in ${endTimer}ms!`;
                        REJECT(errorMSG);
                      }
                    })
                    .catch((ERROR) => {
                      adp.echoLog('Error on [ dbModel.createOne ] from [ thisUserShouldBeInDatabaseACTION ]', { error: ERROR }, 500, packName, true);
                      REJECT(ERROR);
                    });
                } else {
                  const endTimer = (new Date()).getTime() - (timer.getTime());
                  const errorMSG = `USER ${ID} scheme is invalid in ${endTimer}ms!`;
                  REJECT(errorMSG);
                }
              } else {
                const endTimer = (new Date()).getTime() - (timer.getTime());
                adp.echoLog(`User [ ${ID} ] was not found on Database nor LDAP in ${endTimer}ms!`, null, 404, packName, true);
                const errorMSG = `User ${ID} was not found on Database nor LDAP!`;
                REJECT(errorMSG);
              }
            })
            .catch((ERROR) => {
              const endTimer = (new Date()).getTime() - (timer.getTime());
              adp.echoLog(`User [ ${ID} ] was not found on Database nor LDAP in ${endTimer}ms!`, { error: ERROR }, (ERROR.code || 500), packName, true);
              REJECT(ERROR);
            });
        }
      })
      .catch((ERROR) => {
        adp.echoLog('Error on [ retrieveUserFromCache ] from [ thisUserShouldBeInDatabaseACTION ]', { error: ERROR }, 500, packName, true);
        REJECT(ERROR);
      });
  });
  // ------------------------------------------------------------------------------------------- //
  const cacheObjectID = (`${ID}`).trim().toLowerCase();
  global.adp.masterCache.get(cacheObject, null, cacheObjectID)
    .then((CACHE) => {
      if (CACHE.resolve === true) {
        const userObject = CACHE
          && CACHE.value
          && CACHE.value.docs
          && CACHE.value.docs[0]
          ? CACHE.value.docs[0]
          : false;
        const hasRBAC = userObject && Array.isArray(userObject.rbac);
        if (userObject === false || hasRBAC === false) {
          throw new Error('RBAC not found in the user cached object!');
        }
        MAINRESOLVE(CACHE.value);
      } else {
        MAINREJECT(CACHE.value);
      }
      const msg = `The user [ ${ID} ] retrieved from cache ( ${adp.getSizeInMemory(CACHE.value, true)} ) in ${(new Date()).getTime() - timer}ms`;
      adp.echoLog(msg, null, 200, packName, false);
    })
    .catch(() => {
      thisUserShouldBeInDatabaseACTION()
        .then((RESULT) => {
          MAINRESOLVE({ docs: RESULT });
        })
        .catch((ERROR) => {
          const cacheHolderInMilliseconds = global.adp
            .masterCacheTimeOut.thisUserShouldBeInDatabase * 1000;
          global.adp.masterCache.set(
            cacheObject,
            null,
            cacheObjectID,
            { resolve: false, value: ERROR },
            cacheHolderInMilliseconds,
          );
          MAINREJECT(ERROR);
          const endTimer = (new Date()).getTime() - timer;
          adp.echoLog(`Fail from LDAP, in ${endTimer}ms - not from cache`, { error: ERROR }, 404, packName, true);
        });
    });
  // ------------------------------------------------------------------------------------------- //
});
// ============================================================================================= //
