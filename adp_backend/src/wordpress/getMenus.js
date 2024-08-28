// ============================================================================================= //
/**
 * [adp.wordpress.getMenus]
 * This function is used to make WordPress API call to read menu details.
 *
 * << BEFORE ANYTHING >>
 * If you are just starting to read this file, start by the last public
 * function after read all these important notes:
 *
 * << IMPORTANT 1 >>
 * There is a protection to not run before the previous execution
 * be finished ( Successful or not ). Only one user trigger the process.
 * All the others will wait for the answer ( Full Wordpress Menu ).
 * After done, the process is released to be activated by the first next user.
 *
 * << IMPORTANT 2 >>
 * The [ adp.mastercache ] is used twice. First to cache the modifiedDate and
 * the second to cache the Full Wordpress Menu.
 *
 * << IMPORTANT 3 >>
 * If the parameter MENUSLUG is not null, after the cache procedures,
 * the private function [ getSpecificMenu ] is called and from the Full
 * Menu, will search and delivery the specified menu.
 *
 * << IMPORTANT 4 >>
 * You probably figure out about: Doesn't matter the parameter MENUSLUG,
 * this function always call the Full Wordpress Menu from remote or the
 * Full Wordpress Menu from the cache. This is because this information
 * is important for the RBAC. At the end, the final value can change
 * ( following the MENUSLUG parameter value ) if necessary.
 *
 * @param {string} MENUSLUG Slug of menu. If null, returns all menus.
 * @returns {Object} The return will be a promise with an Array of Menus
 * ( Case the MENUSLUG is null ) or an object containing only one menu
 * ( Case the MENUSLUG is a valid string containing a menu slug ).
 * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
 */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
const packName = 'adp.wordpress.getMenus';
const cacheObject = 'WORDPRESS';
const cacheSubObject = 'FULLMENU';
// ============================================================================================= //
let privateGlobalLastModified = null;
let holderPromise = null;
let holderPromiseTriggerRES = null;
let holderPromiseTriggerREJ = null;
let retryHEAD = 3;
let retryGET = 3;
// ============================================================================================= //


