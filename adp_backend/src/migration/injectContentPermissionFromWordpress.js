// ============================================================================================= //
/**
* [ adp.migration.injectContentPermissionFromWordpress ]
* Add a default content permission to the two default groups.
* The permission will follow the targeted Wordpress IDs.
* @author Armando Dias [ zdiaarm ]
*/
// ============================================================================================= //
adp.docs.list.push(__filename);
// ============================================================================================= //
const packName = 'adp.migration.injectContentPermissionFromWordpress';
// ============================================================================================= //
/**
 * Get all menus and content IDs from the targeted Wordpress.
 * @param {Object} permisionTemplate The template of the permission.
 * @returns {Promise<Boolean>} A promise will resolve as true,
 * if the static attribute inside of permisionTemplate was
 * updated successful.
 * @author Armando Dias [ zdiaarm ]
 */
const getAllMenusAndContentIDs = permisionTemplate => new Promise((RES, REJ) => {
  adp.wordpress.getMenus()
    .then((MENUS) => {
      MENUS.menus.forEach((MENU) => {
        MENU.items.forEach((ITEM) => {
          const theContentID = (`${ITEM.object_id}`).trim();
          if (!permisionTemplate.static.includes(theContentID)) {
            permisionTemplate.static.push(theContentID);
          }
        });
      });
      RES(true);
    })
    .catch((ERROR) => {
      const errorText = 'Caught an error in [ adp.wordpress.getMenus ] at [ getAllMenusAndContentIDs ]';
      const errorObject = {
        origin: 'getAllMenusAndContentIDs',
        error: ERROR,
      };
      adp.echoLog(errorText, errorObject, 500, packName, true);
      REJ(errorObject);
    });
});
// ============================================================================================= //
/**
 * Update the groups
 * @param {Object} GROUPS The new data of the groups
 * @param {Object} USER The user ( with admin powers ) to update the group
 * @returns {Promise} The promise will resolve if the group is updated successful.
 * @author Armando Dias [ zdiaarm ]
 */
const updateTheGroups = (GROUPS, USER) => {
  const controllerObj = new adp.rbac.GroupsController();
  return new Promise((RES, REJ) => {
    const allThePromises = [];
    Object.keys(GROUPS).forEach(GROUPKEY => allThePromises.push(
      controllerObj.updateGroup(GROUPS[GROUPKEY], USER),
    ));
    return Promise.all(allThePromises)
      .then(() => {
        RES();
      }).catch((ERROR) => {
        const errorText = 'Caught an error in [ controllerObj.updateGroup @ GroupsController Class ] at [ updateTheGroups ]';
        const errorObject = {
          group: GROUPS,
          user: USER,
          origin: 'updateTheGroups',
          error: ERROR,
        };
        adp.echoLog(errorText, errorObject, 500, packName, true);
        REJ(errorObject);
      });
  });
};
// ============================================================================================= //
/**
 * Use the model to call checkIfPermissionGroupsAreNotReal
 * @param {Array} GROUPIDS List of real group IDs
 * @returns {Promise} The requested object from model.
 * @author Armando Dias [ zdiaarm ]
 */
const checkGroups = (GROUPIDS) => {
  const adpModel = new adp.models.Adp();
  return adpModel.checkIfPermissionGroupsAreNotReal(GROUPIDS);
};
// ============================================================================================= //
/**
 * Get all group IDs from database.
 * @param {Array} groupIDs Array where the real IDs will be stored.
 * @returns {Promise} The promise will be resolved if successful.
 * @author Armando Dias [ zdiaarm ]
 */
