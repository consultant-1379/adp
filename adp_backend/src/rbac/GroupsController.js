const getCopiedName = require('../library/getCopyName');
const schemaValidator = require('../common/validators/validator.jsonschema');
const userPermissionGroupController = require('../userPermissionGroup/userPermissionGroup.controller');
const PermissionValidator = require('./PermissionValidator');
const { RBAC } = require('../library/utils/constants');

class GroupsController extends adp.models.RBACGroups {
  constructor() {
    super();
    this.package = 'adp.rbac.GroupsController';
  }

  /**
   * Function used to create action in AdpLog db
   * @param {object} data That got processed
   * @param {object} user Details of acting user
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  static _createAuditLog(data, user) {
    const dbModelAdpLog = new adp.models.AdpLog();
    const logObject = {
      type: 'rbacgroups',
      datetime: new Date(),
      signum: (user && user.signum) || 'Not Provided',
      role: (user && user.role) || 'Not Provided',
      desc: 'delete',
      data,
    };
    dbModelAdpLog.createOne(logObject).then(() => true);
  }

  /**
   * Function used for reading RBAC group
   * @param {string} id (Optional) Group ID
   * @param {string} name (Optional) Group Name
   * If nothing provided, all groups will be shown
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  getGroups(id = null, name = null) {
    return new Promise((RES, REJ) => {
      if (id && typeof id !== 'string') {
        const errorObject = {
          code: 400,
          message: 'Parameter ID should be of type STRING',
        };
        REJ(errorObject);
        return;
      }
      if (name && typeof name !== 'string') {
        const errorObject = {
          code: 400,
          message: 'Parameter NAME should be of type STRING',
        };
        REJ(errorObject);
        return;
      }
      let fetchData;
      let errorConstraint = '';
      if (id) {
        errorConstraint = ` id : ${id}`;
        fetchData = super.getGroupById(id);
      } else if (name) {
        errorConstraint = ` name : ${name}`;
        fetchData = super.getGroupsByName(name);
      } else {
        fetchData = super.indexGroups();
      }
      fetchData.then((DBResp) => {
        if (DBResp.docs.length === 0) {
          const errorObject = {
            code: 404,
            message: `Group not found for given parameters${errorConstraint}`,
          };
          REJ(errorObject);
          return;
        }
        RES(DBResp.docs);
      })
        .catch((ERROR) => {
          const errorObject = {
            ERROR,
            message: ERROR.message || 'Error in [ fetchData ] - db call',
            params: { id, name },
            code: ERROR.code || 500,
            origin: 'GroupsController.getGroups',
          };
          adp.echoLog(errorObject.message, errorObject, errorObject.code, this.package);
          REJ(errorObject);
        });
    });
  }

  /**
   * Function used for deleting RBAC group
   * @param {string} groupId ID of group that needs to be deleted
   * @param {Object} user Details of acting user
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  deleteGroup(groupId, user) {
    return new Promise((RES, REJ) => {
      if (groupId && typeof groupId !== 'string') {
        const errorObject = {
          code: 400,
          message: 'Parameter ID should be of type STRING',
        };
        REJ(errorObject);
        return;
      }
      super.deleteGroupIfPossible(groupId).then((DBResp) => {
        if (DBResp.ok === true) {
          userPermissionGroupController.updateUsersPermissionGroup(groupId)
            .then((response) => {
              RES(response.ok);
              GroupsController._createAuditLog(groupId, user);
            }).catch((ERROR) => {
              const errorObject = {
                ERROR,
                message: ERROR.message || 'Error in [ userPermissionGroupController.updateUsersPermissionGroup ]',
                params: { groupId },
                code: ERROR.code || 500,
                origin: 'GroupsController.deleteGroup',
              };
              adp.echoLog(errorObject.message, errorObject, errorObject.code, this.package);
              REJ(errorObject);
            });
        }
      })
        .catch((ERROR) => {
          const errorObject = {
            ERROR,
            message: ERROR.message || 'Error in [ dbModel.deleteGroupIfPossible ]',
            params: { groupId },
            code: ERROR.code || 500,
            origin: 'GroupsController.deleteGroup',
          };
          adp.echoLog(errorObject.message, errorObject, errorObject.code, this.package);
          REJ(errorObject);
        });
    });
  }

  /**
   * Function used for creating RBAC group
   * @param {Object} Group Object of group that needs to be created
   * @param {Object} user Details of acting user
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  createGroup(Group, user) {
    const newGroup = Group;
    return new Promise((RES, REJ) => {
      if (newGroup._id) {
        const errorObject = {
          code: 400,
          message: 'Parameter _ID should not exist for Creation',
        };
        REJ(errorObject);
        return;
      }

      const result = schemaValidator(Group, 'rbacGroup');
      if (Array.isArray(result) && result.length) {
        const errorObject = {
          code: 400,
          message: result.join(),
        };
        REJ(errorObject);
        return;
      }
      newGroup.undeletable = false;

      const permValidator = new PermissionValidator(Group.permission);
      permValidator.validate().then((valResp) => {
        if (valResp.valid) {
          newGroup.permission = valResp.updatedPermissions;

          this._validateExceptionForContent(newGroup.permission)
            .then(() => {
              super.createGroupIfPossible(newGroup).then(() => {
                RES(newGroup);
                GroupsController._createAuditLog(newGroup, user);
              })
                .catch((ERROR) => {
                  const errorObject = {
                    ERROR,
                    message: ERROR.message || 'Error in [ dbModel.createGroupIfPossible ]',
                    params: { Group },
                    code: ERROR.code || 500,
                    origin: 'GroupsController.createGroup',
                  };
                  adp.echoLog(errorObject.message, errorObject, errorObject.code, this.package);
                  REJ(errorObject);
                });
            })
            .catch((ERROR) => {
              const errorObject = {
                ERROR,
                message: ERROR.message || 'Error in [ adp.rbac.GroupsController._validateExceptionForContent ] cannot validate exception for content',
                code: ERROR.code || 500,
                origin: 'GroupsController.createGroup',
              };
              adp.echoLog(errorObject.message, errorObject, errorObject.code, this.package);
              REJ(errorObject);
            });
        } else {
          const error = { message: 'Permission Validation Failure', code: 400, data: { valResp, Group, origin: 'createGroup' } };
          REJ(error);
        }
      }).catch((validationFailure) => {
        REJ(validationFailure);
      });
    });
  }

  /**
   * Private: Removes permission _id fields from the permission objects
   * To prevent createGroup schema from blocking the duplication process
   * @param {array} permissionArr array of permission objects
   * @returns {array} array of permisssions without _id fields
   * @author Cein
   */
  static _rmPermIdsForDuplication(permissionArr) {
    if (Array.isArray(permissionArr) && permissionArr.length) {
      return permissionArr.map((permissionObj) => {
        const newPerm = { ...permissionObj };
        if (newPerm._id) {
          delete newPerm._id;
        }
        return newPerm;
      });
    }
    return permissionArr;
  }