// ============================================================================================= //
/**
 * This function [ deleteContentIDsFromDatabase ]
 * get an array of Content Object IDs and remove
 * them from the database.
 * @param {Array} IDSTOREMOVE All the Wordpress Object IDs to remove.
 * @returns {Promise} Promise resolved if successful. Rejected if fails.
 * @author Omkar Sadegaonkar, Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
const deleteContentIDsFromDatabase = (IDSTOREMOVE) => {
  const idsToRemove = Array.isArray(IDSTOREMOVE) ? IDSTOREMOVE : [];
  if (idsToRemove.length) {
    const timer = new Date();
    const rbacGroupsModel = new adp.models.RBACGroups();
    const adpModel = new adp.models.Adp();
    return new Promise((RESOLVE, REJECT) => {
      Promise.all([
        adpModel.cleanContentPermissions(idsToRemove),
        rbacGroupsModel.cleanContentPermissions(idsToRemove),
      ])
        .then(() => {
          const text = `Content permissions cleaned successfully in ${new Date() - timer}ms`;
          adp.echoLog(text, null, 200, packName, false);
          RESOLVE();
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Trying to clear the Content Permissions';
          const errorObject = {
            error: ERROR,
            idsToRemove,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'deleteContentIDsFromDatabase', packName));
        });
    });
  }
  return new Promise(RES => RES());
};
// ============================================================================================= //


// ============================================================================================= //
/**
 * This function [ cleanOldPermissionsFromDb ] compares the
 * Object IDs from database with the Object IDs from the
 * latest Remote Response. After this validation, calls
 * [ deleteContentIDsFromDatabase ] to delete a possible
 * list of unavailable content IDs.
 * @param {object} ALLMENUS All the Wordpress Menus Object.
 * @returns {Promise} Promise resolved if successful. Rejected if fails.
 * @author Omkar Sadegaonkar, Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
const cleanOldPermissionsFromDb = (ALLMENUS) => {
  const idsToRemove = [];
  let idsFromRemote = [];
  let idsFromDatabase = [];
  if (ALLMENUS && Array.isArray(ALLMENUS.menus)) {
    ALLMENUS.menus.forEach((menu) => {
      menu.items.map((menuObj) => {
        idsFromRemote[menuObj.object_id] = menuObj.object_id;
        return true;
      });
    });
  }
  idsFromRemote = Array.from(new Set(idsFromRemote));
  const rbacGroupsModel = new adp.models.RBACGroups();
  return rbacGroupsModel.getAllContentIDs()
    .then((RESULT) => {
      if (RESULT && RESULT.docs && RESULT.docs[0] && Array.isArray(RESULT.docs[0].ids)) {
        idsFromDatabase = RESULT.docs[0].ids;
        idsFromDatabase.forEach((WPID) => {
          if (idsFromRemote && !idsFromRemote.includes(WPID)) {
            idsToRemove.push(WPID);
          }
        });
        if (idsToRemove && idsToRemove.length > 0) {
          return deleteContentIDsFromDatabase(idsToRemove)
            .then(() => new Promise(RESOLVE => RESOLVE()))
            .catch((ERROR) => {
              const errorCode = ERROR.code || 500;
              const errorMessage = ERROR.message || 'Error calling [ deleteContentIDsFromDatabase ]';
              const errorObject = {
                error: ERROR,
                allmenus: ALLMENUS,
              };
              return new Promise((RESOLVE, REJECT) => REJECT(errorLog(errorCode, errorMessage, errorObject, 'cleanOldPermissionsFromDb', packName)));
            });
        }
        return new Promise(RESOLVE => RESOLVE());
      }
      const errorCode = 500;
      const errorMessage = 'Expectation Failed. Answer from [ getAllContentIDs @ adp.models.RBACGroups ] does not match the expectation.';
      const typeAttribute = RESULT
        && RESULT.docs
        && RESULT.docs[0]
        && RESULT.docs[0].ids
        ? `Got ${typeof RESULT.docs[0].ids} instead.`
        : '';
      const errorObject = {
        error: `The response should contain the structure "RESULT.docs[0].ids" where "ids" is an Array.${typeAttribute}`,
        body: RESULT,
      };
      return new Promise((RESOLVE, REJECT) => REJECT(errorLog(errorCode, errorMessage, errorObject, 'cleanOldPermissionsFromDb', packName)));
    })
    .catch((ERROR) => {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || 'Error on [ rbacGroupsModel.getAllContentIDs @ adp.models.RBACGroups ]';
      const errorObject = {
        error: ERROR,
        allmenus: ALLMENUS,
      };
      return new Promise((RESOLVE, REJECT) => REJECT(errorLog(errorCode, errorMessage, errorObject, 'cleanOldPermissionsFromDb', packName)));
    });
};
// ============================================================================================= //


// ============================================================================================= //
/**
 * The [ getAllMenusFromRemote ] is used to fetch menu
 * from wordpress. To avoid exceed of requests, the
 * private function [ retrieveWordpressMenu ] uses
 * [ adp.masterCache ] before calls this function.
 * @returns {Promise} Promise with all Wordpress Menus.
 * @author Omkar Sadegaonkar, Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
const getAllMenusFromRemote = () => {
  const wordpressLink = adp.config.wordpress.url;
  const reqUrl = `${wordpressLink}menu?ts=${adp.timeStamp(false, false)}`;
  return new Promise((RESOLVE, REJECT) => {
    global.superagent.get(reqUrl)
      .then((MENUSFROMWORDPRESS) => {
        if (MENUSFROMWORDPRESS
          && MENUSFROMWORDPRESS.body
          && MENUSFROMWORDPRESS.body.menus
          && Array.isArray(MENUSFROMWORDPRESS.body.menus)) {
          RESOLVE(MENUSFROMWORDPRESS.body);
          return;
        }
        const errorCode = 500;
        const errorMessage = 'Expectation Failed. Answer from Wordpress Menus does not match the expectation.';
        const typeAttribute = MENUSFROMWORDPRESS
          && MENUSFROMWORDPRESS.body
          && MENUSFROMWORDPRESS.body.menus
          ? `Got ${typeof MENUSFROMWORDPRESS.body.menus} instead.`
          : '';
        const errorObject = {
          error: `The "body" of response should contain a "menus" array attribute.${typeAttribute}`,
          body: MENUSFROMWORDPRESS.body,
          wordpressLink,
          reqUrl,
        };
        REJECT(errorLog(errorCode, errorMessage, errorObject, 'getAllMenusFromRemote', packName));
      })
      .catch((ERROR) => {
        retryGET -= 1;
        if (retryGET > 0) {
          getAllMenusFromRemote()
            .then((RESULT) => {
              RESOLVE(RESULT);
            })
            .catch((ERRORONRETRYGET) => {
              REJECT(ERRORONRETRYGET);
            });
        } else {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error on global.superagent.get()';
          const errorObject = {
            error: ERROR,
            wordpressLink,
            reqUrl,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'getAllMenusFromRemote', packName));
        }
      });
  });
};
// ============================================================================================= //


// ============================================================================================= //
/**
 * After retrieved the Full Wordpress Menu ( Usefull for RBAC ),
 * in case of MENUSLUG is not null, this function [ getSpecificMenu ]
 * will find the required menu and send only an object instead of an
 * array with all the menus.
 * @returns {Promise} Promise with just one Wordpress Menu.
 * @author Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
const getSpecificMenu = (CACHE, MENUSLUG) => new Promise((RESOLVE, REJECT) => {
  const allSlugs = [];
  let targetMenu = null;
  CACHE.menus.forEach((MENU) => {
    const { slug } = MENU;
    allSlugs.push(slug);
    if (`${slug}`.trim().toLowerCase() === MENUSLUG.trim().toLowerCase()) {
      targetMenu = MENU;
    }
  });
  if (targetMenu) {
    RESOLVE(targetMenu);
    return;
  }
  const errorCode = 404;
  const errorMessage = 'This specific slug was not found in the Wordpress Menus';
  const errorObject = {
    error: `'${MENUSLUG}' was not found in the array ${allSlugs.toString()}.`,
    menuslug: MENUSLUG,
    allSlugs,
    cachedValue: CACHE,
  };
  REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
});
// ============================================================================================= //


// ============================================================================================= //
/**
 * After retrieved the Full Wordpress Menu ( Usefull for RBAC ),
 * in case of MENUSLUG is not null, this function will find
 * the required menu and send only an object instead of an array.
 * @returns {Promise} Promise with just one Wordpress Menu.
 * @author Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
const retrieveWordpressMenu = () => new Promise((RESOLVE, REJECT) => {
  const cacheHolderInMilliseconds = adp
    && adp.config
    && adp.config.wordpress
    && adp.config.wordpress.menus
    && adp.config.wordpress.menus.cacheTimeOutInSeconds
    ? adp.config.wordpress.menus.cacheTimeOutInSeconds * 1000
    : 60000;

  adp.masterCache.get(cacheObject, cacheSubObject, 'all')
    .then((CACHE) => {
      RESOLVE(CACHE);
    })
    .catch(() => {
      getAllMenusFromRemote()
        .then((ALLMENUS) => {
          adp.masterCache.set(cacheObject, cacheSubObject, 'all', ALLMENUS, cacheHolderInMilliseconds);
          cleanOldPermissionsFromDb(ALLMENUS)
            .then(() => {
              RESOLVE(ALLMENUS);
            })
            .catch((ERROR) => {
              const errorCode = 500;
              const errorMessage = 'Unexpected error trying to clean old permissions from database.';
              const errorObject = {
                error: ERROR,
                cacheObjectInfo: {
                  cacheObject,
                  cacheSubObject,
                  cacheHolderInMilliseconds,
                },
              };
              REJECT(errorLog(errorCode, errorMessage, errorObject, 'retrieveWordpressMenu', packName));
            });
        })
        .catch((ERROR) => {
          const errorCode = 500;
          const errorMessage = 'Error processing the menus from Wordpress';
          const errorObject = {
            error: ERROR,
            cacheObjectInfo: {
              cacheObject,
              cacheSubObject,
              cacheHolderInMilliseconds,
            },
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'retrieveWordpressMenu', packName));
        });
    });
});
// ============================================================================================= //


// ============================================================================================= //
/**
 * The [ requestModifiedDateFromWordpress ] is responsible
 * for retrieve the HEAD from Wordpress to get the
 * last_modified of the menus. Takes the decision
 * if is expired ( true ) or not ( false ).
 * This was removed from [ dateModifiedFromWordpressIsUpdated ]
 * to become recursive ( retryHEAD > 0 ).
 * @returns {Promise} Promise with a boolean value.
 * @author Omkar Sadegaonkar, Armando Dias [ zdiaarm ]
 */
