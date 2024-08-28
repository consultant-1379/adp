/**
* [ global.adp.documentCategory.matchDocNameToCategory ]
* match the given document name slug to the listoptions type document-category name
* using the documents list associated to that document-category
* If the document is not matched a default category will be returned
* @param {String} docSlug the document slug name to find the a document category for
* @returns {Promise} listoption type document-category matched/default object to
* the given document name slug
* @author Cein [edaccei]
*/

global.adp.docs.list.push(__filename);
const packName = 'global.adp.documentCategory.matchDocNameToCategory';

/**
 * fetches the listoptions auto category and title document list
 * @returns {Promise} array of listoptions objects
 * @author Cein
 */
const fetchCatsDocs = () => new Promise(async (resolve, reject) => {
  const listOpts = await global.adp.listOptions.get()
    .then((listOptionsStr) => {
      const listOptsArray = JSON.parse(listOptionsStr);
      if (listOptsArray.length) {
        return listOptsArray;
      }
      const error = 'Failed to retrieve Listoptions from [ adp.listOptions.get ]';
      adp.echoLog('Error on [ adp.listOptions.get ]', error, 500, packName, true);
      return [];
    }).catch((errorFetchingListoptions) => {
      adp.echoLog('Error on [ adp.listOptions.get ]', { error: errorFetchingListoptions }, 500, packName, true);
      return [];
    });
  const findCatGroups = listOpts.filter(
    listOptsObj => (listOptsObj.id === 10 || listOptsObj.id === 11),
  );
  if (findCatGroups) {
    resolve(findCatGroups);
  } else {
    const error = 'Failed to fetch Listoption Documentation Groups';
    adp.echoLog('Error on "findCatGroups" variable', { error, findCatGroups }, 500, packName, true);
    reject(error);
  }
});

/**
 * Matches the db auto document title to the give document slug,
 * If title match found, the corresponding category slug and name will be returned
 * If no match is found the default category slug and name will be returned
 * @param {array} catDocTitleArray list of listoption items relating to
 * auto document titles and categories
 * @param {string} docSlug the slug of the document title to find the related category
 * @returns {Object|null} Obj category information, if nothing is found null will return
 * @returns {string} obj.name the category name
 * @returns {string} obj.slug the category slug
 * @author Cein
 */
const matchDocTitleToCat = (catDocTitleArray, docSlug) => {
  const catLookUpObj = {};
  let matchedCategorySelectId = null;
  let defaultCateoryId = null;

  catDocTitleArray.forEach((groupObj) => {
    const groupId = groupObj.id;

    groupObj.items.forEach((itemObj) => {
      // group 11 - doc titles & group 10 - categories
      if (groupId === 10) {
        catLookUpObj[itemObj.id] = {
          name: itemObj.name,
          slug: itemObj.slug,
        };
        if (itemObj.default) {
          defaultCateoryId = itemObj.id;
        }
      } else if (groupId === 11) {
        if (itemObj.slug === docSlug) {
          matchedCategorySelectId = itemObj.documentationCategories;
        }
      }
    });
  });

  if (matchedCategorySelectId !== null && typeof catLookUpObj[matchedCategorySelectId] !== 'undefined') {
    return catLookUpObj[matchedCategorySelectId];
  }
  if (defaultCateoryId !== null && typeof catLookUpObj[defaultCateoryId] !== 'undefined') {
    return catLookUpObj[defaultCateoryId];
  }
  return null;
};


/**
 * Entry method that matches the given document name slug to the
 * listoptions type document-category name
 * @param {string} docSlug the document slug name to find the a document category for.
 * @returns {Promise} Obj category information object
 * @returns {string} obj.name the category name
 * @returns {string} obj.slug the category slug
 * @author Cein
 */
module.exports = docSlug => new Promise((resolve, reject) => {
  fetchCatsDocs().then((catsDocsArr) => {
    if (catsDocsArr.length > 0) {
      const matchedCatObj = matchDocTitleToCat(catsDocsArr, docSlug);
      if (matchedCatObj !== null && matchedCatObj.name && matchedCatObj.name.trim() !== '') {
        resolve(matchedCatObj);
        return matchedCatObj;
      }
    }
    const errorMSG = ['Incorrect default document data'];
    adp.echoLog('Error on [ fetchCatsDocs ] return', errorMSG, 500, packName, true);
    reject(errorMSG);
    return false;
  }).catch((docMatchError) => {
    adp.echoLog('Error on [ fetchCatsDocs ]', { error: docMatchError, docSlug }, 500, packName, true);
    reject(docMatchError);
  });
});
