const AssetPermissionValidator = require('./AssetPermissionValidator');

/**
 * [adp.rbac.PermissionValidator]
 * Validates all permission types for the RBAC System
 * @param {array} permissionArr of permissions to validate
 * @param {array} dbPermissionArr of permissions to validate from database
 * @author Cein
 */
global.adp.docs.list.push(__filename);

class PermissionValidator {
  constructor(permissionArr, dbPermissionArr = null) {
    this.packName = 'adp.rbac.PermissionValidator';
    this.permissionArr = permissionArr;
    this.dbPermissionArr = dbPermissionArr;
    this.updatedPermArr = [];
  }

  /**
   * Compares any given permission ids to contructor param dbPermissionArr
   * @param {array} permIdArr list of permission ids to validate against
   * @returns {object} obj.valid {boolean} true if all checks pass
   * obj.error {object} defined if valid false
   * @author Cein
   */
  validatePermIds(permIdArr) {
    if (Array.isArray(permIdArr)) {
      if (Array.isArray(this.dbPermissionArr) && this.dbPermissionArr.length) {
        const permIdsNotMatched = this.dbPermissionArr.filter(
          permObj => !(permIdArr.find(permId => permId.equals(permObj._id))),
        );

        if (permIdsNotMatched.length > 0) {
          const error = {
            message: 'One or more Permission Ids are not matched to the group permission.',
            code: 400,
            data: {
              permIdsNotMatched, groupId: this.groupId, dbPermissionArr: this.dbPermissionArr, permIdArr, origin: 'validatePermIds',
            },
          };
          adp.echoLog(error.message, error.data, error.code, this.packName);
          return { valid: false, error };
        }
        return { valid: true };
      }

      if (!Array.isArray(this.dbPermissionArr)) {
        const error = {
          message: 'Cannot validate Permission Ids Constructor dbPermissionArr',
          code: 400,
          data: {
            dbPermissionArr: this.dbPermissionArr, permIdArr, permissions: this.updatedPermArr, origin: 'validatePermIds',
          },
        };
        adp.echoLog(error.message, error.data, error.code, this.packName);
        return { valid: false, error };
      }
    }

    const error = { message: 'Given Permission Id List is not of type array', code: 400, error: { permIdArr, origin: 'validatePermIds' } };
    adp.echoLog(error.message, error.data, error.code, this.packName);
    return { valid: false, error };
  }

  /**
   * private: Checks the current groups permissions ids are set correctly or exist if set.
   * Permission Ids are not set or of type string, they will be automatically updated in the
   * this.updatedPermArr variable
   * @returns {object} obj.valid {boolean} true if all checks and sets pass
   * obj.error {object} defined if valid false
   * @author Cein
   */
  _permissionIdsCheck() {
    const permissionIdsToConfirm = [];
    const errorArr = [];
    this.updatedPermArr = this.updatedPermArr.map((permObj) => {
      const newPerm = permObj;
      if (typeof permObj._id === 'undefined') {
        newPerm._id = new adp.MongoObjectID();
      } else if (typeof permObj._id === 'string') {
        try {
          const permId = new adp.MongoObjectID(permObj._id);
          newPerm._id = permId;
          permissionIdsToConfirm.push(permId);
        } catch (error) {
          errorArr.push({ error, permissionId: permObj._id, permObj });
        }
      } else if (typeof permObj._id === 'object' && permObj._id !== null) {
        permissionIdsToConfirm.push(permObj._id);
      }
      return newPerm;
    });

    if (errorArr.length) {
      const error = { message: 'One or more Permission Ids are not in the correct Id structure.', code: 400, data: { errorArr, permission: this.updatedPermArr, origin: '_permissionIdsCheck' } };
      adp.echoLog(error.message, error.data, error.code, this.packName);
      return { valid: false, error };
    }

    if (permissionIdsToConfirm.length) {
      return this.validatePermIds(permissionIdsToConfirm);
    }
    return { valid: true };
  }