// =========================================================================================== //
const requestModifiedDateFromWordpress = () => new Promise((RESOLVE, REJECT) => {
  const wordpressLink = adp.config.wordpress.url;
  const reqUrl = `${wordpressLink}menu?ts=${adp.timeStamp(false, false)}`;
  const cacheOfModifiedDateTimeOutInSeconds = adp
    && adp.config
    && adp.config.wordpress
    && adp.config.wordpress.menus
    && adp.config.wordpress.menus.cacheOfModifiedDateTimeOutInSeconds
    ? adp.config.wordpress.menus.cacheOfModifiedDateTimeOutInSeconds * 1000
    : 60000;

  global.superagent.head(reqUrl)
    .then((RES) => {
      const lastModifiedRemote = RES && RES.headers && RES.headers.last_modified ? `${RES.headers.last_modified}` : null;
      if (lastModifiedRemote) {
        adp.masterCache.set(cacheObject, cacheSubObject, 'cacheOfModifiedDate', lastModifiedRemote, cacheOfModifiedDateTimeOutInSeconds);
      }
      if (!privateGlobalLastModified) {
        privateGlobalLastModified = lastModifiedRemote;
        RESOLVE(true);
      } else if (privateGlobalLastModified === lastModifiedRemote) {
        RESOLVE(false);
      } else {
        privateGlobalLastModified = lastModifiedRemote;
        RESOLVE(true);
      }
    })
    .catch((ERROR) => {
      retryHEAD -= 1;
      if (retryHEAD > 0) {
        requestModifiedDateFromWordpress()
          .then((RESULT) => {
            RESOLVE(RESULT);
          })
          .catch((ERRORONRETRYGET) => {
            REJECT(ERRORONRETRYGET);
          });
      } else {
        const errorCode = ERROR.code || 500;
        const errorMessage = ERROR.message || 'Error retrieving the headers from the menu(s) from Wordpress';
        const errorObject = {
          error: ERROR,
          cacheObjectInfo: {
            cacheObject,
            cacheSubObject,
            cacheKey: 'all',
          },
        };
        REJECT(errorLog(errorCode, errorMessage, errorObject, 'dateModifiedFromWordpressIsUpdated', packName));
      }
    });
});
// =========================================================================================== //