const getGroupIDs = (groupIDs) => {
  const rbacGroupsModel = new adp.models.RBACGroups();
  return rbacGroupsModel.indexGroups()
    .then((RESULT) => {
      RESULT.docs.forEach((GROUP) => {
        groupIDs.push(new adp.MongoObjectID(GROUP._id));
      });
      return new Promise(RES => RES());
    })
    .catch((ERROR) => {
      const errorText = 'Caught an error in [ rbacGroupsModel.indexGroups @ adp.models.RBACGroups ] at [ getGroupIDs ]';
      const errorObject = {
        message: errorText,
        code: 500,
        data: {
          error: ERROR,
          origin: 'getGroupIDs',
        },
      };
      adp.echoLog(errorText, errorObject, 500, packName, true);
      return new Promise((RES, REJ) => REJ(errorObject));
    });
};
// ============================================================================================= //
/**
 * Get the default groups and prepare them for the update.
 * @param {Object} PERMISSIONTEMPLATE Object with the template.
 * @param {Object} THEGROUPS Where the updated groups should be stored.
 * @returns {Promise<Boolean>} A promise will be resolved if successful.
 * The values will be inside of THEGROUPS parameter.
 * @author Armando Dias [ zdiaarm ]
 */
const getDefaultGroups = (PERMISSIONTEMPLATE, THEGROUPS) => {
  const permisionTemplate = PERMISSIONTEMPLATE;
  const theGroups = THEGROUPS;
  return new Promise((RES, REJ) => {
    const controllerObj = new adp.rbac.GroupsController();
    controllerObj.fetchDefaultGroups()
      .then((DEFAULTGROUPSFROMDATABASE) => {
        DEFAULTGROUPSFROMDATABASE.forEach((GROUP) => {
          const theGroup = GROUP;
          theGroup._id = `${theGroup._id}`;
          delete theGroup.undeletable;
          if (theGroup.permission.length === 1) {
            theGroup.permission[0]._id = `${theGroup.permission[0]._id}`;
          }
          if (theGroup.permission.length > 1) {
            const asset = theGroup.permission.find(PERM => PERM.type === 'asset');
            if (asset) {
              theGroup.permission = [asset];
            }
          }
          if (theGroup._id === '602e415e01f5f70007a0a950') {
            permisionTemplate._id = '6093f7e50806000008e20127';
            theGroup.permission.push(permisionTemplate);
            theGroups.group1 = adp.clone(theGroup);
          }
        });
        RES(true);
      })
      .catch((ERROR) => {
        const errorText = 'Caught an error in [ controllerObj.fetchDefaultGroups() @ adp.rbac.GroupsController ] at [ getDefaultGroups ]';
        const errorObject = {
          message: errorText,
          code: 500,
          data: {
            error: ERROR,
            origin: 'getDefaultGroups',
          },
        };
        adp.echoLog(errorText, errorObject, 500, packName, true);
        REJ(errorObject);
      });
  });
};
// ============================================================================================= //
/**
 * Migration Script caller to update the content permission
 * inside of the default group ( Internal Users Group ). All the other
 * groups will get a default content permission too.
 * @returns {Promise<Boolean>} as True if successful
 * @author Armando Dias [ zdiaarm ]
 */
module.exports = () => new Promise((RESOLVE, REJECT) => {
  const permisionTemplate = {
    _id: '',
    type: 'content',
    name: 'Allow content',
    dynamic: null,
    exception: null,
    static: [],
  };

  const user = { signum: 'migrationscript', role: 'admin' };
  const groupIDs = [];
  const theGroups = {
    group1: null,
  };

  getAllMenusAndContentIDs(permisionTemplate)
    .then(() => getDefaultGroups(permisionTemplate, theGroups))
    .then(() => updateTheGroups(theGroups, user))
    .then(() => getGroupIDs(groupIDs))
    .then(() => checkGroups(groupIDs))
    .then((RESULT) => {
      if (RESULT.docs.length > 0) {
        const msg = 'Permission "content" could not be applied for the follow user(s):';
        adp.echoLog(msg, null, 500, packName, false);
      }
      RESULT.docs.forEach((USER) => {
        const msg = (`The user [ ${USER.signum} ] belongs to a nonexistent group.`);
        const object = {
          error: 'User belongs to a nonexistent group',
          realGroupIDs: groupIDs,
          user: USER,
        };
        adp.echoLog(msg, object, 500, packName, true);
      });
      RESOLVE(true);
    })
    .catch((ERROR) => {
      REJECT(ERROR);
    });
});
// ============================================================================================= //