  /**
   * Function used for creating duplicate RBAC group
   * @param {Object} oldGroupDetails Object of group that needs to be duplicated
   * @param {Object} user Details of acting user
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  createDuplicateGroup(oldGroupDetails, user) {
    return new Promise((RES, REJ) => {
      if (typeof oldGroupDetails._id !== 'string') {
        const errorObject = {
          code: 400,
          message: 'Parameter ID is required',
        };
        REJ(errorObject);
        return;
      }
      if (oldGroupDetails.name && typeof oldGroupDetails.name !== 'string') {
        const errorObject = {
          code: 400,
          message: 'Parameter NAME should be of type STRING',
        };
        REJ(errorObject);
        return;
      }
      this.getGroups().then((DBResp) => {
        const groupNames = DBResp.map((group => group.name));
        const newGroup = DBResp.find(
          (group => new adp.MongoObjectID(group._id).toString() === oldGroupDetails._id),
        );
        if (newGroup) {
          delete newGroup._id;
          delete newGroup.undeletable;
          newGroup.name = oldGroupDetails.name || getCopiedName(newGroup.name, groupNames);
          if (newGroup.name.length > 50) {
            const errorObject = {
              code: 400,
              message: 'NAME is required with character limit of 50',
            };
            REJ(errorObject);
            return;
          }
          newGroup.permission = GroupsController._rmPermIdsForDuplication(newGroup.permission);
          this.createGroup(newGroup, user).then((newGroupObj) => {
            RES(newGroupObj);
          })
            .catch((ERROR) => {
              const errorObject = {
                ERROR,
                message: ERROR.message || 'Error in [ this.createGroup ]',
                params: { oldGroupDetails },
                code: ERROR.code || 500,
                origin: 'GroupsController.createDuplicateGroup',
              };
              adp.echoLog(errorObject.message, errorObject, errorObject.code, this.package);
              REJ(errorObject);
            });
        } else {
          const errorObject = {
            code: 404,
            message: 'Group Not Found for Given ID',
          };
          REJ(errorObject);
        }
      })
        .catch((ERROR) => {
          const errorObject = {
            ERROR,
            message: ERROR.message || 'Error in [ this.createDuplicateGroup ]',
            params: { oldGroupDetails },
            code: ERROR.code || 500,
            origin: 'GroupsController.createDuplicateGroup',
          };
          adp.echoLog(errorObject.message, errorObject, errorObject.code, this.package);
          REJ(errorObject);
        });
    });
  }

  /**
   * Function used for validating values in Exception Array of Content Permission
   * @param [Array] Exception array from Group.permission
   * @returns Promise[array] of permisssions
   * @author Tirth [zpiptir]
   */
  _validateExceptionForContent(Permission) {
    const newPermission = [];
    return new Promise((RES, REJ) => {
      adp.wordpress.getMenus().then((menu) => {
        const wordpressMenuSlug = [];
        Permission.forEach((eachPermission) => {
          if (eachPermission.type === 'content' && eachPermission.exception !== null) {
            menu.menus.forEach((menuItem) => {
              if (eachPermission.exception !== null && eachPermission.exception.includes(`/${menuItem.slug}`)) {
                wordpressMenuSlug.push(`/${menuItem.slug}`);
              }
            });
            const newVerifiedException = eachPermission;
            newVerifiedException.exception = wordpressMenuSlug;
            newPermission.push(newVerifiedException);
          } else {
            newPermission.push(eachPermission);
          }
        });
        RES(newPermission);
      }).catch((ERROR) => {
        const errorObject = {
          ERROR,
          message: ERROR.message || 'Error in [ adp.wordpress.getMenus ] while validating exception for content at _validateExceptionForContent',
          params: { Permission },
          code: ERROR.code || 500,
          origin: 'GroupsController._validateExceptionForContent',
        };
        adp.echoLog(errorObject.message, errorObject, errorObject.code, this.package);
        REJ(errorObject);
      });
    });
  }

