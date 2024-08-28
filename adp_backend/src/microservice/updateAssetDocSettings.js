/**
* [ global.adp.microservice.updateAssetDocSettings ]
* Updates both manual and automatic document settings for a given asset
* @param {obj} asset the asset object to update
* @returns {Promise} The updated asset object
* @author Cein [edaccei]
*/
global.adp.docs.list.push(__filename);
const packName = 'global.adp.microservice.updateAssetDocSettings';
const cacheObject = 'ALLASSETS';


/**
 * Will build the document route parameters, link path, doc mode and version slug
 * @param {string} assetSlug the slug of the ms/asset
 * @param {string} [version=''] the version of the document
 * @param {string} [categorySlug=''] the category slug for the document
 * @param {string} [pageslug=''] the document slug
 * @returns {object}   obj listing all required route information
 * @returns {string[]} obj.doc_route all parameters for the routerlink
 * @returns {string}   obj.doc_link the full url path
 * @returns {string}   obj.doc_mode the mode for the front end to open the document
 * @returns {string}   obj.version_slug the document version slug
 * @author Cein
 */
const buildRoutePathObj = (assetSlug, version = '', categorySlug = '', pageslug = '') => {
  const routePathObj = {
    doc_route: ['/marketplace', assetSlug, 'documentation'],
    doc_link: global.adp.config.siteAddress,
    doc_mode: 'api',
    version_slug: '',
  };

  if (version === 'development') {
    routePathObj.doc_route.push('development');
    routePathObj.doc_link = `${routePathObj.doc_link}/document/${assetSlug}/development`;
  } else if (version !== undefined && version.trim() !== '') {
    routePathObj.version_slug = global.adp.slugIt(version, true);
    routePathObj.doc_route.push(routePathObj.version_slug);
    routePathObj.doc_link = `${routePathObj.doc_link}/document/${assetSlug}/${routePathObj.version_slug}`;
  }

  if (categorySlug !== undefined && categorySlug.trim() !== '') {
    routePathObj.doc_route.push(categorySlug);
    routePathObj.doc_link = `${routePathObj.doc_link}/${categorySlug}`;
  }

  if (pageslug !== undefined && pageslug.trim() !== '') {
    routePathObj.doc_route.push(pageslug);
    routePathObj.doc_link = `${routePathObj.doc_link}/${pageslug}`;
  }

  return routePathObj;
};

/**
 * Retrieves a automated document category, updates its mode and
 * builds its router path and link/portal link
 * @param {string} assetSlug the slug of the ms/asset
 * @param {object} docObj the document object to update
 * @param {object} repoUrls containing the development and release repo URLs
 * @param {string} version the document release version or "development" maybe passed
 * @param {boolean} extLink if this document is an external link
 * @param {number} docIndex the index of docObj in the documents array
 * @returns {object} updated docObj with extra fields:
 * @returns docObj.doc_link {string} the full portal URL to the document or
 * the external document URL
 * @returns docObj.doc_mode {string} the mode represents the link state
 *        'newTab': Open link in new tab
 *        'download': Dowload items for link
 *        'api': Use the ADP Portal Api to open the document internally
 * @returns docObj.doc_route {array} the routerLink Array for this document
 * @returns docObj.category_name {string} the matched category name
 * @returns docObj.category_slug {string} the matched category slug
 * @author Cein
 */