// ============================================================================================= //
/**
 * Responsible for check if last_modified was updated.
 * This function [ dateModifiedFromWordpressIsUpdated ]
 * uses [ adp.masterCache ] to avoid multiple requests
 * to Wordpress.
 * If cache not available or expired, this function
 * calls [ requestModifiedDateFromWordpress ].
 * @returns {Promise} Promise returns a boolean.
 * True means the last_modified was updated or this
 * is the first time is running on this Backend's session.
 * So the menu should be retrieved from Wordpress.
 * Case false, Backend can use the value in cache.
 * @author Omkar Sadegaonkar, Armando Dias [ zdiaarm ]
 */
// ============================================================================================= //
const dateModifiedFromWordpressIsUpdated = () => new Promise((RESOLVE, REJECT) => {
  adp.masterCache.get(cacheObject, cacheSubObject, 'cacheOfModifiedDate')
    .then(() => {
      RESOLVE(false);
    })
    .catch(() => {
      requestModifiedDateFromWordpress()
        .then((RESULT) => {
          RESOLVE(RESULT);
        })
        .catch((ERROR) => {
          REJECT(ERROR);
        });
    });
});
// =========================================================================================== //


// ============================================================================================= //
/**
 * The [ getTheWordpressMenu ] just organise the order
 * of the process: First verify the status of the last_modified
 * date - Calling [ dateModifiedFromWordpressIsUpdated ]. After
 * can clear the cache for the menu ( if last_modified was udpated )
 * or keept the cache and call [ retrieveWordpressMenu ] which will
 * get the Full Wordpress Menus from cache ( If not expired ) or from
 * Remote Wordpress Server ( Case last_modified was udpated or case
 * the cache is expired ).
 * @returns {Promise} Promise with the Full Wordpress Menus.
 * @author Omkar Sadegaonkar, Armando Dias [ zdiaarm ]
 */
