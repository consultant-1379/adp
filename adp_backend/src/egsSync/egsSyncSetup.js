// ============================================================================================= //
/**
* [ adp.egsSync.egsSyncSetup ]
* Load the egsSync parameters from database.
* @return {Promise} Resolve with a object if successful,
*         fails if something wrong happens.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
const rbacConstant = require('./../library/utils/constants').RBAC;
// ============================================================================================= //
const packName = 'adp.egsSync.egsSyncSetup';
// ============================================================================================= //
module.exports = () => new Promise((RESOLVE, REJECT) => {
// ============================================================================================= //
  let returnFromPreview;


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  // PRIVATE FUNCTION TO IDENTIFY WP MENU ITEMS
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const detectWPMenuItem = (TYPES, MENUARRAY, CONTENT) => {
    const result = [];
    const resultIDPass = [];
    const wpnames = [];
    if (TYPES.includes('article')) {
      wpnames.push('page');
    }
    if (TYPES.includes('tutorial')) {
      wpnames.push('tutorials');
    }
    CONTENT.forEach((CONTENTID) => {
      MENUARRAY.forEach((MENUGROUP) => {
        const menuItem = MENUGROUP.items.find(ITEM => `${ITEM.object_id}` === `${CONTENTID}`);
        if (menuItem) {
          if (wpnames.includes(menuItem.object)) {
            let typeName;
            if (menuItem.object === 'page') {
              typeName = 'article';
            }
            if (menuItem.object === 'tutorials') {
              typeName = 'tutorial';
            }
            const newItem = {
              id: `${CONTENTID}`,
              type: `${typeName}`,
              slug: `${menuItem.slug}`,
              url: `${adp.config.baseSiteAddress}${menuItem.portal_url}`,
            };
            if (!resultIDPass.includes(`${CONTENTID}`)) {
              resultIDPass.push(`${CONTENTID}`);
              result.push(newItem);
            }
          }
        }
      });
    });
    return result;
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  // PRIVATE FUNCTION TO GET RBAC PREVIEW
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const getPreview = TYPES => new Promise(async (RESOLVEPREVIEW, REJECTPREVIEW) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const myNextCallBack = async (THEREQ) => {
      const valueChecker = THEREQ
      && THEREQ.rbac
      && THEREQ.rbac.preview
      && THEREQ.rbac.preview[rbacConstant.DEFAULT_GROUPID]
      && THEREQ.rbac.preview[rbacConstant.DEFAULT_GROUPID].permission
        ? THEREQ.rbac.preview[rbacConstant.DEFAULT_GROUPID].permission
        : null;
      if (valueChecker) {
        const wpMenus = await adp.wordpress.getMenus();
        const menuArray = wpMenus.menus;
        const result = {};
        if (TYPES.includes('article') || TYPES.includes('tutorial')) {
          result.content = [];
          result.contentProcess = [];
          valueChecker.contents.forEach((PERMISSIONGROUP) => {
            result.contentProcess = result.contentProcess.concat(PERMISSIONGROUP.allowedAssetIDs);
          });
          result.content = detectWPMenuItem(TYPES, menuArray, result.contentProcess);
          delete result.contentProcess;
        }
        if (TYPES.includes('microservice') || TYPES.includes('assembly')) {
          result.assets = [];
          valueChecker.assets.forEach((PERMISSIONGROUP) => {
            result.assets = result.assets.concat(PERMISSIONGROUP.allowedAssetIDs);
          });
        }
        RESOLVEPREVIEW(result);
        returnFromPreview = result;
        return;
      }
      const errorCode = 500;
      const errorMessage = 'Internal Server Error';
      const errorObject = {
        error: 'Wrong valueChecker',
        object: THEREQ.rbac.preview,
      };
      REJECTPREVIEW(errorLog(errorCode, errorMessage, errorObject, 'getPreview', packName));
      returnFromPreview = undefined;
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    // RBAC ACCESS
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    try {
      const RES = {};
      const previewRequestObject = {
        body: {
          source: rbacConstant.DEFAULT_GROUPID,
          target: '',
          preview: true,
        },
      };
      const {
        sourceUser, sourceGroup, target, preview, track,
      } = await adp.rbac.previewRequest(previewRequestObject);
      const previewREQ = {
        userRequest: sourceUser,
        users: null,
        rbacGroup: sourceGroup,
        rbacTarget: target,
      };
      const rbac = new adp.middleware.RBACClass(preview, track);
      await rbac.processRBAC(previewREQ, RES, myNextCallBack);
    } catch (ERROR) {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
      const errorObject = {
        error: ERROR,
      };
      REJECT(errorLog(errorCode, errorMessage, errorObject, 'getPreview', packName));
    }
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  // CODE IN ACTION
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const adpSetup = new adp.models.AdpSetup();
  adpSetup.getSetupByName('egsSync')
    .then(async (RESULT) => {
      if (RESULT && Array.isArray(RESULT.docs) && RESULT.docs.length === 1) {
        const egsObject = RESULT.docs[0];
        if (egsObject.setup_name === 'egsSync') {
          const { parameters } = egsObject;
          if (parameters && parameters.egsSyncActive) {
            await getPreview(parameters.egsSyncActiveTypes);
            parameters.rbacAccessPermissions = returnFromPreview;
            RESOLVE(parameters);
            return;
          }
          if (parameters && !parameters.egsSyncActive) {
            RESOLVE({ egsSyncActive: false });
            return;
          }
        }
      }
      const errorCode = 500;
      const errorMessage = 'Internal Server Error';
      const errorObject = {
        error: 'Database Error',
        class: 'adp.models.AdpSetup',
        method: 'getSetupByName',
        parameter: 'egsSync',
        result: RESULT,
      };
      REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
    })
    .catch((ERROR) => {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Database Error';
      const errorObject = {
        class: 'adp.models.AdpSetup',
        method: 'getSetupByName',
        parameter: 'egsSync',
        error: ERROR,
      };
      REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
    });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
