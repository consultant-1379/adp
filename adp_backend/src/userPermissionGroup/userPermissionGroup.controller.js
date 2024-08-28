/**
 * [ adp.userPermissionGroup.userPermissionGroup.controller ]
 * Controller for updating/assigning permission groups for users
 * @author Veerender Voskula [ZVOSVEE]
 */

const validateAndPrepareRBACPermissionGroups = require('./validateAndPrepareRBACPermissionGroups');

// ============================================================================================= //
adp.docs.list.push(__filename);
const packName = 'adp.userPermissionGroup.userPermissionGroup.controller';
const originSource = 'userPermissionGroup.controller';

// ============================================================================================= //
/**
* update permission groups for a specific user.
* @param {string} id signum of user
* @param {array} groupdIds array of rbac group ID
* @returns {Promise<object>}  A promise that contains the user db response
* @author Veerender Voskula [zvosvee]
*/
const updateUserPermissionGroup = (id, groupdIds) => new Promise(async (RESOLVE, REJECT) => {
  const dbErrorText = `Failed to update permission group for user ${id}`;
  const dbModel = new adp.models.Adp();
  try {
    const rbacGroup = await validateAndPrepareRBACPermissionGroups(groupdIds);
    const response = await dbModel.updateUserPermissionGroup(id, rbacGroup);
    if (response.ok !== true) {
      throw new Error('Failed to update user permission');
    }
    RESOLVE(response);
  } catch (error) {
    const errorObj = {
      message: error.message || dbErrorText,
      code: error.code || 500,
    };
    adp.echoLog(errorObj.message, { groupdIds, error, origin: originSource },
      errorObj.code, packName);
    REJECT(errorObj);
  }
});

/**
 * Fetches all users without group permissions and sorts those users into default groups
 * Will not return an empty array
 * @returns {promise<object>} object containing each default group and all the users
 * associated to that group
 * @author Cein
 */
const alignUserWithNoGroupToDefaultGroups = () => new Promise((res, rej) => {
  const dbModel = new adp.models.Adp();
  dbModel.getUsersByPermissionGroup().then((userNoGroupsResp) => {
    if (userNoGroupsResp.docs && userNoGroupsResp.docs.length) {
      const userWithOutGrps = userNoGroupsResp.docs;
      const groupsController = new adp.rbac.GroupsController();
      groupsController.fetchDefaultGroups().then((defGroups) => {
        const defaultLookup = {};
        let passDefObjSortErr = {};
        const passDefObjSort = userWithOutGrps.every((userObj) => {
          const groupId = adp.getDefaultRBACGroupID(userObj._id);
          if (typeof defaultLookup[groupId] === 'undefined') {
            const defGrpObj = defGroups.find(grpObj => groupId === grpObj._id.toString());
            if (defGrpObj) {
              defaultLookup[groupId] = {
                groupObj: defGrpObj,
                users: [userObj._id],
              };
            } else {
              passDefObjSortErr = { message: 'Failure to match a default group to a user', code: 500, data: { defGroups, userNoGroupsResp, origin: 'setAnyUserWithoutAGroup' } };
              return false;
            }
          }
          defaultLookup[groupId].users.push(userObj);
          return true;
        });
        if (passDefObjSort) {
          res(defaultLookup);
        } else {
          rej(passDefObjSortErr);
        }
      }).catch((errorFetchGroup) => {
        const errorObj = {
          message: errorFetchGroup.message || 'Failure when fetching the default permission groups',
          code: errorFetchGroup.code || 500,
          data: { error: errorFetchGroup, origin: originSource },
        };
        rej(errorObj);
      });
    } else {
      res({});
    }
  }).catch((usersFetch) => {
    const errorObj = { message: 'Model Failure during fetch of users that have no permission groups', code: 500, data: { error: usersFetch, origin: originSource } };
    adp.echoLog(errorObj.message, errorObj.data, errorObj.code, packName);
    rej(errorObj);
  });
});

/**
 * Sets all adp user objects to the default permission group objects according to their signum,
 * if the user object has no permission group set
 * @returns {promise<object>} obj.ok {boolean} if the proccess was successful, if no users were
 * found without a group permission then the process is still considered a success.
 * obj.usersFoundWithoutGroups {boolean} if any users were found without permission groups
 * obj.updateResp {array<object>} the db responses to the updates if needed
 * obj.modifiedCount {number} the number of users modified
 * @author Cein
 */