const autoDocObjUpdate = (assetSlug, docObj, repoUrls, version, extLink, docIndex) => new Promise(
  (resolve, reject) => {
    const modifiedDocObj = docObj;
    const repoUrlBranch = (version === 'development' ? 'development' : 'release');
    const repoUrlsObj = repoUrls;

    return global.adp.documentCategory.matchDocNameToCategory(modifiedDocObj.slug)
      .then((categoryRespObj) => {
        const categoryName = (categoryRespObj.name ? categoryRespObj.name : '');
        const categorySlug = (categoryRespObj.slug ? categoryRespObj.slug : '');
        const pageSlug = (docObj.slug ? docObj.slug : '');
        const isRestricted = !!modifiedDocObj.restricted;

        const routePathObj = buildRoutePathObj(assetSlug, version, categorySlug, pageSlug);
        if (extLink) {
          modifiedDocObj.url = modifiedDocObj.external_link;
          modifiedDocObj.doc_route = routePathObj.doc_route;
          const urlChecked = global.adp.document.checkLink(modifiedDocObj.url);
          const isArtifactoryOrGerrit = (urlChecked.mode === 0 || urlChecked.mode === 2);
          const artifactoryDowloadable = (urlChecked.isDownload && urlChecked.mode === 2);

          if (urlChecked.ok && isArtifactoryOrGerrit && !urlChecked.isDownload) {
            modifiedDocObj.doc_link = routePathObj.doc_link;
            modifiedDocObj.doc_mode = 'api';
          } else if (artifactoryDowloadable) {
            modifiedDocObj.doc_link = routePathObj.doc_link;
            modifiedDocObj.doc_mode = 'download';
          } else {
            modifiedDocObj.doc_link = modifiedDocObj.external_link;
            modifiedDocObj.doc_mode = 'newtab';
          }
        } else {
          const repopath = repoUrlsObj[repoUrlBranch].replace(/\/$/, '');
          const filepath = docObj.filepath.replace(/^\//, '');
          modifiedDocObj.url = `${repopath}/${filepath}`;
          modifiedDocObj.doc_route = routePathObj.doc_route;
          modifiedDocObj.doc_link = routePathObj.doc_link;
          modifiedDocObj.doc_mode = routePathObj.doc_mode;
          const urlChecked = global.adp.document.checkLink(modifiedDocObj.url);
          if (urlChecked.isDownload === true) {
            modifiedDocObj.doc_mode = 'download';
          }
        }

        if (isRestricted) {
          modifiedDocObj.doc_mode = 'newtab';
          if (extLink) {
            modifiedDocObj.doc_link = modifiedDocObj.external_link;
          }
        }

        modifiedDocObj.category_name = categoryName;
        modifiedDocObj.category_slug = categorySlug;
        modifiedDocObj.titlePosition = docIndex;

        resolve({ docIndex, docObj: modifiedDocObj });
      }).catch((errorRetrievingCategory) => {
        reject(errorRetrievingCategory);
      });
  },
);

/**
 * Updates a list of document to include document routes, slug path and document categories
 * @param {string} assetSlug the slug of the ms/asset
 * @param {array} documentArray List of microservice documents to update
 * @param {boolean} menuAuto If this is a autoMenu updates or not
 * @param {object} repoUrls containing the development and release repo URLs
 * @param {string} [versionArrayIndex=0] the version index position in the release/document array
 * @param {string} [docListVersion=''] the version of the document list
 * @returns {array} document array with updated settings.
 * @author Cein
 */
const updateDocSettings = (assetSlug, documentArray, menuAuto, repoUrls, versionArrIndex = 0, version = '') => new Promise((resolve, reject) => {
  const updatedDocArr = documentArray;
  const categoryPromiseArr = [];

  if (updatedDocArr.length > 0) {
    updatedDocArr.forEach((documentObj, docIndex) => {
      const filePathIsDefined = !!documentObj.filepath;
      const extLinkIsDef = !!documentObj.external_link;

      if (filePathIsDefined || extLinkIsDef) {
        categoryPromiseArr.push(autoDocObjUpdate(
          assetSlug,
          documentObj,
          repoUrls,
          version,
          extLinkIsDef,
          docIndex,
        ));
      }
    });

    if (menuAuto && categoryPromiseArr.length > 0) {
      Promise.all(categoryPromiseArr).then((returnedDoc) => {
        if (returnedDoc) {
          if (returnedDoc.length > 0) {
            returnedDoc.forEach((returnedDocObj) => {
              updatedDocArr[returnedDocObj.docIndex] = returnedDocObj.docObj;
            });
          } else if (returnedDoc.docObj && returnedDoc.docIndex) {
            updatedDocArr[returnedDoc.docIndex] = returnedDoc.docObj;
          }
        }
        resolve({ versionArrIndex, updatedDocArr });
      }).catch((errorFetchingAllCategories) => {
        reject(errorFetchingAllCategories);
      });
    } else {
      resolve([{ versionArrIndex, updatedDocArr }]);
    }
  }
});

/**
 * Entry method that updates both manual and automatic document settings for a given asset
 * @param {string} docSlug the document slug name to find the a document category for.
 * @param {obj} asset the asset object to update
 * @returns {Promise} The updated asset object
 * @author Cein
 */
module.exports = async (assetObj) => {
  const asset = assetObj;
  const assetSlug = asset.slug;
  let repoUrls = { development: '', release: '' };
  // eslint-disable-next-line dot-notation
  const cacheObjectID = asset['_id'];

  if (asset.menu && asset.menu.auto && asset.menu.manual) {
    const autoObjKey = (asset.menu_auto ? 'auto' : 'manual');
    const autoObj = asset.menu[autoObjKey];
    if (asset.repo_urls) {
      repoUrls = asset.repo_urls;
    }

    if (autoObj.development && autoObj.development.length > 0) {
      await updateDocSettings(assetSlug, autoObj.development, true, repoUrls, 0, 'development').then((returnedDocArr) => {
        asset.menu[autoObjKey].development = returnedDocArr.updatedDocArr;
      }).catch((errorUpdatingDevDocs) => {
        adp.echoLog('Error updating development documentation category [ adp.microservice.read ]', { error: errorUpdatingDevDocs }, 500, packName, true);
        global.adp.masterCache.set(cacheObject, null, cacheObjectID, 1000, 500);
      });
    }
    if (autoObj.release && autoObj.release.length > 0) {
      const versionPromiseArr = [];
      autoObj.release.forEach((verObj, relArrIndex) => {
        if (verObj.version && verObj.documents && verObj.documents.length > 0) {
          versionPromiseArr.push(
            updateDocSettings(
              assetSlug,
              verObj.documents,
              true,
              repoUrls,
              relArrIndex,
              verObj.version,
            ),
          );
        }
      });
      if (versionPromiseArr.length > 0) {
        await Promise.all(versionPromiseArr).then((returnedDocArr) => {
          returnedDocArr.forEach((docObj) => {
            asset.menu[autoObjKey].release[docObj.versionArrIndex].documents = docObj.updatedDocArr;
          });
        }).catch((errorUpdatingReleaseDocs) => {
          adp.echoLog('Error updating release documentation categories [ adp.microservice.read ]', { error: errorUpdatingReleaseDocs }, 500, packName, true);
          global.adp.masterCache.set(cacheObject, null, cacheObjectID, 1000, 500);
        });
      }
    }
  }

  return asset;
};
