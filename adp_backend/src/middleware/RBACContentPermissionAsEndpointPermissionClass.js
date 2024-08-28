// ============================================================================================= //
/**
* [ adp.middleware.RBACContentPermissionAsEndpointPermissionClass ]
* Allow the Content Permission be used to allow or block the access
* to a Backend Endpoint. The URL hardcoded in adp_backend/src/routes/routes.js
* should be present in Wordpress Menus ( Regular or Portal Paths Special Menu )
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
/* eslint-disable class-methods-use-this */
// ============================================================================================= //
class MiddlewareClass {
  // ------------------------------------------------------------------------------------------ //
  constructor(PERMISSIONSLUG) {
    this.startTimer = new Date();
    this.packName = 'adp.middleware.RBACContentPermissionAsEndpointPermissionClass';
    this.permissionType = 'content';
    this.permissionSlugs = PERMISSIONSLUG;
    this.req = null;
    this.checkPermissionSlug();
  }

  // ------------------------------------------------------------------------------------------ //
  /**
   * Revises if we have slash characters and remove them.
   * @return Nothing. But this.permissionSlugs will be revised at the end.
   * @author Armando Dias [zdiaarm]
   */
  checkPermissionSlug() {
    let slugs = this.permissionSlugs;
    if (!Array.isArray(slugs)) {
      slugs = [slugs];
    }
    const revisedSlugs = [];
    slugs.forEach((EACHSLUG) => {
      let eachSlug = EACHSLUG;
      if (eachSlug.charAt(0) === '/') {
        eachSlug = eachSlug.substr(1, eachSlug.length - 1);
      }
      if (eachSlug.charAt(eachSlug.length - 1) === '/') {
        eachSlug = eachSlug.substr(0, eachSlug.length - 1);
      }
      revisedSlugs.push(eachSlug);
    });
    this.permissionSlugs = revisedSlugs;
  }

  // ------------------------------------------------------------------------------------------ //
  /**
   * Load the Wordpress menu using [ adp.wordpress.getMenus ]
   * @return A promise with the menus, after looked for permissions.
   * @author Armando Dias [zdiaarm]
   */
  loadContentFromSlug() {
    return new Promise((RES, REJ) => {
      adp.wordpress.getMenus()
        .then((MENUS) => {
          if (this.req) {
            if (!this.req.wpcontent) {
              this.req.wpcontent = {};
            }
            this.req.wpcontent.rawMenu = MENUS;
          }
          RES(this.lookingForPermission(MENUS));
        })
        .catch((ERROR) => {
          const errorText = 'Caught an error in [ adp.wordpress.getMenus ] at [ loadContentFromSlug ]';
          const errorObject = {
            origin: 'loadContentFromSlug',
            error: ERROR,
          };
          adp.echoLog(errorText, errorObject, 500, this.packName);
          REJ(errorObject);
        });
    });
  }

  // ------------------------------------------------------------------------------------------ //
  /**
   * Private Function, look for Permissions.
   * @param {Object} MENUS The full menu from wordpress.
   * @return a accessObject if successful or errorObject if fail.
   * @author Armando Dias [zdiaarm]
   */
  lookingForPermission(MENUS) {
    const objectIds = [];
    const permissions = [];
    this.permissionSlugs.forEach((SLUG) => {
      const slugRequestedREGEXP = new RegExp(`/${SLUG}(/)?$`, 'gi');
      MENUS.menus.forEach((MENU) => {
        const isHighLight = MENU.slug === 'highlights';
        MENU.items.forEach((ITEM) => {
          const byURL = ITEM.url.match(slugRequestedREGEXP) !== null;
          const byPortal = ITEM.portal_url.match(slugRequestedREGEXP) !== null;
          const byHighLight = isHighLight && ITEM.description.match(slugRequestedREGEXP) !== null;
          if (byURL || byPortal || byHighLight) {
            if (!objectIds.includes(ITEM.object_id)) {
              objectIds.push(ITEM.object_id);
              let matchBecause = 'Not detected';
              if (byURL && !byPortal && !byHighLight) {
                matchBecause = 'url';
              } else if (!byURL && byPortal && !byHighLight) {
                matchBecause = 'portal_url';
              } else if (!byURL && !byPortal && byHighLight) {
                matchBecause = 'description';
              }
              permissions.push({
                object_id: ITEM.object_id,
                slug: ITEM.slug,
                url: ITEM.url,
                portal_url: ITEM.portal_url,
                description: ITEM.description,
                matchBecause,
              });
            }
          }
        });
      });
    });

    if (permissions.length > 0) {
      const accessObject = {
        code: 200,
        slug: this.permissionSlugs,
        permissions,
        allowedIds: objectIds,
      };
      return accessObject;
    }
    const errorObject = {
      code: 404,
      slug: this.permissionSlugs,
    };
    return errorObject;
  }

