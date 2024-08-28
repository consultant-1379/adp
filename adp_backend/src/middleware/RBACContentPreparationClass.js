// ============================================================================================= //
/**
* [ adp.middleware.RBACContentPreparationClass ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
class MiddlewareClass {
  // ------------------------------------------------------------------------------------------ //
  constructor() {
    this.startTimer = new Date();
    this.packName = 'adp.middleware.RBACContentPreparationClass';
    this.allContent = null;
    this.req = null;
    this.res = null;
    this.next = null;
    this.reviewMenuName = 'review-items';
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------ //

  /**
   * Merges the allContentUrls with the LinkedMenu full paths
   * While keeping the items unique in value
   * @param {array} allContentUrls list of collected fullUrl paths
   * @param {array} wpLinkedMenuArr list of objects from WP containing the
   * fullUrls path aka parent_child_path
   * @returns {array} list of unique full url paths
   * @author Cein
   */
  static _mergePathArrays(allContentUrls, wpLinkedMenuArr) {
    const newAllContentUrls = allContentUrls;

    newAllContentUrls.push(...wpLinkedMenuArr.reduce(
      (updatedArr, linkPathObj) => {
        const fullPath = linkPathObj.parent_child_path.trim();
        if (fullPath) {
          updatedArr.push(fullPath);
        }
        return updatedArr;
      },
      [],
    ));

    return [...new Set(newAllContentUrls)];
  }

  /**
   * Sets the content full adp portal router paths for every page item given
   * @param {object} ITEM the menu item object to gather the router paths from
   * @param {object} MENU the menu object relating to the menu item object
   * @author Cein
   */
  _setContentUrlPaths(ITEM, MENU) {
    const key = ITEM.object_id;
    if (this.allContent[key] === undefined) {
      this.allContent[key] = {
        object_id: ITEM.object_id,
        menu_slug: MENU.slug,
        slug: ITEM.slug,
        title: ITEM.title,
        isTutorial: MENU.slug === 'tutorials',
        url: [],
      };
    }
    const urlList = this.allContent[key].url;

    if (MENU.slug === 'highlights') {
      if (`${ITEM.description}`.trim().length > 0 && !urlList.includes(ITEM.description.trim())) {
        this.allContent[key].url.push(ITEM.description);
      }
    } else if (Array.isArray(ITEM.linked_menu_paths) && ITEM.linked_menu_paths.length) {
      this.allContent[key].url = MiddlewareClass._mergePathArrays(
        this.allContent[key].url, ITEM.linked_menu_paths,
      );
    } else if (ITEM.portal_url.trim() && !urlList.includes(ITEM.portal_url.trim())) {
      this.allContent[key].url.push(ITEM.portal_url);
    }
  }

  /**
   * Load all Content IDs from [ adp.wordpress.getMenus ]
   * to be used in validation of slugs
   * @return a promise which updates the "this.allContent"
   * with values from [ adp.wordpress.getMenus ] but the
   * values are reduced to a simpler object.
   * [
   *  {
   *    object_id: ( String with the object_id ),
   *    menu_slug: ( String with slug)
   *    slug: ( String with the slug ),
   *    title: ( String with the title ),
   *    url: ( Array of strings to store values from
   *           "url" and "portal_url" )
   *  }
   * ]
   * @author Armando Dias [zdiaarm]
   */
  loadAllContentIDs() {
    const contentID = [];
    return new Promise((RES, REJ) => {
      if (this.allContent !== null) {
        RES();
      } else {
        adp.wordpress.getMenus()
          .then((MENUS) => {
            if (this.allContent === null) {
              this.allContent = {};
            }
            if (MENUS && MENUS.menus && MENUS.menus.length) {
              MENUS.menus.forEach((MENU) => {
                if (MENU && MENU.items && MENU.items.length) {
                  MENU.items.forEach((ITEM) => {
                    if (ITEM && ITEM.object_id && MENU.slug === this.reviewMenuName) {
                      contentID.push(ITEM.object_id);
                    }
                    this._setContentUrlPaths(ITEM, MENU);
                  });
                }
              });
            }
            if (!this.req) {
              this.req = {};
            }
            if (!this.req.wpcontent) {
              this.req.wpcontent = {};
            }
            this.req.wpcontent.allContent = this.allContent;
            this.req.wpcontent.previewId = contentID;
            RES(true);
          })
          .catch((ERROR) => {
            const errorText = 'Caught an error in [ adp.wordpress.getMenus ] at [ loadAllContentIDs ]';
            const errorObject = {
              origin: 'loadAllContentIDs',
              error: ERROR,
            };
            adp.echoLog(errorText, errorObject, 500, this.packName);
            REJ(errorObject);
          });
      }
    });
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------ //
  /**
   * Extract the expected three parameters from "this.req"
   * and validate the type of each one case the request is about
   * to retrieve content as "Article".
   * The try/catch is necessary case JSON.parse get an
   * invalid array as parameter.
   * @return a promise which updates the "this.req.wpcontent.payload"
   * with the values from "this.req". ( Keep in mind, the content of
   * "payload" will be send to the Wordpress ).
   * @author Armando Dias [zdiaarm]
   */
  extractParametersAsArticle() {
    return new Promise((RES, REJ) => {
      const { articleSlug, articleType, parentSlugArray } = this.req && this.req.query
        ? this.req.query : {};

      let errorMessage = '';

      if (typeof articleSlug !== 'string' || (`${articleSlug}`).trim().length === 0) {
        errorMessage = `${errorMessage} articleSlug should be a non-empty string.`;
      }

      if (typeof articleType !== 'string' || (`${articleType}`).trim().length === 0) {
        errorMessage = `${errorMessage} articleType should be a non-empty string.`;
      }

      let parentSlugArrayConverted = null;
      try {
        parentSlugArrayConverted = (`${parentSlugArray}`.trim()).length === 0
          ? null : JSON.parse(this.req.query.parentSlugArray);
      } catch (error) {
        parentSlugArrayConverted = null;
      }
      if (!Array.isArray(parentSlugArrayConverted)) {
        errorMessage = `${errorMessage} parentSlugArray should be an Array.`;
      }

      if (errorMessage !== '') {
        const errorText = '400 - Bad Request';
        const errorCode = 400;
        const errorObject = {
          error: errorMessage,
          articleSlug: `${this.req.query.articleSlug}`,
          articleType: `${this.req.query.articleType}`,
          parentSlugArray: `${this.req.query.parentSlugArray}`,
          origin: 'extractParametersAsArticle',
        };
        adp.echoLog(errorText, errorObject, errorCode, this.packName, true);
        adp.Answers.answerWith(errorCode, this.res, this.startTimer, errorText);
        const error = 'At least one of the three parameters is invalid';
        REJ(error);
      } else {
        this.req.wpcontent.payload = {};
        this.req.wpcontent.payload.articleSlug = articleSlug;
        this.req.wpcontent.payload.articleType = articleType;
        this.req.wpcontent.payload.parentSlugArray = parentSlugArrayConverted;
        this.req.wpcontent.isArticle = true;
        RES();
      }
    });
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------ //
  /**
   * Extract the expected two parameters from "this.req"
   * and validate the type of each one case the request is about
   * to retrieve content as "Tutorial".
   * The try/catch is necessary case JSON.parse get an
   * invalid array as parameter.
   * @return a promise which updates the "this.req.wpcontent.payload"
   * with the values from "this.req". ( Keep in mind, the content of
   * "payload" will be send to the Wordpress ).
   * @author Armando Dias [zdiaarm]
   */
  extractParametersAsTutorial() {
    return new Promise((RES, REJ) => {
      const { tutorialSlug, parentSlugArray } = this.req && this.req.query
        ? this.req.query : {};

      let errorMessage = '';

      if (typeof tutorialSlug !== 'string' || (`${tutorialSlug}`).trim().length === 0) {
        errorMessage = `${errorMessage} tutorialSlug should be a non-empty string.`;
      }

      let parentSlugArrayConverted = null;
      try {
        parentSlugArrayConverted = (`${parentSlugArray}`.trim()).length === 0
          ? null : JSON.parse(this.req.query.parentSlugArray);
      } catch (error) {
        parentSlugArrayConverted = null;
      }
      if (!Array.isArray(parentSlugArrayConverted)) {
        errorMessage = `${errorMessage} parentSlugArray should be an Array.`;
      }

      if (errorMessage !== '') {
        const errorText = '400 - Bad Request';
        const errorCode = 400;
        const errorObject = {
          error: errorMessage,
          tutorialSlug: `${this.req.query.tutorialSlug}`,
          parentSlugArray: `${this.req.query.parentSlugArray}`,
          origin: 'extractParametersAsTutorial',
        };
        adp.echoLog(errorText, errorObject, errorCode, this.packName, true);
        adp.Answers.answerWith(errorCode, this.res, this.startTimer, errorText);
        const error = 'At least one of the two parameters is invalid';
        REJ(error);
      } else {
        this.req.wpcontent.payload = {};
        this.req.wpcontent.payload.tutorialSlug = tutorialSlug;
        this.req.wpcontent.payload.parentSlugArray = parentSlugArrayConverted;
        this.req.wpcontent.isTutorial = true;
        RES();
      }
    });
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------ //
  /**
   * Extract the expected parameter from "this.req"
   * and validate the type case the request is about
   * to retrieve content as "Preview".
   * @return a promise which updates the "this.req.wpcontent.payload"
   * with the values from "this.req". ( Keep in mind, the content of
   * "payload" will be send to the Wordpress ).
   * @author Armando Dias [zdiaarm]
   */
  extractParametersAsPreview() {
    return new Promise((RES, REJ) => {
      const { id } = this.req && this.req.query
        ? this.req.query : {};

      let errorMessage = '';

      if (typeof id !== 'string' || (`${id}`).trim().length === 0) {
        errorMessage = `${errorMessage} id should be a non-empty string.`;
      }

      if (errorMessage !== '') {
        const errorText = '400 - Bad Request';
        const errorCode = 400;
        const errorObject = {
          error: errorMessage,
          id: `${this.req.query.id}`,
          origin: 'extractParametersAsPreview',
        };
        adp.echoLog(errorText, errorObject, errorCode, this.packName, true);
        adp.Answers.answerWith(errorCode, this.res, this.startTimer, errorText);
        const error = 'The id parameter is invalid';
        REJ(error);
      } else {
        this.req.wpcontent.payload = {};
        this.req.wpcontent.payload.id = id;
        this.req.wpcontent.isPreview = true;
        RES();
      }
    });
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------ //
  /**
   * Method which detects if the request is about
   * "Article", "Tutorial" or "Preview" and call the
   * responsible method to extract the parameters.
   * @return a promise with the value from the
   * rigth extractor method.
   * @author Armando Dias [zdiaarm]
   */
  extractParameters() {
    return new Promise((RES, REJ) => {
      const { wppath } = (this.req && this.req.params) ? this.req.params : { wppath: null };
      let errorText;
      let errorObject;
      switch (wppath) {
        case 'fetchTutorialPageValidatePath':
          this.req.wpcontent.wppath = 'fetchTutorialPageValidatePath';
          RES(this.extractParametersAsTutorial());
          break;
        case 'preview':
        case 'doc_preview':
          this.req.wpcontent.wppath = 'preview';
          RES(this.extractParametersAsPreview());
          break;
        case undefined:
        case 'fetchArticleValidatePath':
          this.req.wpcontent.wppath = 'fetchArticleValidatePath';
          RES(this.extractParametersAsArticle());
          break;
        default:
          errorText = 'Unexpected situation on switch/case at [ extractParameters ]';
          errorObject = {
            origin: 'process',
            error: errorText,
            details: 'wppath should be "fetchTutorialPageValidatePath", "preview", "doc_preview", "fetchArticleValidatePath" or undefined',
            wppath,
          };
          adp.echoLog(errorText, errorObject, 500, this.packName);
          REJ(errorObject);
          break;
      }
    });
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------ //
  /**
   * Define the target of the request to identify
   * the object_id.
   * @return a promise with the target stored in
   * "this.req.wpcontent.target" if is valid.
   * @author Armando Dias [zdiaarm]
   */
  getTargetID() {
    return new Promise((RES, REJ) => {
      let articleMode = false;
      let tutorialMode = false;
      let slugRequest = null;
      const hasPayload = this.req && this.req.wpcontent && this.req.wpcontent.payload;
      if (this.req.wpcontent.isArticle) {
        articleMode = true;
        slugRequest = hasPayload ? this.req.wpcontent.payload.articleSlug : null;
      } else if (this.req.wpcontent.isTutorial) {
        tutorialMode = true;
        slugRequest = hasPayload ? this.req.wpcontent.payload.tutorialSlug : null;
      } else if (this.req.wpcontent.isPreview) {
        this.req.wpcontent.target = {
          object_id: hasPayload ? this.req.wpcontent.payload.id : null,
          articleMode,
          tutorialMode,
          previewMode: true,
        };
        RES();
        return;
      } else {
        this.req.wpcontent.target = 'ERROR: Target is invalid';
      }
      if (this.req.wpcontent.target === null) {
        const fullRequestedPathREGEXP = new RegExp(`(\\/)${slugRequest}(\\/)?$`, 'gi');
        const { isArticle, isTutorial } = this.req.wpcontent;
        Object.keys(this.req.wpcontent.allContent).forEach((KEY) => {
          const obj = this.req.wpcontent.allContent[KEY];
          const atLeastOneMatches = obj.url.some(str => fullRequestedPathREGEXP.test(str));
          if (this.req.wpcontent.target === null
            && slugRequest !== null
            && slugRequest === obj.slug
            && (((isArticle || isTutorial) && atLeastOneMatches))) {
            this.req.wpcontent.target = {
              object_id: obj.object_id,
              articleMode,
              tutorialMode,
              previewMode: false,
            };
          }
        });
        const rbacContentPermission = [];
        this.req.user.docs[0].rbac.forEach((PERMISSION) => {
          PERMISSION.permission.forEach((PERMISSIONTYPE) => {
            if (PERMISSIONTYPE.type === 'content' && Array.isArray(PERMISSIONTYPE.static)) {
              PERMISSIONTYPE.static.forEach((IDs) => {
                if (!rbacContentPermission.includes(IDs)) {
                  rbacContentPermission.push(IDs);
                }
              });
            }
          });
        });
        if (this.req.wpcontent.target !== null) {
          RES();
        } else {
          const errorText = '404 - Not Found';
          const errorCode = 404;
          const errorObject = {
            error: `/${slugRequest}/ not found`,
            origin: 'getTargetID',
          };
          adp.echoLog(errorText, errorObject, errorCode, this.packName, true);
          adp.Answers.answerWith(errorCode, this.res, this.startTimer, errorText);
          REJ(errorObject);
        }
      } else {
        const errorText = '400 - Bad Request';
        const errorCode = 400;
        const errorObject = {
          error: 'Unexpected parameters',
          origin: 'getTargetID',
        };
        adp.echoLog(errorText, errorObject, errorCode, this.packName, true);
        adp.Answers.answerWith(errorCode, this.res, this.startTimer, errorText);
        REJ(errorObject);
      }
    });
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------ //
  /**
   * Starting function, allow this class to act as a middleware.
   * Prepares the object "this.req.wpcontent" which is updated
   * by the others methods.
   * @param {Object} REQ The Request Object.
   * @param {Object} RES The Response Object.
   * @param {Function} NEXT The Callback Function.
   * @return a promise calling the NEXT callback.
   * @author Armando Dias [zdiaarm]
   */
  process(REQ, RES, NEXT) {
    this.req = REQ;
    this.res = RES;
    this.next = NEXT;
    this.req.wpcontent = {
      wppath: null,
      target: null,
      payload: null,
      isArticle: false,
      isTutorial: false,
      isPreview: false,
      allContent: null,
    };
    return new Promise((RESOLVE, REJECT) => {
      this.loadAllContentIDs()
        .then(() => this.extractParameters())
        .then(() => this.getTargetID())
        .then(() => {
          const theID = this.req
            && this.req.wpcontent
            && this.req.wpcontent.target
            && this.req.wpcontent.target.object_id
            ? this.req.wpcontent.target.object_id
            : null;
          this.req.params = { id: theID };
          RESOLVE(this.next());
        })
        .catch((ERROR) => {
          const errorText = 'Caught an error in the promise chain at [ process ]';
          const errorObject = {
            origin: 'process',
            error: ERROR,
            reqURL: this.req.url,
            reqParam: this.req.param,
            reqQuery: this.req.query,
            wpcontentSoFar: this.req.wpcontent,
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
