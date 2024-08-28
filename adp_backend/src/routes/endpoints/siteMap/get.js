/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
// ============================================================================================= //
/**
* [ global.adp.endpoints.sitemap.get ] Provides the content of site map based on rbac rules.
* @author Tirth [zpiptir]
*/

/**
 * @swagger
 * /sitemap:
 *    get:
 *      description: This endpoint provides the content of site map based on RBAC rules.
 *      responses:
 *        '200':
 *          description: Ok. Successfully displayed the version from package.json.
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '404':
 *          $ref: '#/components/responses/NotFound'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - Site Map
 */

// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
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

// Returns true if category have any child assosiated with it.
const checkEmptyCategory = (CATEGORYCHILD) => {
  if (CATEGORYCHILD.object === 'category') {
    if (CATEGORYCHILD.children.length !== 0) {
      return checkEmptyCategory(CATEGORYCHILD.children[0]);
    }
  } else {
    return true;
  }
};

const siteMapMenuPreparation = (ADJUSTSIDEMENU) => {
  const toDelete = [];
  const menusToChange = ADJUSTSIDEMENU.menus;
  let siteMapMenu = [];
  let siteMap = [];
  const IDs = [];
  const mapParentsObj = {};
  let reducedIndex = 0;

  menusToChange.forEach((MENUOBJECT) => {
    MENUOBJECT.items.forEach((MENUITEM) => {
      IDs.push(MENUITEM.ID);
      if ((IDs.includes(parseInt(MENUITEM.menu_item_parent, 10)) || MENUITEM.menu_level === 0) && (MENUITEM.object !== 'tutorials') && !MENUITEM.title.includes('Tutorials')) {
        const menuItemTemplate = {
          name: MENUOBJECT.name,
          mainMenuSlug: MENUOBJECT.slug,
          ID: MENUITEM.ID,
          menu_item_parent: MENUITEM.menu_item_parent,
          object_id: MENUITEM.object_id,
          url: MENUITEM.url,
          title: MENUITEM.title,
          object: MENUITEM.object,
          slug: MENUITEM.slug,
          parent_slug: MENUITEM.parent_slug,
          portal_url: MENUITEM.portal_url,
          target: MENUITEM.target,
          menu_level: MENUITEM.menu_level,
          linkedMenuFirstPageSlug: MENUITEM.linkedMenuFirstPageSlug,
          linked_menu_paths: MENUITEM.linked_menu_paths,
          children: [],
        };
        if (MENUITEM.menu_item_parent === '0' || mapParentsObj[parseInt(MENUITEM.menu_item_parent, 10)] !== undefined) {
          mapParentsObj[MENUITEM.ID] = reducedIndex;
          reducedIndex += 1;
        }
        if (menuItemTemplate.object === 'page') {
          if (menuItemTemplate.linked_menu_paths.length !== 0) {
            menuItemTemplate.siteMapURL = menuItemTemplate.linked_menu_paths[0].parent_child_path;
          } else {
            menuItemTemplate.siteMapURL = menuItemTemplate.portal_url;
          }
        }
        siteMapMenu.push(menuItemTemplate);
      } else {
        IDs.pop(MENUITEM.ID);
      }
    });
  });

  // Parent-Child relation for sidemenu
  siteMapMenu.forEach((PARENTITEM) => {
    siteMapMenu.forEach((CHILDITEM) => {
      if (CHILDITEM.linked_menu_paths.length !== 0 && PARENTITEM.linked_menu_paths !== 0
        && PARENTITEM.ID === parseInt(CHILDITEM.menu_item_parent, 10)) {
        PARENTITEM.children.push(CHILDITEM);
        toDelete.push(CHILDITEM.ID);
      }
    });
  });

  siteMapMenu.forEach((MENU) => {
    if (!toDelete.includes(MENU.ID)) {
      siteMap.push(MENU);
    }
  });

  siteMapMenu = siteMap;
  siteMap = [];

  // Parent-Child for LinkedMenu
  siteMapMenu.forEach((LINKEDMENU) => {
    if (LINKEDMENU.linked_menu_paths.length > 0) {
      LINKEDMENU.linked_menu_paths.forEach((LINKEDPATH) => {
        siteMapMenu.forEach((SIDEMENU) => {
          if (SIDEMENU.portal_url === LINKEDPATH.parent_path) {
            SIDEMENU.children.push(LINKEDMENU);
            toDelete.push(LINKEDMENU.ID);
          }
        });
      });
    }
  });

  siteMapMenu.forEach((MENU) => {
    if (!toDelete.includes(MENU.ID)) {
      siteMap.push(MENU);
    }
  });

  siteMapMenu = siteMap;
  siteMap = [];

  // Simple Parent-Child
  siteMapMenu.forEach((PARENT) => {
    siteMapMenu.forEach((CHILD) => {
      if (PARENT.ID === parseInt(CHILD.menu_item_parent, 10)) {
        PARENT.children.push(CHILD);
        toDelete.push(CHILD.ID);
      }
    });
  });

  siteMapMenu.forEach((MENU) => {
    if (!toDelete.includes(MENU.ID)) {
      siteMap.push(MENU);
    }
  });

  siteMapMenu = siteMap;
  siteMap = [];

  siteMapMenu.forEach((SITEMENU) => {
    if (SITEMENU.object === 'category') {
      if (SITEMENU.children.length === 0) {
        toDelete.push(SITEMENU.ID);
      } else if (!checkEmptyCategory(SITEMENU)) {
        toDelete.push(SITEMENU.ID);
      }
    }
  });

  siteMapMenu.forEach((MENU) => {
    if (!toDelete.includes(MENU.ID)) {
      siteMap.push(MENU);
    }
  });

  return siteMap;
};

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
  return siteMapMenuPreparation(rootMenu);
};

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
module.exports = (REQ, RES) => {
  const timer = (new Date()).getTime();
  const {
    setHeaders, Answers: { answerWith },
  } = adp;
  const res = setHeaders(RES);
  const { signum } = REQ.userRequest;
  return adp.wordpress.getMenus()
    .then((MENU) => {
      const fromCache = MENU.fromCache ? 'From Cache' : 'From Wordpress';
      let menuToSend = null;
      const allMenus = MENU;
      const isAdmin = REQ.rbac && REQ.rbac[signum] && REQ.rbac[signum].admin === true;
      if (isAdmin) {
        menuToSend = siteMapMenuPreparation(allMenus);
      } else {
        const contentPermissions = REQ.rbac[signum].allowed.contents;
        menuToSend = applyRBACFilter(allMenus, contentPermissions);
      }
      const endTimer = (new Date()).getTime() - timer;
      if (isAdmin) {
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
      const code = ERROR.code || 500;
      const endTimer = (new Date()).getTime() - timer;
      answerWith(code, res, `${endTimer}ms`, message);
    });
};
