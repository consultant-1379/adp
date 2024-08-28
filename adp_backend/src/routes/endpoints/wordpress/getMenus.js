// ============================================================================================= //
/**
* [ adp.endpoints.wordpress.getMenus ]
* This function got an update because RBAC x Redirect Menus:
* The code is always parsing the RBAC rules on the full menu
* and only at the end, if necessary, the code get the requested
* menu and send to the user. This is necessary because of the
* redirect feature of some links which makes necessary to check
* others menus after RBAC to get the first available option.
* @return {object} Result of the request.
* @group Wordpress
* @route GET /getMenus
* @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
*/
/**
 * @swagger
 * /wordpress/menus:
 *    get:
 *      description: This endpoint shows all the Menus.
 *      responses:
 *        '200':
 *          description: OK.Success
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '404':
 *          $ref: '#/components/responses/NotFound'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - Wordpress Menus
 */
/**
 * @swagger
 * /wordpress/menus/{Slug}:
 *    get:
 *      description: Retrieves content of Wordpress Menu by selected Slug
 *      responses:
 *        '200':
 *          description: OK.Success-Shows Wordpress Menus based on the selected Slug
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '404':
 *          $ref: '#/components/responses/NotFound'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - Wordpress Menus
 *    parameters:
 *      - name: Slug
 *        in: path
 *        description: The Wordpress Slug, used in "getMenus" (Mannually added options).
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *          enum: [ "create-a-microservice-side-menu", "footer",
 *                "highlights", "main", "tutorials", "portal-user-guide",
 *                "share-a-microservice-side-menu", "socials-menu", "test-side-menu"]
 */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
/**
 * Obtain from full menu after RBAC, the requested menu to check the first available option.
 * This private function is called by another private function: adjustSideMenu()
 * @param {Object} MENUAFTERRBAC with the full menu, after apply RBAC rules.
 * @param {String} TARGETSLUG the slug of the menu.
 * @returns an Array of objects with the essential information of allowed items of the menu.
 * @author Armando Dias [zdiaarm]
 */
const getSpecificMenuItems = (MENUAFTERRBAC, TARGETSLUG) => {
  const targetFound = [];
  MENUAFTERRBAC.menus.forEach((MENU) => {
    if (MENU.slug === TARGETSLUG) {
      MENU.items.forEach((ITEM) => {
        if (ITEM.menu_level === 0) {
          const itemObject = {
            object_id: ITEM.object_id,
            slug: ITEM.slug,
          };
          targetFound.push(itemObject);
        }
      });
    }
  });
  return targetFound;
};
// ============================================================================================= //
/**
 * Adjust the redirect links from menu items, followinf the rule:
 * If the attribute "linkedMenuSlug" exists and is a non-empty string,
 * this will contain the slug of the menu to where the attribute
 * "linkedMenuFirstPageSlug" is redirecting to. But, the destination
 * could not be available because the RBAC. So, this function checks
 * if the first item available on the menu is the same of the final
 * destination. If not, replace the "linkedMenuFirstPageSlug" with
 * the first link of the menu from "linkedMenuSlug".
 * @param {Object} MENUAFTERRBAC with the full menu, after apply RBAC rules.
 * @returns an Object with the full menu, but with the redirect links verified.
 * @author Armando Dias [zdiaarm]
 */
const adjustSideMenu = (MENUAFTERRBAC) => {
  const rootMenu = MENUAFTERRBAC;
  rootMenu.menus.forEach((MENUGROUP) => {
    MENUGROUP.items.forEach((MENU) => {
      if (MENU.linkedMenuSlug
        && typeof MENU.linkedMenuSlug === 'string'
        && (`${MENU.linkedMenuSlug}`).trim().length > 0) {
        const menu = MENU;
        const targetMenu = getSpecificMenuItems(MENUAFTERRBAC, menu.linkedMenuSlug);
        if (Array.isArray(targetMenu) && targetMenu.length > 0) {
          if (menu.linkedMenuFirstPageSlug !== targetMenu[0].slug) {
            menu.linkedMenuFirstPageSlug = targetMenu[0].slug;
          }
        }
      }
    });
  });
  return rootMenu;
};
// ============================================================================================= //
/**
 * Applies the RBAC rules on the full menu, based on logged user.
 * @param {Object} MENU with the full menu object, result from [ adp.wordpress.getMenus() ].
 * @param {Object} CONTENTPERMISSIONS The content permissions from RBAC middleware.
 * @returns the menu after RBAC rules and adjustSideMenu applied.
 * @author Armando Dias [zdiaarm]
 */
