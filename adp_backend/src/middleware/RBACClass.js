// ============================================================================================= //
/**
* [ adp.middleware.RBACClass ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
class MiddlewareClass {
  // ------------------------------------------------------------------------------------------ //
  constructor(PREVIEW = false, TRACK = false) {
    this.packName = 'adp.middleware.RBACClass';
    this.start = new Date();
    this.allAssets = null;
    this.allContent = null;
    this.wpFullUserMenu = null;
    this.preview = PREVIEW;
    this.wpPreview = false;
    this.previewId = [];
    if (TRACK === true) {
      this.track = {
        start: new Date(),
        steps: [],
      };
    }
    this.localListOptionsCache = null;
  }


  // ------------------------------------------------------------------------------------------ //
  /**
   * Get a copy of listOptions value and set into
   * this.localListOptionsCache variable for
   * internal use of this class.
   * @author Armando Dias [zdiaarm]
   */
  loadListOption() {
    this.processTracking('loadListOption', 'Async');
    if (this.localListOptionsCache !== null) {
      return new Promise(RES => RES());
    }
    return new Promise((RESOLVE, REJECT) => {
      adp.listOptions.get()
        .then((LISTOPTIONS) => {
          this.localListOptionsCache = JSON.parse(LISTOPTIONS);
          RESOLVE();
        })
        .catch((ERROR) => {
          const errorText = 'Error in [ adp.listOptions.get ] at [ loadListOption ]';
          const errorObject = {
            preview: this.preview,
            track: (this.track !== undefined),
            error: ERROR,
          };
          adp.echoLog(errorText, errorObject, 500, this.packName);
          REJECT(errorObject);
        });
    });
  }


  // ------------------------------------------------------------------------------------------ //
  /**
   * Method to read the request, check the possible users/groups/targets
   * and returns these three values ( null if undefined/null )
   * @param {Object} REQ Request Object after [ global.passport.authenticate ]
   * and [ adp.rbac.previewRequest ].
   * @returns object containing { users, groups, targets }.
   * @author Armando Dias [zdiaarm]
   */
  checkRequest(REQ) {
    this.processTracking('checkRequest', 'Sync');
    const users = REQ && REQ.users && REQ.users.docs ? REQ.users.docs : null;
    const groups = REQ && REQ.rbacGroup ? REQ.rbacGroup : null;
    const targets = REQ && REQ.rbacTarget ? REQ.rbacTarget : null;
    return { users, groups, targets };
  }


  // ------------------------------------------------------------------------------------------ //
  /**
   * Method used to prepare the object to receive more data
   * @param {Object} args Multiple arguments, where:
   * The first should be the object to be prepared.
   * All the others should be strings, which will give the name
   * of the new objects inside of the first one.
   * @returns The last level of the object, ready to get data.
   * @author Armando Dias [zdiaarm]
   */
  prepareObject(...args) {
    this.processTracking('prepareObject', 'Sync');
    const RBAC = args[0];
    const ID = args[1];
    if (ID && RBAC[ID] === undefined) {
      RBAC[ID] = {};
    }
    let root = RBAC[ID];
    for (let index = 2; index < args.length; index += 1) {
      if (root[args[index]] === undefined) {
        root[args[index]] = {};
      }
      root = root[args[index]];
    }
    return root;
  }


  // ------------------------------------------------------------------------------------------ //
  /**
   * Get a FIELD code and an ITEM code to denormalize and retrieve the listOption value.
   * @param {INTEGER} FIELD Code of the Field.
   * @param {INTEGER} ITEM Code of the Item inside of the Field.
   * @returns Object with the slug and the name of the FIELD/ITEM.
   * @author Armando Dias [zdiaarm]
   */
  normaliseListOption(FIELD, ITEM) {
    this.processTracking('normaliseListOption', 'Sync');
    const fieldGroup = this.localListOptionsCache.find(FIELDGROUP => FIELDGROUP.id === FIELD);
    const { slug } = fieldGroup;
    const fieldItem = fieldGroup.items.find(FIELDITEM => FIELDITEM.id === ITEM);
    const { name } = fieldItem;
    return { slug, name };
  }


  // ------------------------------------------------------------------------------------------ //
  /**
   * Get all Assets from Database, including id, slug, denorm_domain and domain.
   * @returns Array following the example:
   * [ { _id: '17e57f6cea1b5a673f8775e6cf023344',
   *     slug: 'document-refresh-warnings-test',
   *     denorm_domain: 'Common Asset',
   *     domain: 1
   * } ]
   * @author Armando Dias [zdiaarm]
   */
  loadAssetIdsByDomain() {
    this.processTracking('loadAssetIdsByDomain', 'Async, Database');
    return new Promise((RESOLVE, REJECT) => {
      const adpModel = new adp.models.Adp();
      adpModel.getAllAssetsIDsByDomain()
        .then((ASSETSIDS) => {
          const result = [];
          if (ASSETSIDS && ASSETSIDS.docs && ASSETSIDS.docs.length > 0) {
            this.allAssets = ASSETSIDS.docs;
            this.allAssets.forEach((ASSET) => {
              const allowAssetObject = {};
              allowAssetObject._id = ASSET._id;
              allowAssetObject.slug = ASSET.slug;
              const { slug, name } = this.normaliseListOption(3, ASSET.domain);
              allowAssetObject[`denorm_${slug}`] = name;
              allowAssetObject[`${slug}`] = ASSET.domain;
              result.push(allowAssetObject);
            });
          }
          RESOLVE(result);
        })
        .catch((ERROR) => {
          const errorText = 'Error in [ adpModel.getAllAssetsIDsByDomain @ adp.models.Adp ] at [ loadAssetIdsByDomain ]';
          const errorObject = {
            error: ERROR,
          };
          adp.echoLog(errorText, errorObject, 500, this.packName);
          REJECT(ERROR);
        });
    });
  }


  // ------------------------------------------------------------------------------------------ //
  /**
   * Checks if the user is admin or not.
   * Has to be a Promise because is part of a Promise Chain.
   * @param {Array} USERS Array with the user/users full object requested,
   * including rbac permissions.
   * @param {Object} RBAC Object to add information.
   * @param {Date} TIMER Date object to analyse performance.
   * @returns Information if the user is or not super admin, inside of RBAC Object.
   * @author Armando Dias [zdiaarm]
   */
  adminRule(USERS, RBAC, TIMER) {
    this.processTracking('adminRule', 'Async');
    return new Promise((RESOLVE, REJECT) => {
      USERS.forEach((USER) => {
        const { signum } = USER;
        if (signum === null || signum === undefined) {
          return this.adminRuleError(REJECT);
        }
        return this.adminRuleApply(USER, RBAC, signum, TIMER);
      });
      RESOLVE();
    });
  }

  // ------------------------------------------------------------------------------------------ //
  /**
   * Called by [ this.adminRule() ], this method checks the role of one user
   * to decide if is a Super-Admin or not.
   * @param {Object} USER Object with the User Register. Cannot be an Array.
   * @param {Object} RBAC Object where we save the information.
   * @param {String} SIGNUM The unique ID of the User.
   * @param {Date} TIMER The datetime of execution.
   * The result of this process is saved inside of RBAC Object.
   * @author Armando Dias [zdiaarm]
   */
  adminRuleApply(USER, RBAC, SIGNUM, TIMER) {
    this.processTracking('adminRuleApply', 'Sync');
    const isAdmin = USER && USER.role && USER.role === 'admin';
    const info = this.prepareObject(RBAC, SIGNUM);
    info.admin = isAdmin;
    if (isAdmin) {
      this.processTimerUpdate(info, TIMER);
    }
  }


  // ------------------------------------------------------------------------------------------ //
  /**
   * Method to generate an error from [ this.adminRule() ] case necessary.
   * @param {Object} ITEM The invalid user register which caused the error.
   * @param {Function} REJECT Function should be executed to reject the promise.
   * @author Armando Dias [zdiaarm]
   */
  adminRuleError(ITEM, REJECT) {
    this.processTracking('adminRuleError', 'Sync');
    const errorText = 'User Object should contain a signum attribute';
    const errorObject = { user: ITEM };
    adp.echoLog(errorText, errorObject, 500, this.packName);
    REJECT({ code: 500, message: errorText });
  }


  // ------------------------------------------------------------------------------------------ //
  /**
   * Updates the timerMS
   * @param {Object} OBJ Object where the timerMS should be updated.
   * @param {Date} TIMER Datetime of the execution.
   * @author Armando Dias [zdiaarm]
   */
  processTimerUpdate(OBJ, TIMER) {
    this.processTracking('processTimerUpdate', 'Sync');
    const obj = OBJ;
    obj.timerMS = new Date() - TIMER;
  }


  // ------------------------------------------------------------------------------------------ //
  /**
   * Get all the users through parameter, returns only non-super-admins.
   * @param {Array} USERS All the users inside of an Array.
   * @returns Array with all non-super-admins.
   * @author Armando Dias [zdiaarm]
   */
  getOnlyNotAdminUsers(USERS) {
    this.processTracking('getOnlyNotAdminUsers', 'Sync');
    const signumArray = [];
    USERS.forEach((USER) => {
      if (USER.role !== 'admin') {
        signumArray.push(USER.signum);
      }
    });
    return signumArray;
  }


  // ------------------------------------------------------------------------------------------ //
  /**
   * Get all the users through parameter, returns only non-super-admins
   * with rbac groups/permissions.
   * @param {Array} USERS All the users inside of an Array.
   * @returns Array with all non-super-admins with rbac groups/permissions.
   * @author Armando Dias [zdiaarm]
   */
  getOnlyNotAdminUsersWithRBAC(USERS) {
    this.processTracking('getOnlyNotAdminUsersWithRBAC', 'Sync');
    const usersWithRBAC = [];
    USERS.forEach((USER) => {
      if (USER.role !== 'admin' && Array.isArray(USER.rbac) && USER.rbac.length > 0) {
        usersWithRBAC.push(USER);
      }
    });
    return usersWithRBAC;
  }


  // ------------------------------------------------------------------------------------------ //
  /**
   * Fetches all admin permission per signum and applies the domain rule to the users
   * @param {array<object>} USERS list of user objects
   * @param {object} RBAC Object where we save the information
   * @param {object} TIMER date object for the tracker
   * @returns {promise} void
   * @author Armando
   */
  domainAdminRule(USERS, RBAC, TIMER) {
    this.processTracking('domainAdminRule', 'Async, Database');
    return new Promise((RESOLVE, REJECT) => {
      if (this.allAssets) {
        const signumArray = this.getOnlyNotAdminUsers(USERS);
        if (!Array.isArray(signumArray) || !signumArray.length) {
          RESOLVE();
          return;
        }
        const permModel = new adp.models.Permission();
        permModel.getAllFieldAdminPermissionBySignum(signumArray)
          .then((FIELDADMIN) => {
            this.domainAdminRuleApply(USERS, RBAC, TIMER, signumArray, this.allAssets, FIELDADMIN);
            RESOLVE();
          })
          .catch((ERROR) => {
            const errorText = 'Error in [ permModel.getAllFieldAdminPermissionBySignum @ adp.models.Permission ] at [ domainAdminRule ]';
            const errorObject = {
              error: ERROR,
              signumArray,
              users: USERS,
              rbac: RBAC,
            };
            adp.echoLog(errorText, errorObject, 500, this.packName);
            REJECT();
          });
      } else {
        const errorText = 'Error at [ domainAdminRule ]: this.allAssets is invalid!';
        const errorObject = {
          error: errorText,
          allAssets: this.allAssets,
          typeOf_allAssets: typeof this.allAssets,
          users: USERS,
          rbac: RBAC,
        };
        adp.echoLog(errorText, errorObject, 500, this.packName);
        REJECT();
      }
    });
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * applies the domain admin rules to the rbac object
   * @param {array} USERS list of users
   * @param {object} RBAC the rbac object being processed
   * @param {object} TIMER date object for the tracker
   * @param {array<string>} SIGNUMS list of signums for processing
   * @param {array<object>} ASSETBYDOMAIN list of services with their related domain
   * obj._id {string} the asset id
   * obj.domain {number} the domain select id
   * obj.slug {string} slug of the asset
   * @param {array<object>} FIELDADMIN list of services with related group-id, item-id and
   * admin object
   * @author Armando
   */
  domainAdminRuleApply(USERS, RBAC, TIMER, SIGNUMS, ASSETBYDOMAIN, FIELDADMIN) {
    this.processTracking('domainAdminRuleApply', 'Sync');
    if (FIELDADMIN && FIELDADMIN.docs && FIELDADMIN.docs.length > 0) {
      FIELDADMIN.docs.forEach((FIELD) => {
        SIGNUMS.forEach((SIGNUM) => {
          const signum = SIGNUM;
          let hasChanges = false;
          if (FIELD && FIELD.admin && FIELD.admin[signum]) {
            hasChanges = this.domainAdminRuleAddAsset(signum, RBAC, ASSETBYDOMAIN, FIELD);
          }
          if (hasChanges) {
            const toAddTimer = this.prepareObject(RBAC, signum);
            this.processTimerUpdate(toAddTimer, TIMER);
          }
        });
      });
    }
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Organises the domain admin assets into the preview and allowed.assets objects
   * @param {string} SIGNUM the signum of the domain admin
   * @param {object} RBAC Object where we save the information
   * @param {array} ASSETBYDOMAIN microservice objects for the domain admins
   * @param {object} FIELD the permission object
   * @returns {boolean} if the domain admin microservice list has additional services from
   * the group asset list
   * @author Armando
   */
  domainAdminRuleAddAsset(SIGNUM, RBAC, ASSETBYDOMAIN, FIELD) {
    this.processTracking('domainAdminRuleAddAsset', 'Sync');
    const info = this.prepareObject(RBAC, SIGNUM, 'allowed');
    let infoPreview = null;
    let hasChanges = false;
    if (this.preview) {
      infoPreview = this.prepareObject(RBAC, SIGNUM, 'preview', 'domainAdmin');
      if (infoPreview.assets === undefined) {
        infoPreview.assets = [];
      }
    }
    ASSETBYDOMAIN.forEach((ASSET) => {
      if (this.preview) {
        if (ASSET.domain === FIELD['item-id'] && !infoPreview.assets.includes(ASSET)) {
          infoPreview.assets.push(ASSET);
        }
      }
      if (ASSET.domain === FIELD['item-id']) {
        if (info.assets === undefined) {
          info.assets = [];
        }
        if (!info.assets.includes(ASSET._id)) {
          info.assets.push(ASSET._id);
          hasChanges = true;
        }
      }
    });
    return hasChanges;
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Fetches service owner assets
   * @param {array<object>} USERS list of user objects
   * @param {object} RBAC the passed rbac object
   * @param {object} TIMER date object for the tracker
   * @returns <promise> void
   * @author Armando
   */
  serviceOwnerRule(USERS, RBAC, TIMER) {
    this.processTracking('serviceOwnerRule', 'Async, Database');
    const signumArray = this.getOnlyNotAdminUsers(USERS);
    return new Promise((RESOLVE, REJECT) => {
      const adpModel = new adp.models.Adp();
      adpModel.getAllAssetsIDsByServiceOwner(signumArray)
        .then((RESULT) => {
          this.serviceOwnerRuleApply(USERS, RBAC, TIMER, signumArray, RESULT.docs);
          RESOLVE();
        })
        .catch((ERROR) => {
          const errorText = 'Error in [ adpModel.getAllAssetsIDsByServiceOwner @ adp.models.Adp ] at [ serviceOwnerRule ]';
          const errorObject = {
            signumArray,
            users: USERS,
            rbac: RBAC,
            error: ERROR,
          };
          adp.echoLog(errorText, errorObject, 500, this.packName);
          REJECT();
        });
    });
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Collects matching service owners assets
   * @param {array} USERS list of user objects
   * @param {object} RBAC the passed rbac object
   * @param {object} TIMER date object for the tracker
   * @param {array<string>} SIGNUMS list of signums of services owners
   * @param {array<object>} ASSETSSERVICEOWNERS list of microservices in question, with their
   * associated team member objects
   * @author Armando
   */
  serviceOwnerRuleApply(USERS, RBAC, TIMER, SIGNUMS, ASSETSSERVICEOWNERS) {
    this.processTracking('serviceOwnerRuleApply', 'Sync');
    SIGNUMS.forEach((SIGNUM) => {
      const signum = SIGNUM;
      let hasChanges = false;
      ASSETSSERVICEOWNERS.forEach((ASSET) => {
        if (Array.isArray(ASSET.team)) {
          const serviceOnwerFromAsset = ASSET
            .team.filter(MEMBER => MEMBER.signum === signum && MEMBER.serviceOwner === true);
          const isServiceOnwer = serviceOnwerFromAsset.length > 0;
          if (isServiceOnwer) {
            hasChanges = this.serviceOwnerRuleAddAsset(signum, RBAC, ASSET, serviceOnwerFromAsset);
          }
        }
      });
      if (hasChanges) {
        const toAddTimer = this.prepareObject(RBAC, signum);
        this.processTimerUpdate(toAddTimer, TIMER);
      }
    });
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Updates the rbac object with the service owner asset and preview information
   * @param {string} SIGNUM the signum to prepare
   * @param {object} RBAC the passed rbac object
   * @param {object} ASSET microservice in question, with the associated team member objects
   * @param {object} SERVICEOWNERFROMASSET the service owner's team object
   * @returns {boolean} true if the service admin's service is not in the list services
   * @author Armando
   */
  serviceOwnerRuleAddAsset(SIGNUM, RBAC, ASSET, SERVICEOWNERFROMASSET) {
    this.processTracking('serviceOwnerRuleAddAsset', 'Sync');
    const info = this.prepareObject(RBAC, SIGNUM, 'allowed');
    let infoPreview = null;
    let hasChanges = false;
    if (this.preview) {
      infoPreview = this.prepareObject(RBAC, SIGNUM, 'preview', 'serviceOwner');
      if (infoPreview.assets === undefined) {
        infoPreview.assets = [];
      }
      const previewAssetForServiceOwner = {
        _id: ASSET._id,
        slug: ASSET.slug,
        team: SERVICEOWNERFROMASSET,
      };
      infoPreview.assets.push(previewAssetForServiceOwner);
    }
    if (info.assets === undefined) {
      info.assets = [];
    }
    if (!info.assets.includes(ASSET._id)) {
      info.assets.push(ASSET._id);
      hasChanges = true;
    }
    return hasChanges;
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Processes the Group Permissions RBAC object
   * @param {Array<object>} USERS List of user objects
   * @param {object} RBAC the passed rbac object
   * @param {object} TIMER date object for the tracker
   * @returns {promise} void
   * @author Armando
   */
  rbacGroupsRule(USERS, RBAC, TIMER) {
    this.processTracking('rbacGroupsRule', 'Async');
    const usersWithRBAC = this.getOnlyNotAdminUsersWithRBAC(USERS);
    return new Promise((RESOLVE, REJECT) => {
      const allPromises = [];
      usersWithRBAC.forEach((USER) => {
        const hasChanges = false;
        USER.rbac.forEach((GROUP) => {
          GROUP.permission.forEach((PERMISSION) => {
            allPromises.push(this.rbacGroupsRuleByRule(
              USER.signum,
              RBAC,
              TIMER,
              PERMISSION,
              GROUP,
              hasChanges,
            ));
          });
        });
      });
      Promise.all(allPromises)
        .then(() => {
          RESOLVE();
        })
        .catch((ERROR) => {
          const errorText = 'Error in [ Promise.all ] at [ rbacGroupsRule ]';
          const errorObject = {
            users: USERS,
            rbac: RBAC,
            error: ERROR,
          };
          adp.echoLog(errorText, errorObject, 500, this.packName);
          REJECT(ERROR);
        });
    });
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * process each individual permission group to build the rbac object
   * @param {array<object>} GROUPS list of group permissions
   * @param {object} RBAC the passed rbac object
   * @param {object} TIMER date object for the tracker
   * @returns {object} the build rbac object
   * @author Armando
   */
  rbacOnlyGroupsRule(GROUPS, RBAC, TIMER) {
    this.processTracking('rbacOnlyGroupsRule', 'Async');
    return new Promise((RESOLVE, REJECT) => {
      const allPromises = [];
      GROUPS.forEach((GROUP) => {
        const hasChanges = false;
        if (GROUP && GROUP.permission) {
          GROUP.permission.forEach((PERMISSION) => {
            allPromises.push(this.rbacGroupsRuleByRule(
              GROUP._id,
              RBAC,
              TIMER,
              PERMISSION,
              GROUP,
              hasChanges,
            ));
          });
        } else {
          const errorText = 'Error in [ this.allGroupsAsOneResult ] at [ rbacOnlyGroupsRule ]';
          const errorObject = {
            groups: GROUPS,
            rbac: RBAC,
            error: 'Group data looks invalid...',
          };
          adp.echoLog(errorText, errorObject, 500, this.packName);
          REJECT(errorObject.error);
        }
      });
      Promise.all(allPromises)
        .then(() => {
          this.allGroupsAsOneResult(RBAC, TIMER)
            .then((NEWRBAC) => {
              RESOLVE(NEWRBAC);
            })
            .catch((ERROR) => {
              const errorText = 'Error in [ this.allGroupsAsOneResult ] at [ rbacOnlyGroupsRule ]';
              const errorObject = {
                groups: GROUPS,
                rbac: RBAC,
                error: ERROR,
              };
              adp.echoLog(errorText, errorObject, 500, this.packName);
              REJECT(ERROR);
            });
        })
        .catch((ERROR) => {
          const errorText = 'Error in [ Promise.all ] at [ rbacOnlyGroupsRule ]';
          const errorObject = {
            groups: GROUPS,
            rbac: RBAC,
            error: ERROR,
          };
          adp.echoLog(errorText, errorObject, 500, this.packName);
          REJECT(ERROR);
        });
    });
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Builds the allowed and perview items into the rbac object
   * @param {object} RBAC the passed rbac object
   * @param {object} TIMER date object for the tracker
   * @returns {object} updated rbac object
   * @author Armando
   */
  allGroupsAsOneResult(RBAC, TIMER) {
    this.processTracking('allGroupsAsOneResult', 'Async');
    return new Promise((RESOLVE) => {
      const newRBAC = { allowed: {} };
      Object.keys(RBAC).forEach((KEY) => {
        const group = RBAC[KEY];
        if (group.allowed) {
          Object.keys(group.allowed).forEach((TYPE) => {
            if (newRBAC.allowed[TYPE] === undefined) {
              newRBAC.allowed[TYPE] = [];
            }
            group.allowed[TYPE].forEach((ID) => {
              if (!newRBAC.allowed[TYPE].includes(ID)) {
                newRBAC.allowed[TYPE].push(ID);
              }
            });
          });
        }
        if (this.preview) {
          if (newRBAC.preview === undefined) {
            newRBAC.preview = {};
          }
          newRBAC.preview[KEY] = RBAC[KEY].preview;
          newRBAC.preview[KEY].timerMS = RBAC[KEY].timerMS;
        }
      });
      this.processTimerUpdate(newRBAC, TIMER);
      RESOLVE(newRBAC);
    });
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Applies the group permission rules and sets the allowed assets
   * @param {string} ID the user signum
   * @param {object} RBAC the passed rbac object
   * @param {object} TIMER date object for the tracker
   * @param {object} PERMISSION the permission object as in the permission group
   * @param {object} GROUP the permission group to apply against
   * @param {boolean} HASCHANGES if changes were found
   * @returns {promise} void
   * @author Armando
   */
  rbacGroupsRuleByRule(ID, RBAC, TIMER, PERMISSION, GROUP, HASCHANGES) {
    this.processTracking('rbacGroupsRuleByRule', 'Async');
    return new Promise((RES, REJ) => {
      this.rbacGroupsRuleApply(ID, RBAC, TIMER, PERMISSION, GROUP, HASCHANGES)
        .then((GOTCHANGES) => {
          if (GOTCHANGES) {
            const toAddTimer = this.prepareObject(RBAC, ID);
            this.processTimerUpdate(toAddTimer, TIMER);
          }
          RES();
        })
        .catch((ERROR) => {
          const errorText = 'Error in [ this.rbacGroupsRuleApply ] at [ rbacGroupsRuleByRule ]';
          const errorObject = {
            id: ID,
            rbac: RBAC,
            permission: PERMISSION,
            group: GROUP,
            hasChanges: HASCHANGES,
            error: ERROR,
          };
          adp.echoLog(errorText, errorObject, 500, this.packName);
          REJ(ERROR);
        });
    });
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Applies the group permission rules and sets the allowed items
   * @param {string} SIGNUM user's signum
   * @param {object} RBAC the passed rbac object
   * @param {object} TIMER date object for the tracker
   * @param {object} PERMISSION the permission object as in the permission group
   * @param {object} GROUP the permission group to apply against
   * @param {boolean} HASCHANGES if changes were found
   * @returns {boolean} true if operation had been completed successfully
   * @author Armando
   */
  rbacGroupsRuleApply(SIGNUM, RBAC, TIMER, PERMISSION, GROUP, HASCHANGES) {
    this.processTracking('rbacGroupsRuleApply', 'Sync');
    const type = (`${PERMISSION.type}`).trim().toLowerCase();
    let errorMessage = null;
    let errorObject = null;
    switch (type) {
      case 'asset':
      case 'content':
        return this.typesResolution(SIGNUM, RBAC, TIMER, PERMISSION, GROUP, HASCHANGES, type)
          .then(GOTCHANGES => GOTCHANGES)
          .catch((ERROR) => {
            errorMessage = 'Error in [ this.typesResolution ] at [ rbacGroupsRuleApply ]';
            errorObject = {
              error: ERROR,
              signum: SIGNUM,
              rbac: RBAC,
              permission: PERMISSION,
              group: GROUP,
              type,
              hasChanges: HASCHANGES,
            };
            adp.echoLog(errorMessage, errorObject, 500, this.packName);
            return ERROR;
          });
      case 'attribute':
        return new Promise(RES => RES(true));
      default:
        errorMessage = 'Error in [ this.typesResolution ] at [ rbacGroupsRuleApply ]: Unknown type';
        errorObject = {
          error: errorMessage,
          signum: SIGNUM,
          rbac: RBAC,
          permission: PERMISSION,
          group: GROUP,
          hasChanges: HASCHANGES,
        };
        adp.echoLog(errorMessage, errorObject, 500, this.packName);
        return errorObject;
    }
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Sets the non-admin type rbac permissions for and individual signum after the admin process
   * for an individual group
   * @param {string} SIGNUM signum of the user to process
   * @param {object} RBAC the passed rbac object
   * @param {object} TIMER date object for the tracker
   * @param {object} PERMISSION the permission that is inside the group to process
   * @param {object} GROUP the permission group to process
   * @param {boolean} HASCHANGES has had admin changes
   * @param {string} TYPE with the type name supported
   * @returns {boolean} true if type asset permission has been updated
   * @author Armando
   */
  typesResolution(SIGNUM, RBAC, TIMER, PERMISSION, GROUP, HASCHANGES, TYPE) {
    this.processTracking('typesResolution', 'Async');
    return new Promise((RESOLVE, REJECT) => {
      const isDynamic = this.isDynamicPermission(PERMISSION);
      const isStatic = this.isStaticPermission(PERMISSION);
      const isStaticAndDynamic = this.isStaticAndDynamicPermission(PERMISSION);
      if (!isDynamic && !isStatic && !isStaticAndDynamic) {
        const errorObject = {
          code: 400,
          message: 'Invalid Permission',
          permission: PERMISSION,
        };
        REJECT(errorObject);
        return;
      }
      if (isDynamic) {
        this.dynamicPermission(PERMISSION, TYPE)
          .then((IDS) => {
            const gotChanges = this.addAllowedIDs(
              SIGNUM,
              RBAC,
              TIMER,
              PERMISSION,
              GROUP,
              HASCHANGES,
              IDS,
              `${TYPE}s`,
              'dynamic',
            );
            RESOLVE(gotChanges);
          })
          .catch((ERROR) => {
            REJECT(ERROR);
          });
      } else if (isStatic) {
        this.staticPermission(PERMISSION, TYPE)
          .then((IDS) => {
            const gotChanges = this.addAllowedIDs(
              SIGNUM,
              RBAC,
              TIMER,
              PERMISSION,
              GROUP,
              HASCHANGES,
              IDS,
              `${TYPE}s`,
              'static',
            );
            RESOLVE(gotChanges);
          })
          .catch((ERROR) => {
            REJECT(ERROR);
          });
      } else {
        this.staticAndDynamicPermission(PERMISSION, TYPE)
          .then((IDS) => {
            const gotChanges = this.addAllowedIDs(
              SIGNUM,
              RBAC,
              TIMER,
              PERMISSION,
              GROUP,
              HASCHANGES,
              IDS,
              `${TYPE}s`,
              'static-dynamic',
            );
            RESOLVE(gotChanges);
          })
          .catch((ERROR) => {
            REJECT(ERROR);
          });
      }
    });
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Builds the preview for allowed ids in the rbac object
   * @param {string} SIGNUM the signum of the user
   * @param {object} RBAC the passed rbac object
   * @param {object} TIMER date object for the tracker
   * @param {object} PERMISSION the permission that is in the group permission
   * @param {object} GROUP the group permission object
   * @param {boolean} HASCHANGES has any changes
   * @param {array} IDS list of allowed asset ids
   * @param {string} METHOD The method name that is being tracker
   * @param {string} BEHAVIOR if the methods is synchronous/asynchronous or in a db operation
   * @returns {boolean} true if any updates were processed
   * @author Armando
   */
  addAllowedIDs(SIGNUM, RBAC, TIMER, PERMISSION, GROUP, HASCHANGES, IDS, MODE, METHOD) {
    this.processTracking('addAllowedIDs', 'Sync');
    const info = this.prepareObject(RBAC, SIGNUM, 'allowed');
    let infoPreview = null;
    let hasChanges = HASCHANGES;
    if (this.preview) {
      infoPreview = this.prepareObject(RBAC, SIGNUM, 'preview', 'permission');
      if (infoPreview[MODE] === undefined) {
        infoPreview[MODE] = [];
      }
      const previewAssetForPermission = {
        groupID: GROUP._id,
        groupName: GROUP.name,
        permissionID: PERMISSION._id,
        permissionName: PERMISSION.name,
        behaviorOfThisPermission: METHOD,
        allowedAssetIDs: IDS,
      };
      infoPreview[MODE].push(previewAssetForPermission);
    }
    if (info[MODE] === undefined) {
      info[MODE] = [];
    }
    IDS.forEach((ID) => {
      if (!info[MODE].includes(ID)) {
        info[MODE].push(ID);
        hasChanges = true;
      }
    });
    return hasChanges;
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Fetches the allowed assets for a dynamic permission
   * @param {object} PERMISSION The permission object in question
   * @param {string} TYPE Name of the type supported
   * @returns {array<string>} list of allowed microservices
   * @author Armando
   */
  dynamicPermission(PERMISSION, TYPE) {
    this.processTracking('dynamicPermission', 'Async');
    return new Promise((RESOLVE, REJECT) => {
      if (Array.isArray(PERMISSION.dynamic) && Array.isArray(PERMISSION.exception)) {
        if ((`${PERMISSION.type}`).trim().toLowerCase() === 'asset') {
          const model = new adp.models.Adp();
          const dynamic = this.dynamicQuery(PERMISSION.dynamic);
          model.msSearch(dynamic, { name: 1 }, null, null, null, null, null, false)
            .then((RESULT) => {
              if (RESULT && RESULT.docs && RESULT.docs.length > 0) {
                const allowedIDs = [];
                let allMS = [];
                RESULT.docs.forEach((type) => {
                  if (Array.isArray(type.microservices)) {
                    allMS = allMS.concat(type.microservices);
                  }
                });
                allMS.forEach((MS) => {
                  if (!(PERMISSION.exception.includes(MS._id))) {
                    allowedIDs.push(MS._id);
                  }
                });
                RESOLVE(allowedIDs);
              } else {
                RESOLVE([]);
              }
            })
            .catch((ERROR) => {
              const errorText = 'Error in [ model.msSearch @ adp.models.Adp ] at [ dynamicPermission ]';
              const errorObject = {
                permission: PERMISSION,
                error: ERROR,
              };
              adp.echoLog(errorText, errorObject, 500, this.packName);
              REJECT();
            });
        } else if (TYPE === 'content') {
          if (Array.isArray(PERMISSION.dynamic)
            && PERMISSION.dynamic.length === 0
            && Array.isArray(PERMISSION.exception)
            && PERMISSION.exception.length === 0
            && PERMISSION.static === null) {
            const allowedIDs = [];
            Object.keys(this.allContent).forEach(KEY => allowedIDs.push(KEY));
            RESOLVE(allowedIDs);
          } else {
            REJECT();
          }
        } else {
          REJECT();
        }
      } else {
        REJECT();
      }
    });
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Gets the list of assets from the all assets array
   * @param {object} PERMISSION the permission object in question
   * @param {string} TYPE Name of the type supported
   * @returns {promise<array>} list of valid asset ids related to the permission
   * @author Armando
   */
  staticPermission(PERMISSION, TYPE) {
    this.processTracking('staticPermission', 'Async');
    return new Promise((RESOLVE, REJECT) => {
      if (Array.isArray(PERMISSION.static)) {
        const validAssets = [];
        PERMISSION.static.forEach((TARGET) => {
          if (TYPE === 'asset') {
            const targetExists = this.allAssets.find(ITEM => `${ITEM._id}` === TARGET);
            if (targetExists !== undefined) {
              validAssets.push(TARGET);
            }
          } else {
            validAssets.push(TARGET);
          }
        });
        RESOLVE(validAssets);
      } else {
        REJECT();
      }
    });
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Gets the list of assets from the all assets array
   * @param {object} PERMISSION the permission object in question
   * @param {string} TYPE Name of the type supported
   * @returns {promise<array>} list of valid asset ids related to the permission
   * @author Tirth
   */
  staticAndDynamicPermission(PERMISSION, TYPE) {
    this.processTracking('staticAndDynamicPermission', 'Async');
    return new Promise((RESOLVE, REJECT) => {
      if (TYPE === 'content'
      && Array.isArray(PERMISSION.static)
      && Array.isArray(PERMISSION.dynamic)
      && Array.isArray(PERMISSION.exception)
      && PERMISSION.dynamic.length === 0
      ) {
        const allowedIDs = [];
        Object.keys(this.allContent).forEach((KEY) => {
          if (!PERMISSION.exception.includes(`/${this.allContent[KEY].menu_slug}`)
           || PERMISSION.static.includes(this.allContent[KEY].object_id)) {
            allowedIDs.push(KEY);
          }
        });
        RESOLVE(allowedIDs);
      } else {
        REJECT();
      }
    });
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Checks if the permission is dynamic
   * @param {object} PERMISSION the permission object to check
   * @returns {boolean} true if the permission is dynamic
   * @author Armando
   */
  isDynamicPermission(PERMISSION) {
    this.processTracking('isDynamicPermission', 'Async');
    return Array.isArray(PERMISSION.dynamic)
      && Array.isArray(PERMISSION.exception)
      && (PERMISSION.static === null || PERMISSION.static === undefined);
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Checks if the permission is statics
   * @param {object} PERMISSION the permission object to check
   * @returns {boolean} true if the permission is static
   * @author Armando
   */
  isStaticPermission(PERMISSION) {
    this.processTracking('isStaticPermission', 'Sync');
    return Array.isArray(PERMISSION.static)
      && (PERMISSION.dynamic === null || PERMISSION.dynamic === undefined)
      && (PERMISSION.exception === null || PERMISSION.exception === undefined);
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Checks if the permission is static and dynamic
   * @param {object} PERMISSION the permission object to check
   * @returns {boolean} true if the permission is static and dynamic
   * @author Tirth
   */
  isStaticAndDynamicPermission(PERMISSION) {
    this.processTracking('isStatiAndDynamicPermission', 'Sync');
    return Array.isArray(PERMISSION.static)
        && Array.isArray(PERMISSION.dynamic)
        && Array.isArray(PERMISSION.exception);
  }

  // ------------------------------------------------------------------------------------------ //


  /**
   * Builds the query for the dynamic items
   * @param {object} PERMISSION the permission object to build off
   * @returns {array<objects>} the dynamic items query array
   * @author Armando
   */
  dynamicQuery(PERMISSION) {
    this.processTracking('dynamicQuery', 'Sync');
    if (!Array.isArray(PERMISSION)) {
      return '400 - Bad Request';
    }
    if (Array.isArray(PERMISSION) && PERMISSION.length === 0) {
      return [];
    }
    const filters = [];
    PERMISSION.forEach((ITEM) => {
      const slug = ITEM.slug ? ITEM.slug : null;
      let value = null;
      if (Array.isArray(ITEM.items)) {
        ITEM.items.forEach((SUBITEM) => {
          const theValue = typeof SUBITEM['select-id'] === 'number' ? SUBITEM['select-id'] : null;
          if (!Array.isArray(value) && value !== null && theValue !== null) {
            const previousValue = value;
            value = [previousValue];
          }
          if (value === null && theValue !== null) {
            value = theValue;
          }
          if (Array.isArray(value) && theValue !== null) {
            value.push(theValue);
          }
        });
      }
      const obj = {};
      if (Array.isArray(value)) {
        obj[slug] = { $in: value };
      } else {
        obj[slug] = { $eq: value };
      }
      filters.push(obj);
    });
    return filters;
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Checks the permission against specific ids to determine if the user is allowed
   * access to said ids
   * @param {object} RBAC the passed rbac object
   * @param {array} TARGET List of target ids to focus the permission check
   * @param {object} TIMER date object for the tracker
   * @returns {promise<object>} the updated rbac object
   * @author Armando
   */
  targetThis(RBAC, TARGET, TIMER) {
    this.processTracking('targetThis', 'Async');
    return new Promise((RESOLVE, REJECT) => {
      let newRBAC = null;
      if (RBAC.allowed) {
        try {
          newRBAC = this.targetThisForGroups(RBAC, TARGET, TIMER);
          const trackIsOff = this.track === undefined;
          const previewIsOff = this.preview === false;
          if (trackIsOff && previewIsOff) {
            let permissionsQuant = 0;
            Object.keys(newRBAC.allowed).forEach((TYPE) => {
              if (TYPE !== 'timerMS') {
                const permissionsByType = newRBAC.allowed[TYPE];
                permissionsQuant += Array.isArray(permissionsByType)
                  ? permissionsByType.length : 0;
              }
            });
            if (permissionsQuant === 0) {
              let errorBehavior = 404;
              if (this.allAssets) {
                const targetExists = this.allAssets.find(ITEM => TARGET.includes(ITEM._id));
                if (targetExists) {
                  errorBehavior = 403;
                } else {
                  TARGET.forEach((ID) => {
                    if (this.allContent && this.allContent[ID]) {
                      errorBehavior = 403;
                    }
                  });
                }
              }
              REJECT(errorBehavior);
            } else {
              RESOLVE(newRBAC);
            }
          } else {
            RESOLVE(newRBAC);
          }
        } catch (ERROR) {
          const errorText = 'Try/Catch on groups got an error on [ targetThis ]';
          const errorObj = {
            error: ERROR,
            rbac: RBAC,
            target: TARGET,
            timer: TIMER,
          };
          adp.echoLog(errorText, errorObj, 500, this.packName);
          REJECT(ERROR);
        }
      } else {
        try {
          if (this.wpPreview === true) {
            // checks if user is accessing preview page and have access to 'Review Items' menu
            newRBAC = this.targetThisForUsers(RBAC, this.previewId, TIMER);
          } else {
            newRBAC = this.targetThisForUsers(RBAC, TARGET, TIMER);
          }
          const isOneUser = Object.keys(newRBAC).length === 1;
          const trackIsOff = this.track === undefined;
          const previewIsOff = this.preview === false;
          if (isOneUser && trackIsOff && previewIsOff) {
            let isAdmin = false;
            let permissionsQuant = 0;
            Object.keys(newRBAC).forEach((USER) => {
              const user = newRBAC[USER];
              if (!user.allowed && user.admin) {
                isAdmin = true;
              } else {
                Object.keys(user.allowed).forEach((TYPE) => {
                  if (TYPE !== 'timerMS') {
                    const permissionsByType = user.allowed[TYPE];
                    permissionsQuant += Array.isArray(permissionsByType)
                      ? permissionsByType.length : 0;
                  }
                });
              }
            });
            if (permissionsQuant === 0 && isAdmin === false) {
              let errorBehavior = 404;
              if (this.allAssets) {
                const targetExists = this.allAssets.find(ITEM => TARGET.includes(ITEM._id));
                if (targetExists) {
                  errorBehavior = 403;
                } else {
                  TARGET.forEach((ID) => {
                    if (this.allContent && this.allContent[ID]) {
                      errorBehavior = 403;
                    }
                  });
                }
              }
              REJECT(errorBehavior);
            } else {
              RESOLVE(newRBAC);
            }
          } else {
            RESOLVE(newRBAC);
          }
        } catch (ERROR) {
          const errorText = 'Try/Catch on users got an error on [ targetThis ]';
          const errorObj = {
            error: ERROR,
            rbac: RBAC,
            target: TARGET,
            timer: TIMER,
          };
          adp.echoLog(errorText, errorObj, 500, this.packName);
          REJECT(ERROR);
        }
      }
    });
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Updates the rbac.allowed array according to the given target array if the target id is in
   * that specific users allowed ids
   * @param {object} RBAC the passed rbac object
   * @param {array<strings>} TARGET list of targeted ids
   * @returns {object} updated rbac object with the targeted allowed items
   * @author Armando
   */
  targetThisForUsers(RBAC, TARGET) {
    this.processTracking('targetThisForUsers', 'Sync');
    if (Array.isArray(TARGET) && TARGET.length > 0) {
      Object.keys(RBAC).forEach((SIGNUM) => {
        if (this.wpFullUserMenu === null) {
          this.wpFullUserMenu = {};
        }
        if (this.wpFullUserMenu[SIGNUM] === undefined) {
          this.wpFullUserMenu[SIGNUM] = [];
        }
        const theUser = RBAC[SIGNUM];
        if (theUser.admin === false) {
          Object.keys(theUser.allowed).forEach((TYPE) => {
            const allow = [];
            theUser.allowed[TYPE].forEach((ID) => {
              if (TARGET.includes(ID)) {
                allow.push(ID);
              }
              if (TYPE === 'contents') {
                if (!this.wpFullUserMenu[SIGNUM].includes(ID)) {
                  this.wpFullUserMenu[SIGNUM].push(ID);
                }
              }
            });
            theUser.allowed[TYPE] = allow;
          });
        }
      });
    }
    return RBAC;
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Checks if the targeted items are held within the already defined allowed permission ids
   * @param {object} RBAC the passed rbac object
   * @param {array} TARGET list of target ids
   * @returns {object} the updated rbac object
   * @author Armando
   */
  targetThisForGroups(RBAC, TARGET) {
    this.processTracking('targetThisForGroups', 'Sync');
    if (Array.isArray(TARGET) && TARGET.length > 0) {
      Object.keys(RBAC.allowed).forEach((TYPE) => {
        const allow = [];
        if (TYPE !== 'timerMS') {
          RBAC.allowed[TYPE].forEach((ID) => {
            if (TARGET.includes(ID)) {
              allow.push(ID);
            }
          });
          const rbac = RBAC;
          rbac.allowed[TYPE] = allow;
        }
      });
    }
    return RBAC;
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Build the rbac permission objects for given user objects
   * @param {array} USERS List of user objects
   * @param {object} RBAC the passed rbac object
   * @param {array} TARGET list of target ids
   * @param {object} TIMER date object for the tracker
   * @returns {promise} returns nothing if successful
   * @author Armando
   */
  rbacByUsers(USERS, RBAC, TARGET, TIMER) {
    this.processTracking('rbacByUsers', 'Async');
    return new Promise((RESOLVE, REJECT) => {
      this.loadListOption()
        .then(() => this.loadAssetIdsByDomain())
        .then(() => this.adminRule(USERS, RBAC, TIMER))
        .then(() => this.domainAdminRule(USERS, RBAC, TIMER))
        .then(() => this.serviceOwnerRule(USERS, RBAC, TIMER))
        .then(() => this.rbacGroupsRule(USERS, RBAC, TIMER))
        .then(() => this.targetThis(RBAC, TARGET, TIMER))
        .then(() => {
          RESOLVE();
        })
        .catch((ERROR) => {
          const errorCode = ERROR;
          const errorMessage = 'Error in [ Promise Chain ] at [ rbacByUsers ]';
          const errorObject = {
            error: ERROR,
            users: USERS,
            rbac: RBAC,
            target: TARGET,
          };
          errorLog(errorCode, errorMessage, errorObject, 'rbacByUsers', this.packName);
          REJECT(errorCode);
        });
    });
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Populates the rbac object according to a list of group permissions
   * @param {array<objects>} GROUPS permission group list
   * @param {object} RBAC the rbac object for processing
   * @param {array<strings>} TARGET list of targeted ids
   * @param {object} TIMER date object for the tracker
   * @returns {object} updated rbac object associated to group permisssions
   * @author Armando
   */
  rbacByGroups(GROUPS, RBAC, TARGET, TIMER) {
    this.processTracking('rbacByGroups', 'Async');
    return new Promise((RESOLVE, REJECT) => {
      this.loadListOption()
        .then(() => this.loadAssetIdsByDomain())
        .then(() => this.rbacOnlyGroupsRule(GROUPS, RBAC, TIMER))
        .then(NEWRBAC => this.targetThis(NEWRBAC, TARGET, TIMER))
        .then((NEWRBAC) => {
          RESOLVE(NEWRBAC);
        })
        .catch((ERROR) => {
          const errorText = 'Error in [ Promise Chain ] at [ rbacByGroups ]';
          const errorObject = {
            error: ERROR,
            groups: GROUPS,
            rbac: RBAC,
            target: TARGET,
          };
          let errorCode = 500;
          if (ERROR === 403) {
            errorCode = 403;
          }
          if (ERROR === 404) {
            errorCode = 404;
          }
          adp.echoLog(errorText, errorObject, errorCode, this.packName);
          REJECT(ERROR);
        });
    });
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Tracker for the build process
   * @param {string} METHOD The method name that is being tracker
   * @param {string} BEHAVIOR if the methods is synchronous/asynchronous or in a db operation
   * @author Armando
   */
  processTracking(METHOD, BEHAVIOR) {
    if (this.track === undefined) {
      return;
    }
    const last = this.track.steps[this.track.steps.length - 1];
    if (last !== undefined && last.method === METHOD) {
      this.track.steps[this.track.steps.length - 1].sequentialCalls += 1;
      this.track.steps[this.track.steps.length - 1].totalTimeMS = (new Date()) - this.track.start;
    } else {
      const trackObject = {
        method: METHOD,
        behavior: BEHAVIOR,
        sequentialCalls: 1,
        totalTimeMS: (new Date()) - this.track.start,
      };
      this.track.steps.push(trackObject);
    }
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Forbidden response
   * @param {object} RES response object
   * @author Armando
   */
  forbidden(RES) {
    this.processTracking('forbidden', 'Sync');
    const res = adp.setHeaders(RES);
    const answer = new adp.Answers();
    answer.setCode(403);
    res.statusCode = 403;
    answer.setMessage('403 Forbidden');
    answer.setLimit(999999);
    answer.setTotal(1);
    answer.setPage(1);
    answer.setCache(undefined);
    answer.setData(undefined);
    answer.setTime((new Date()) - this.start);
    try {
      res.closed = true;
      res.end(answer.getAnswer());
    } catch (ERROR) {
      const errorText = 'Error on [ forbidden ]';
      const errorObject = {
        origin: 'notFound',
        error: ERROR,
        res: RES,
      };
      adp.echoLog(errorText, errorObject, 500, this.packName);
    }
  }

  // ------------------------------------------------------------------------------------------ //

  /**
   * Not Found response
   * @param {object} RES response object
   * @author Armando
   */
  notFound(RES) {
    this.processTracking('notFound', 'Sync');
    const res = adp.setHeaders(RES);
    const answer = new adp.Answers();
    answer.setCode(404);
    res.statusCode = 404;
    answer.setMessage('404 Not Found');
    answer.setLimit(999999);
    answer.setTotal(1);
    answer.setPage(1);
    answer.setCache(undefined);
    answer.setData(undefined);
    answer.setTime((new Date()) - this.start);
    try {
      res.closed = true;
      res.end(answer.getAnswer());
    } catch (ERROR) {
      const errorText = 'Error on [ notFound ]';
      const errorObject = {
        origin: 'notFound',
        error: ERROR,
        res: RES,
      };
      adp.echoLog(errorText, errorObject, 500, this.packName);
    }
  }

  // ------------------------------------------------------------------------------------------ //
  /**
   * [ processRBAC ]
   * Method which start all the RBAC process.
   * @param {object} REQ The Request Object
   * @param {object} RES The Response Object
   * @param {object} NEXT The CallBack Function
   * @author Armando Dias [zdiaarm]
   */
  processRBAC(REQ, RES, NEXT) {
    this.processTracking('processRBAC', 'Async');
    const timer = new Date();
    const req = REQ;
    req.rbac = {};

    this.wpPreview = REQ
      && REQ.wpcontent
      && REQ.wpcontent.wppath === 'preview'
      && REQ.wpcontent.isPreview;

    this.previewId = REQ
      && REQ.wpcontent
      && REQ.wpcontent.previewId;

    const action = () => new Promise((RESOLVE, REJECT) => {
      const { users, groups, targets } = this.checkRequest(req);
      if (Array.isArray(users) && groups === null) {
        this.rbacByUsers(users, req.rbac, targets, timer)
          .then(() => {
            if (this.track !== undefined) {
              this.processTracking('endOfProcess');
              req.rbac.track = this.track;
            }
            req.wpFullUserMenu = this.wpFullUserMenu;
            RESOLVE(NEXT(req, RES));
          })
          .catch((ERROR) => {
            if (ERROR === 403) {
              this.forbidden(RES);
            } else if (ERROR === 404) {
              this.notFound(RES);
            }
            REJECT(ERROR);
          });
      } else if (Array.isArray(groups) && users === null) {
        this.rbacByGroups(groups, req.rbac, targets, timer)
          .then((NEWRBAC) => {
            req.rbac = NEWRBAC;
            if (this.track !== undefined) {
              this.processTracking('endOfProcess');
              req.rbac.track = this.track;
            }
            req.wpFullUserMenu = this.wpFullUserMenu;
            RESOLVE(NEXT(req, RES));
          })
          .catch((ERROR) => {
            if (ERROR === 403) {
              this.forbidden(RES);
            } else if (ERROR === 404) {
              this.notFound(RES);
            }
            REJECT(ERROR);
          });
      } else {
        const errorObject = {
          code: 400,
          desc: '400 - Bad Request',
          message: 'Incorrect parameters for RBAC Process!',
          users,
          groups,
          targets,
        };
        REJECT(errorObject);
      }
    });

    this.allContent = REQ
      && REQ.wpcontent
      && REQ.wpcontent.allContent
      ? REQ.wpcontent.allContent : null;
    if (!this.allContent) {
      const contentPreparation = new adp.middleware.RBACContentPreparationClass();
      return contentPreparation.loadAllContentIDs()
        .then(() => {
          this.allContent = contentPreparation.req.wpcontent.allContent;
          return action();
        })
        .catch(ERROR => new Promise((RESULT, REJECT) => REJECT(ERROR)));
    }
    return action();
  }
  // ------------------------------------------------------------------------------------------ //
}
// ============================================================================================= //
module.exports = MiddlewareClass;
// ============================================================================================= //