  // ------------------------------------------------------------------------------------------ //
  /**
   * Checks if the user can access.
   * @param {Array} ALLOWED The values from REQ.rbac[signum].allowed.contents.
   * @param {Array} ACCESS The result from loadContentFromSlug.
   * @return boolean, if the user can or cannot access.
   * @author Armando Dias [zdiaarm]
   */
  userCanAccess(ALLOWED, ACCESS) {
    const contentPermissions = ALLOWED;
    let allowed = false;
    ACCESS.allowedIds.forEach((OBJECTID) => {
      if (!allowed) {
        if (contentPermissions.includes(OBJECTID)) {
          allowed = true;
        }
      }
    });
    return allowed;
  }

  // ------------------------------------------------------------------------------------------ //
  /**
   * Send a 403 message to the browser.
   * @param {Object} RES The Response Object.
   * @author Armando Dias [zdiaarm]
   */
  accessDenied(RES) {
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
    res.end(answer.getAnswer());
  }

  // ------------------------------------------------------------------------------------------ //
  /**
   * Send a 404 message to the browser.
   * @param {Object} RES The Response Object.
   * @author Armando Dias [zdiaarm]
   */
  notFoundInMenus(RES) {
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
    res.end(answer.getAnswer());
  }

  // ------------------------------------------------------------------------------------------ //
  /**
   * Main Function, triggers the flow.
   * If the user is admin, saves process allowing without extra validation
   * If not, load the Wordpress Menu and validate if the user has permission
   * to access the target.
   * @param {Object} REQ The Request Object.
   * @param {Object} RES The Response Object.
   * @param {Function} NEXT The Callback Function.
   * @return a promise calling the NEXT callback.
   * @author Armando Dias [zdiaarm]
   */
  process(REQ, RES, NEXT) {
    return new Promise((RESOLVE, REJECT) => {
      this.req = REQ;
      const signum = REQ.userRequest._id;
      const isAdmin = REQ.rbac[signum].admin;
      if (isAdmin) {
        RESOLVE(NEXT());
        return;
      }
      this.loadContentFromSlug()
        .then((ACCESS) => {
          if (ACCESS.code === 404) {
            RESOLVE(this.notFoundInMenus(RES));
            return;
          }
          const allowedContents = REQ.rbac[signum].allowed.contents;
          const canAccess = this.userCanAccess(allowedContents, ACCESS);
          if (canAccess) {
            RESOLVE(NEXT());
            return;
          }
          const forbiddenText = 'Access forbidden!';
          const forbiddenObject = {
            signum,
            user: REQ.userRequest,
            target: REQ.rbacTarget,
            RBAC: REQ.rbac,
            access: ACCESS,
            wpcontent: REQ.wpcontent,
          };
          adp.echoLog(forbiddenText, forbiddenObject, 403, this.packName, true);
          RESOLVE(this.accessDenied(RES));
        })
        .catch((ERROR) => {
          const errorText = 'Caught an error in [ loadContentFromSlug ] at [ process ]';
          const errorObject = {
            origin: 'process',
            permissionType: this.permissionType,
            permissionSlug: this.permissionSlugs,
            error: ERROR,
          };
          adp.echoLog(errorText, errorObject, 500, this.packName);
          REJECT(errorObject);
        });
    });
  }
  // ------------------------------------------------------------------------------------------ //
}
// ============================================================================================= //
module.exports = MiddlewareClass;
// ============================================================================================= //