const applyRBACFilter = (MENU, CONTENTPERMISSIONS) => {
  const contentPermissions = CONTENTPERMISSIONS;
  const afterRBACMenus = {
    menus: [],
    last_modified: MENU.last_modified,
    fromCache: MENU.fromCache,
  };
  MENU.menus.forEach((MENUOBJECT) => {
    const menuObjectCloned = adp.clone(MENUOBJECT);
    menuObjectCloned.items = [];
    MENUOBJECT.items.forEach((MENUITEM) => {
      if (contentPermissions && contentPermissions.includes(MENUITEM.object_id)) {
        menuObjectCloned.items.push(MENUITEM);
      }
    });
    if (menuObjectCloned.items.length > 0) {
      afterRBACMenus.menus.push(menuObjectCloned);
    }
  });
  return adjustSideMenu(afterRBACMenus);
};
// ============================================================================================= //
/**
 * Public Function which starts the process to retrieve all the menus or one specific menu,
 * following RBAC rules and redirect links validation.
 * @param {Object} REQ Object Request
 * @param {Object} RES Object Response
 * @returns the menu object.
 * @author Armando Dias [zdiaarm]
 */
module.exports = (REQ, RES) => {
  const timer = (new Date()).getTime();
  const {
    setHeaders, Answers: { answerWith },
  } = adp;
  const res = setHeaders(RES);
  const { slug } = REQ.params;
  const { signum } = REQ.userRequest;
  const isUsingSlug = slug !== null && slug !== undefined;
  return adp.wordpress.getMenus()
    .then((MENU) => {
      const fromCache = MENU.fromCache ? 'From Cache' : 'From Wordpress';
      const allMenus = MENU;
      const isAdmin = REQ.rbac && REQ.rbac[signum] && REQ.rbac[signum].admin === true;
      let menuToSend = null;
      let foundItOnAllMenus = null;
      if (isAdmin) {
        if (isUsingSlug) {
          menuToSend = allMenus.menus.find(LOOKINGFORMENU => LOOKINGFORMENU.slug === slug);
          foundItOnAllMenus = menuToSend;
        } else {
          menuToSend = allMenus;
        }
      } else {
        const contentPermissions = REQ.rbac[signum].allowed.contents;
        menuToSend = applyRBACFilter(allMenus, contentPermissions);
        if (isUsingSlug) {
          foundItOnAllMenus = allMenus.menus.find(LOOKINGFORMENU => LOOKINGFORMENU.slug === slug);
          menuToSend = menuToSend.menus.find(LOOKINGFORMENU => LOOKINGFORMENU.slug === slug);
        }
      }
      const endTimer = (new Date()).getTime() - timer;
      if (isUsingSlug) {
        const foundOnAll = foundItOnAllMenus !== null && foundItOnAllMenus !== undefined;
        const foundOnResult = menuToSend !== null && menuToSend !== undefined;
        if (foundOnAll && foundOnResult) {
          answerWith(200, res, `${endTimer}ms`, fromCache, menuToSend);
        } else if (foundOnAll && !foundOnResult) {
          answerWith(403, res, `${endTimer}ms`, fromCache, []);
        } else {
          answerWith(404, res, `${endTimer}ms`, fromCache, []);
        }
      } else if (isAdmin) {
        const foundOnResult = menuToSend !== null && menuToSend !== undefined;
        if (foundOnResult) {
          answerWith(200, res, `${endTimer}ms`, fromCache, menuToSend);
        } else {
          answerWith(404, res, `${endTimer}ms`, fromCache, []);
        }
      } else {
        const foundOnResult = menuToSend !== null && menuToSend !== undefined;
        if (foundOnResult) {
          answerWith(200, res, `${endTimer}ms`, fromCache, menuToSend);
        } else {
          answerWith(404, res, `${endTimer}ms`, fromCache, []);
        }
      }
    })
    .catch((ERROR) => {
      const message = ERROR.message || 'Unexpected Error occurred while Getting Menus';
      const endTimer = (new Date()).getTime() - timer;
      answerWith(ERROR.code, res, `${endTimer}ms`, message);
    });
};
// ============================================================================================= //