const setDefaultsUserWithoutGroup = () => new Promise((res, rej) => {
  const respObj = {
    ok: false, usersFoundWithoutGroups: false, updateResp: [], modifiedCount: 0,
  };
  const dbModel = new adp.models.Adp();
  alignUserWithNoGroupToDefaultGroups().then((defaultsObj) => {
    const promiseArr = [];
    const defaultsArr = Object.values(defaultsObj);
    if (defaultsArr.length) {
      defaultsArr.forEach((lookupObj) => {
        promiseArr.push(
          dbModel.updatePermissionGroupforMultipleUsers(lookupObj.users, lookupObj.groupObj),
        );
      });

      Promise.all(promiseArr).then((respUpdateUsers) => {
        respObj.usersFoundWithoutGroups = true;
        respObj.ok = respUpdateUsers.every((updateResp) => {
          if (updateResp.ok && updateResp.modifiedCount) {
            respObj.modifiedCount += updateResp.modifiedCount;
            return true;
          }
          const error = {
            message: 'Failure to update user/s with the default group',
            code: 500,
            data: {
              updateResp, respUpdateUsers, defaultsArr, origin: 'setDefaultsUserWithoutGroup',
            },
          };
          adp.echoLog(error.message, error.data, error.code, this.packName);
          rej(error);
          return false;
        });
        if (respObj.ok) {
          respObj.updateResp = respUpdateUsers;
          res(respObj);
        }
      }).catch((errUpdateUser) => {
        const error = { message: 'Failure to update user/s group permissions', code: 500, data: { error: errUpdateUser, defaultsObj, origin: 'setDefaultsUserWithoutGroup' } };
        adp.echoLog(error.message, error.data, error.code, this.packName);
        rej(error);
      });
    } else {
      respObj.ok = true;
      res(respObj);
    }
  }).catch((errSortDefaults) => {
    const error = {
      message: errSortDefaults.message || 'Failure to organise users without permission groups into default groups',
      code: errSortDefaults.code || 500,
      data: errSortDefaults.data || { error: errSortDefaults, origin: 'setDefaultsUserWithoutGroup' },
    };
    rej(error);
  });
});

/**
* Update permission group for multiple users in db.
* when custom group is deleted and it is the only assigned group for that user,
* user should be assigned with default group.
* @param {string} GROUPID permission group id
* @returns {Promise<object>}  A promise that contains the db response.
* @author Veerender Voskula [zvosvee]
*/
const updateUsersPermissionGroup = GROUPID => new Promise((RESOLVE, REJECT) => {
  const dbErrorText = 'Error in [ dbModel.deletePermissionGroupFromUsers ]';
  const { models: { Adp }, echoLog } = adp;
  const dbModel = new Adp();
  const userUpdateStartTimer = new Date();
  dbModel.deletePermissionGroupFromUsers(GROUPID)
    .then((respDelPermFromUsers) => {
      if (respDelPermFromUsers.ok === true) {
        adp.echoLog(`successfully updated for "${respDelPermFromUsers.modifiedCount}" users in "${new Date() - userUpdateStartTimer}"ms`,
          null, 200, packName);
        const userGroupUpdateStartTimer = new Date();
        setDefaultsUserWithoutGroup().then((updatedResp) => {
          adp.echoLog(`successfully updated default permission group for "${updatedResp.modifiedCount}" users in ${new Date() - userGroupUpdateStartTimer}"ms`,
            null, 200, packName);
          RESOLVE(updatedResp);
        }).catch((errSetUsers) => {
          const error = {
            message: errSetUsers.message || 'Failure setting users default permission groups to users without permission groups',
            code: errSetUsers.code || 500,
            data: errSetUsers.data || { error: errSetUsers, GROUPID, origin: 'updateUsersPermissionGroup' },
          };
          REJECT(error);
        });
      } else {
        const error = {
          message: dbErrorText,
          code: 500,
          data: { requestBody: GROUPID, respDelPermFromUsers, origin: originSource },
        };
        REJECT(error);
      }
    }).catch((error) => {
      const errorObj = {
        message: error.message || dbErrorText,
        code: error.code || 500,
        data: { requestBody: GROUPID, error, origin: originSource },
      };
      echoLog(dbErrorText, errorObj.data, errorObj.code, packName);
      REJECT(errorObj);
    });
});

/**
* Update permission group for multiple users
* when permission group is updated
* @param {object} GROUP permission group
* @returns {Promise<object>}  A promise that contains the db response.
* @author Veerender Voskula [zvosvee]
*/
const updateUserPermissionWhenGroupUpdates = GROUP => new Promise((RESOLVE, REJECT) => {
  if (!GROUP || typeof GROUP !== 'object') {
    const error = {
      message: 'Missing Group data',
      code: 400,
      data: {
        GROUP, origin: originSource,
      },
    };
    REJECT(error);
  } else {
    const dbErrorText = 'Error in [ dbModel.updateUserPermissionGroupIfRbacGroupUpdated ]';
    const { models: { Adp }, echoLog } = adp;
    const dbModel = new Adp();
    const userUpdateStartTimer = new Date();
    dbModel.updateUserPermissionGroupIfRbacGroupUpdated(GROUP)
      .then(async (response) => {
        if (response.ok === true) {
          adp.echoLog(`successfully updated for "${response.modifiedCount}" users in "${new Date() - userUpdateStartTimer}"ms`,
            null, 200, packName);
          RESOLVE(response);
        } else {
          const error = {
            message: dbErrorText,
            code: 500,
            data: { requestBody: GROUP, response, origin: originSource },
          };
          REJECT(error);
        }
      }).catch((error) => {
        const errorObj = {
          message: error.message || dbErrorText,
          code: error.code || 500,
          data: { requestBody: GROUP, error, origin: originSource },
        };
        echoLog(dbErrorText, errorObj.data, errorObj.code, packName);
        REJECT(errorObj);
      });
  }
});

module.exports = {
  updateUserPermissionGroup,
  updateUsersPermissionGroup,
  updateUserPermissionWhenGroupUpdates,
};

// ============================================================================================= //
