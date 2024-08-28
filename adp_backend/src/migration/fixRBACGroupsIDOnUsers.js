// ============================================================================================= //
/**
* [ adp.migration.fixRBACGroupsIDOnUsers ]
* Fix the _id ( from string to ObjectId ) on user register
* @author Armando Dias [ zdiaarm ]
*/
// ============================================================================================= //
adp.docs.list.push(__filename);
// ============================================================================================= //
const packName = 'adp.migration.fixRBACGroupsIDOnUsers';
// ============================================================================================= //


// ============================================================================================= //
/**
 * [ allRBACGroups ] just retrieves all the RBAC Groups from the database.
 * @returns {object} containing an array called "rbacGroups" with all the RBAC Groups.
 * If fails, this array will be empty.
 * @author Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
const allRBACGroups = () => {
  const rbacModels = new adp.models.RBACGroups();
  return rbacModels.indexGroups()
    .then((RESULT) => {
      if (Array.isArray(RESULT.docs)) {
        return { rbacGroups: RESULT.docs };
      }
      return { rbacGroups: [] };
    })
    .catch((ERROR) => {
      const errorText = 'Error caught on [ rbacModels.indexGroups @ adp.models.RBACGroups ] at [ allRBACGroups ]';
      const errorObject = {
        origin: 'allRBACGroups',
        error: ERROR,
      };
      adp.echoLog(errorText, errorObject, 500, packName);
      return { rbacGroups: [] };
    });
};
// ============================================================================================= //


// ============================================================================================= //
/**
 * [ allUsersNeedToBeUpdated ] retrieves all the users where the rbac group
 * contains a string as _id instead of a Mongo ObjectId.
 * @param {object} PAYLOAD Accumulative object passed in the main promise chain.
 * @returns {object} Payload will get an array called "users" with all the users
 * which needs to be updated. If fails, this array will be empty.
 * @author Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
const allUsersNeedToBeUpdated = (PAYLOAD) => {
  const adpModels = new adp.models.Adp();
  return adpModels.allUsersWhereRBACIDisString()
    .then((RESULT) => {
      const payload = PAYLOAD;
      if (Array.isArray(RESULT.docs)) {
        payload.users = RESULT.docs;
        return payload;
      }
      payload.users = [];
      return payload;
    })
    .catch((ERROR) => {
      const errorText = 'Error caught on [ adpModels.allUsersWhereRBACIDisString @ adp.models.Adp ] at [ allUsersNeedToBeUpdated ]';
      const errorObject = {
        origin: 'allUsersNeedToBeUpdated',
        error: ERROR,
      };
      adp.echoLog(errorText, errorObject, 500, packName);
      const payload = PAYLOAD;
      payload.users = [];
      return payload;
    });
};
// ============================================================================================= //


// ============================================================================================= //
/**
 * [ updateTheGroupsOnTheseUsers ] analyse the content of Payload
 * ( Array "rbacGroups" and "users") and update the database users if necessary.
 * @param {object} PAYLOAD Accumulative object passed in the main promise chain.
 * @returns {Promise} which will be fullfiled if the process do not find any error.
 * This means the users in [ payload.users ] array are updated - if there is any.
 * If [ payload.users ] is empty, is considered a successful.
 * @author Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
const updateTheGroupsOnTheseUsers = (PAYLOAD) => {
  const allPromises = [];
  const payload = PAYLOAD;
  if (Array.isArray(payload.users)) {
    payload.users.forEach((USER) => {
      let foundChanges = false;
      const user = USER;
      const lockSize = USER.rbac.length;
      const groupNames = [];
      for (let index = 0; index < lockSize; index += 1) {
        try {
          if (user.rbac[index]) {
            const group = user.rbac[index];
            const originalGroupID = group._id;
            if (typeof originalGroupID === 'string') {
              const theGroup = payload.rbacGroups.find(ITEM => `${ITEM._id}` === originalGroupID);
              if (theGroup) {
                user.rbac.splice(index, 1);
                user.rbac.push(theGroup);
                groupNames.push(theGroup.name);
                foundChanges = true;
                index -= 1;
              }
            }
          }
        } catch (ERROR) {
          const errorText = 'Error on try/catch block on [ updateTheGroupsOnTheseUsers ]';
          const errorObject = {
            error: ERROR,
            user,
            group: user.rbac[index],
          };
          adp.echoLog(errorText, errorObject, 500, packName);
        }
      }
      if (foundChanges) {
        return allPromises.push(new Promise((RES, REJ) => {
          const adpModels = new adp.models.Adp();
          return adpModels.update(user, true, false)
            .then(() => {
              const message = 'RBACGroups were fixed!';
              const object = {
                signum: user.signum,
                updatedGroupNames: groupNames,
              };
              adp.echoLog(message, object, 200, packName, true);
              RES();
            })
            .catch((ERROR) => {
              const errorText = 'Caught an error on [ adpModels.update @ new adp.models.Adp ]';
              const errorObject = {
                origin: 'updateTheGroupsOnTheseUsers',
                error: ERROR,
                user,
              };
              adp.echoLog(errorText, errorObject, 500, packName);
              REJ(ERROR);
            });
        }));
      }
      return new Promise(RES => RES());
    });
  }
  return Promise.all(allPromises)
    .then(() => new Promise(RES => RES(payload)))
    .catch((ERROR) => {
      const errorText = 'Error caught on [ Promise.all(allPromises) ] at [ updateTheGroupsOnTheseUsers ]';
      const errorObject = {
        origin: 'updateTheGroupsOnTheseUsers',
        error: ERROR,
        payload: PAYLOAD,
      };
      adp.echoLog(errorText, errorObject, 500, packName);
      return new Promise((RES, REJ) => REJ(ERROR));
    });
};
// ============================================================================================= //


// ============================================================================================= //
/**
 * Public function, run a Promise Chain of private functions,
 * to Fix the _id ( from string to ObjectId ) on user register.
 * @returns {Promise} which will return true if successful
 * or the error, case find any.
 * @author Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
module.exports = () => new Promise((RESOLVE, REJECT) => {
  allRBACGroups()
    .then(PAYLOAD => allUsersNeedToBeUpdated(PAYLOAD))
    .then(PAYLOAD => updateTheGroupsOnTheseUsers(PAYLOAD))
    .then(() => {
      RESOLVE(true);
    })
    .catch((ERROR) => {
      REJECT(ERROR);
    });
});
// ============================================================================================= //