  /**
   * Function used for updating RBAC group
   * @param {Object} Group Object of group that needs to be created
   * @param {Object} user Details of acting user
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  updateGroup(Group, user) {
    const newGroup = Group;
    return new Promise((RES, REJ) => {
      const result = schemaValidator(Group, 'rbacGroup');
      if (Array.isArray(result) && result.length) {
        const errorObject = {
          code: 400,
          message: result.join(),
        };
        adp.echoLog('Error after the [ schemaValidator ]', errorObject, errorObject.code, this.package);
        REJ(errorObject);
        return;
      }
      if (typeof newGroup.description === 'undefined') {
        newGroup.description = '';
      }

      this.getGroups(Group._id).then((groupResp) => {
        if (groupResp.length) {
          const dbGroup = groupResp[0];
          const permValidator = new PermissionValidator(Group.permission, dbGroup.permission);
          permValidator.validate().then((valResp) => {
            if (valResp.valid) {
              this._validateExceptionForContent(Group.permission).then(() => {
                super.updateGroupIfPossible(newGroup).then((DBResp) => {
                  if (DBResp.ok === true) {
                    userPermissionGroupController.updateUserPermissionWhenGroupUpdates(newGroup)
                      .then(() => {
                        RES(DBResp);
                        GroupsController._createAuditLog(newGroup, user);
                      }).catch((ERROR) => {
                        const errorObject = {
                          ERROR,
                          message: ERROR.message || 'Error in [ userPermissionGroupController.updateUserGroup ]',
                          params: { newGroup },
                          code: ERROR.code || 500,
                          origin: 'GroupsController.updateGroup',
                        };
                        adp.echoLog(errorObject.message, errorObject,
                          errorObject.code, this.package);
                        REJ(errorObject);
                      });
                  }
                })
                  .catch((ERROR) => {
                    const errorObject = {
                      ERROR,
                      message: ERROR.message || 'Error in [ this.updateGroupIfPossible ]',
                      params: { Group },
                      code: ERROR.code || 500,
                      origin: 'GroupsController.updateGroup',
                    };
                    adp.echoLog(errorObject.message, errorObject, errorObject.code, this.package);
                    REJ(errorObject);
                  });
              }).catch((ERROR) => {
                const errorObject = {
                  ERROR,
                  message: ERROR.message || 'Error in [ rbac.GroupController.validateExceptionForContent ] while validating exception for content at GroupsController.updateGroup',
                  code: ERROR.code || 500,
                  origin: 'GroupsController.updateGroup',
                };
                adp.echoLog(errorObject.message, errorObject, errorObject.code, this.package);
                REJ(errorObject);
              });
            } else {
              const error = { message: 'Permission Validation Failure', code: 400, data: { valResp, Group, origin: 'createGroup' } };
              adp.echoLog(error.message, error.data, error.code, this.package);
              REJ(error);
            }
          }).catch((validationFailure) => {
            const error = { message: `Error on Validation by id [${Group._id}].`, code: 500, data: { error: validationFailure, Group, origin: 'updateGroup' } };
            adp.echoLog(error.message, error.data, error.code, this.package);
            REJ(validationFailure);
          });
        } else {
          const error = { message: `Permission Group not found by id [${Group._id}].`, code: 400, data: { groupResp, Group, origin: 'updateGroup' } };
          adp.echoLog(error.message, error.data, error.code, this.package);
          REJ(error);
        }
      }).catch((errGroupFetch) => {
        const error = { message: `Error on Group Fetch by id [${Group._id}].`, code: 500, data: { error: errGroupFetch, Group, origin: 'updateGroup' } };
        adp.echoLog(error.message, error.data, error.code, this.package);
        REJ(errGroupFetch);
      });
    });
  }

  /**
   * Fetches the full default group objects
   * @returns {array<objects>} list of default permission group objects from the collection
   * @author Cein
   */
  fetchDefaultGroups() {
    return new Promise((res, rej) => {
      const defaultgroupIDs = Object.values(RBAC);

      if (defaultgroupIDs.length) {
        const idArr = defaultgroupIDs.map(defGrpId => new adp.MongoObjectID(defGrpId.trim()));
        super.getGroupByIds(idArr).then((respDefGrps) => {
          if (respDefGrps.docs && respDefGrps.docs.length) {
            res(respDefGrps.docs);
          } else {
            const error = { message: 'No default groups were retrieved by given ids', code: 500, data: { respDefGrps, defaultgroupIDs, origin: 'fetchDefaultGroups' } };
            adp.echoLog(error.message, error.data, error.code, this.package);
            rej(error);
          }
        }).catch((errGrpFetch) => {
          const error = { message: 'Failure to fetch default groups', code: 500, data: { error: errGrpFetch, defaultgroupIDs, origin: 'fetchDefaultGroups' } };
          adp.echoLog(error.message, error.data, error.code, this.package);
          rej(error);
        });
      } else {
        const error = { message: 'Default Groups ids are incorrect', code: 500, data: { defaultgroupIDs, origin: 'fetchDefaultGroups' } };
        adp.echoLog(error.message, error.data, error.code, this.package);
        rej(error);
      }
    });
  }
}

module.exports = GroupsController;