// =========================================================================================== //
const getTheWordpressMenu = () => new Promise((RESOLVE, REJECT) => {
  dateModifiedFromWordpressIsUpdated()
    .then((NEEDUPDATETHEMENU) => {
      if (NEEDUPDATETHEMENU === true) {
        adp.masterCache.clear(cacheObject, cacheSubObject, 'all');
      }
      retrieveWordpressMenu()
        .then((MENUOBJECT) => {
          RESOLVE(MENUOBJECT);
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Trying to retrieve the menus from Wordpress.';
          const errorObject = {
            error: ERROR,
            cacheObjectInfo: {
              cacheObject,
              cacheSubObject,
              cacheKey: 'all',
            },
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'getTheWordpressMenu', packName));
        });
    })
    .catch((ERROR) => {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || 'Trying to obtain the modifiedDate from Wordpress.';
      const errorObject = {
        error: ERROR,
        cacheObjectInfo: {
          cacheObject,
          cacheSubObject,
          cacheKey: 'all',
        },
      };
      REJECT(errorLog(errorCode, errorMessage, errorObject, 'getTheWordpressMenu', packName));
    });
});
// =========================================================================================== //


// ============================================================================================= //
/**
 * The public function. The global private variable "holderPromise"
 * start as null and is setted as a Promise by the first user which
 * calls this function. Any other user who arrives before all the
 * process finishes ( Successful or not ) will wait at Promise.all.
 * All the requests will get the same Full Wordpress Menus Object
 * but if MENUSLUG is not null for some calls, the function
 * [ getSpecificMenu ] will filter and send just what's matter
 * for that specific call.
 * @returns {Promise} Promise with an Array containing the Full
 * Wordpress Menus ( Case MENUSLUG is null ) or just a object
 * with the menu where the slug is the MENUSLUG string.
 * @author Armando Dias [ zdiaarm ]
 */
// =========================================================================================== //
module.exports = (MENUSLUG = null) => new Promise((RESOLVE, REJECT) => {
  if (!holderPromise) {
    retryHEAD = 3;
    retryGET = 3;
    holderPromise = new Promise((RES, REJ) => {
      holderPromiseTriggerRES = RES;
      holderPromiseTriggerREJ = REJ;
      getTheWordpressMenu(MENUSLUG)
        .then((MENUOBJ) => {
          holderPromiseTriggerRES(MENUOBJ);
          holderPromise = null;
        })
        .catch((ERROR) => {
          holderPromiseTriggerREJ(ERROR);
          holderPromise = null;
        });
    });
  }
  Promise.all([holderPromise])
    .then((RESULT) => {
      if (Array.isArray(RESULT)) {
        const fullMenu = RESULT[0];
        if (MENUSLUG) {
          getSpecificMenu(fullMenu, MENUSLUG)
            .then((SELECTEDMENU) => {
              RESOLVE(SELECTEDMENU);
            })
            .catch((ERROR) => {
              const errorCode = ERROR.code || 500;
              const errorMessage = ERROR.message || 'Error trying to get specific menu from Wordpress.';
              const errorObject = {
                error: ERROR,
                menuslug: MENUSLUG,
                cacheObjectInfo: {
                  cacheObject,
                  cacheSubObject,
                  cacheKey: 'all',
                },
              };
              REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
            });
        } else {
          RESOLVE(fullMenu);
        }
      } else {
        const errorCode = 500;
        const errorMessage = 'Expectation Failed. Answer from Wordpress Menus does not match the expectation.';
        const errorObject = {
          error: `RESULT should be an Array, got ${typeof RESULT}`,
          menuslug: MENUSLUG,
          cacheObjectInfo: {
            cacheObject,
            cacheSubObject,
            cacheKey: 'all',
          },
        };
        REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
      }
    })
    .catch((ERROR) => {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || 'Error waiting for the menu from Wordpress.';
      const errorObject = {
        error: ERROR,
        menuslug: MENUSLUG,
        cacheObjectInfo: {
          cacheObject,
          cacheSubObject,
          cacheKey: 'all',
        },
      };
      REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
    });
});
// ============================================================================================= //