  /**
   * Validates all permission types
   * @returns {promise<object>} obj.valid true if the permission objects are valid
   * obj.updatedPermissions updated permission, includes: IdObjects and listoptions replacements
   * for the dynamic fields
   * @author Cein
   */
  validate() {
    return new Promise((res, rej) => {
      const { error: valErr } = global.joi.array().min(1).items(
        global.joi.object({
          name: global.joi.string().trim(),
          type: global.joi.string().allow('asset', 'content').required(),
        }).unknown(),
      )
        .label('Permission array name')
        .required()
        .validate(this.permissionArr);
      let assetPermCount = 0;
      let contentPermCount = 0;
      let errorCount = 0;

      if (typeof valErr !== 'undefined') {
        const error = { message: valErr.message, code: 400, data: { error: valErr, permissionArr: this.permissionArr, origin: 'validateAllTypes' } };
        rej(error);
      } else {
        const promiseArr = [];
        this.updatedPermArr = [...this.permissionArr];
        const permIdCheckObj = this._permissionIdsCheck();
        if (permIdCheckObj.valid) {
          this.updatedPermArr.forEach((permObj, permIndex) => {
            const newPermObj = { ...permObj };
            if ((newPermObj.type === 'asset' && assetPermCount === 0)
              || (newPermObj.type === 'content' && contentPermCount === 0)) {
              const assetPermissionValidator = new AssetPermissionValidator(newPermObj);
              promiseArr.push(assetPermissionValidator.validate().then((valResp) => {
                if (newPermObj.type === 'content') {
                  const isStatic = newPermObj.dynamic === null
                                    && newPermObj.exception === null
                                    && Array.isArray(newPermObj.static);

                  const isDynamicAutoAll = Array.isArray(newPermObj.dynamic)
                                            && newPermObj.dynamic.length === 0
                                            && Array.isArray(newPermObj.exception)
                                            && newPermObj.exception.length === 0
                                            && newPermObj.static === null;

                  const isDynamicAndStatic = Array.isArray(newPermObj.dynamic)
                                            && Array.isArray(newPermObj.static)
                                            && Array.isArray(newPermObj.exception);
                  if (!isStatic && !isDynamicAutoAll && !isDynamicAndStatic) {
                    errorCount += 1;
                    const dynamicError = { message: 'The content permission should be a valid static permission or a specific dynamic auto all.', code: 400, data: { permissionArr: this.updatedPermArr, origin: 'validateAllTypes' } };
                    return Promise.reject(dynamicError);
                  }
                }
                if (valResp.valid && valResp.updatedPermission) {
                  this.updatedPermArr[permIndex] = valResp.updatedPermission;
                  return true;
                }
                return Promise.reject();
              }).catch(error => Promise.reject(error)));
              if (newPermObj.type === 'asset') assetPermCount += 1;
              if (newPermObj.type === 'content') contentPermCount += 1;
            } else {
              const error = { message: 'Only one permission of each type is allowed.', code: 400, data: { permissionArr: this.updatedPermArr, origin: 'validateAllTypes' } };
              promiseArr.push(Promise.reject(error));
              errorCount += 1;
            }
          });
          if (errorCount === 0) {
            let errorMessage = '';
            if (assetPermCount === 0) errorMessage = `${errorMessage}Asset permissions not found. `;
            if (contentPermCount === 0) errorMessage = `${errorMessage}Content permission not found. `;
            if (assetPermCount > 1) errorMessage = `${errorMessage}Found ${assetPermCount} asset permissions. `;
            if (contentPermCount > 1) errorMessage = `${errorMessage}Found ${contentPermCount} content permissions. `;
            if (errorMessage !== '') errorMessage = `${errorMessage}The request needs exactly one of each permission. `;
            let errorObject;
            if (errorMessage !== '') {
              errorObject = {
                message: (`Bad Request: ${errorMessage}`).trim(),
                code: 400,
                data: {
                  permissionArr: this.updatedPermArr,
                  origin: 'validateAllTypes',
                },
              };
              promiseArr.push(Promise.reject(errorObject));
            }
          }
          if (promiseArr.length) {
            Promise.all(promiseArr)
              .then(() => res({ valid: true, updatedPermissions: this.updatedPermArr }))
              .catch(errTypeVal => rej(errTypeVal));
          } else {
            const error = { message: 'No permissions processed by type.', code: 400, data: { permissionArr: this.updatedPermArr, origin: 'validateAllTypes' } };
            rej(error);
          }
        } else {
          rej(permIdCheckObj.error);
        }
      }
    });
  }
}


module.exports = PermissionValidator;
