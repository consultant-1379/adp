/**
 * [adp.rbac.AssetPermissionValidator]
 * Validates all permission types for the RBAC System
 * @param {array} permissionArr of permissions to validate
 * @author Cein
 */
adp.docs.list.push(__filename);

class AssetPermissionValidator {
  constructor(permissionObj) {
    this.permission = permissionObj;
    this.updatePerm = {};
    this.uniqueMsIds = [];
    this.uniqueListOptIds = [];
    this.packName = 'adp.rbac.AssetPermissionValidator';
  }

  /**
   * Private: Updates the dynamic fields permissions with clean db listoptions permissions
   * @param {array} dbListopts matched listoptions documents from the listoptions collection
   * @author Cein
   */
  _updateDynamicPermsDbData(dbListopts) {
    this.updatePerm.dynamic = this.updatePerm.dynamic.map((groupObj) => {
      const newGroup = dbListopts.find(listOptsObj => listOptsObj._id === groupObj._id);

      const items = groupObj.items.map((itemObj) => {
        const newItem = dbListopts.find(listOptsObj => listOptsObj._id === itemObj._id);
        return newItem;
      });
      newGroup.items = items;
      return newGroup;
    });
  }

  /**
   * Private: Validates a list of Unique Microservice ids and a list of unique listoptions ids
   * Empty arrays are valid cases.
   * @returns {promise<boolean>} true if all are valid, empty arrays are valid cases
   * @author Cein
   */
  _validateUniqueMsListOpts() {
    return new Promise((res, rej) => {
      const promiseArr = [];

      if (this.uniqueMsIds.length) {
        const msController = new adp.microservices.MicroservicesController();
        promiseArr.push(msController.validateListOfMSIds(this.uniqueMsIds, true));
      }

      if (this.uniqueListOptIds.length) {
        const listOptsContr = new adp.listOptions.ListOptionsController();
        promiseArr.push(listOptsContr.validateIds(this.uniqueListOptIds, true)
          .then((listOptsResp) => {
            if (Array.isArray(listOptsResp.data) && listOptsResp.data.length) {
              this._updateDynamicPermsDbData(listOptsResp.data);
              res(true);
            } else {
              res(true);
            }
          }).catch(error => rej(error)));
      }

      if (promiseArr.length) {
        Promise.all(promiseArr).then(() => res(true)).catch(errPromAll => rej(errPromAll));
      } else {
        res(true);
      }
    });
  }


  /**
   * Private: Remove duplicated IDs from Content Permission Static Array
   * @author Armando Dias [zdiaarm]
   */
  _removeDuplicatedIDs() {
    if (Array.isArray(this.updatePerm.static)) {
      return new Promise((RES, REJ) => {
        try {
          const clearArray = [];
          this.updatePerm.static.forEach((ID) => {
            if (!clearArray.includes(ID)) {
              clearArray.push(ID);
            }
          });
          this.updatePerm.static = clearArray;
          RES();
        } catch (ERROR) {
          REJ(ERROR);
        }
      });
    }
    return new Promise(RES => RES());
  }


  /**
   * Private: Fetches all unique Microservices and listoptions from an asset permission obj
   * @author Cein
   */
  _getUniqueMsListoptIds() {
    const idLookup = {};
    const uniqueListOptIds = [];
    const uniqueMsIds = [];

    /**
     * strips out duplicate ids
     * @param {string} id id to use in the lookup
     * @param {boolean} isMs if this id is related to a microservice, if false it
     * is related to a listoption
     */
    const buildUniqueIds = ((id, isMs = true) => {
      if (typeof id === 'string' && typeof !idLookup[id]) {
        idLookup[id] = true;
        if (isMs) {
          uniqueMsIds.push(id);
        } else {
          uniqueListOptIds.push(id);
        }
      }
    });

    if (Array.isArray(this.permission.dynamic) && this.permission.dynamic.length) {
      this.permission.dynamic.forEach((groupObj) => {
        if (typeof groupObj._id !== 'string') {
          const error = { message: 'All Dynamic field\'s type group requires an _id', code: 400, data: { groupObj, permission: this.permission, origin: '_getUniqueMsListoptIds' } };
          throw error;
        }
        buildUniqueIds(groupObj._id, false);

        if (Array.isArray(groupObj.items) && groupObj.items.length) {
          groupObj.items.forEach((itemObj) => {
            if (typeof groupObj._id !== 'string') {
              const error = { message: 'All Dynamic field\'s type item requires an _id', code: 400, data: { itemObj, permission: this.permission, origin: '_getUniqueMsListoptIds' } };
              throw error;
            }
            buildUniqueIds(itemObj._id, false);
          });
        }
      });
    }
    if (Array.isArray(this.permission.exception) && this.permission.exception.length) {
      this.permission.exception.forEach(msId => buildUniqueIds(msId));
    }
    if (Array.isArray(this.permission.static) && this.permission.static.length) {
      this.permission.static.forEach(msId => buildUniqueIds(msId));
    }

    this.uniqueMsIds = uniqueMsIds;
    this.uniqueListOptIds = uniqueListOptIds;
  }

  /**
   *Prepares permission type asset for validation
   * @returns {promise<object>} obj.valid {boolean} true if validation passes.
   * obj.updatedPermission {object} the updated permissions with ObjectIds if needed and
   * DB Listoption Data for the dynamic permissionsS
   * @author Cein
   */
  validate() {
    const schemas = {
      dynamic: {
        schema: global.joi.object({
          _id: global.joi.object().required(),
          type: global.joi.string().required(),
          name: global.joi.string(),
          dynamic: global.joi.array().required(),
          exception: global.joi.array().required(),
          static: global.joi.valid(null).required(),
        }).label('Dynamic Permission'),
      },
      static: {
        schema: global.joi.object({
          _id: global.joi.object().required(),
          type: global.joi.string().required(),
          name: global.joi.string(),
          dynamic: global.joi.valid(null).required(),
          exception: global.joi.valid(null).required(),
          static: global.joi.array().required(),
        }).label('static Permission'),
      },
      dynamicandstatic: {
        schema: global.joi.object({
          _id: global.joi.object().required(),
          type: global.joi.string().required(),
          name: global.joi.string(),
          dynamic: global.joi.array().required(),
          exception: global.joi.array().required(),
          static: global.joi.array().required(),
        }).label('Dynamic and Static Permission'),
      },
    };
    const passAllRules = Object.values(schemas).some((schemaObj) => {
      const { error } = schemaObj.schema.validate(this.permission);
      return (typeof error === 'undefined');
    });

    if (!passAllRules) {
      const error = { message: 'Asset permission failed all validation cases.', code: 400, data: { permission: this.permission, origin: 'AssetPermissionValiator.validate' } };
      adp.echoLog(error.message, error.data, error.code, this.packName);
      return Promise.reject(error);
    }

    this.updatePerm = { ...this.permission };

    if (this.updatePerm.type === 'asset') {
      try {
        this._getUniqueMsListoptIds();
        return this._validateUniqueMsListOpts()
          .then(() => ({ valid: true, updatedPermission: this.updatePerm }))
          .catch(error => Promise.reject(error));
      } catch (errorUniqueFetch) {
        return Promise.reject(errorUniqueFetch);
      }
    } else if (this.updatePerm.type === 'content') {
      return this._removeDuplicatedIDs()
        .then(() => ({ valid: true, updatedPermission: this.updatePerm }))
        .catch(error => Promise.reject(error));
    } else {
      const errorUnknowType = `Unknow Type: ${this.updatePerm.type}`;
      return Promise.reject(errorUnknowType);
    }
  }
}

module.exports = AssetPermissionValidator;
