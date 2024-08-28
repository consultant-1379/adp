/**
* [ global.adp.document.matchDocNameToCategory ]
* match the given document name slug to the listoptions type document-category name
* using the documents list associated to that document-category
* If the document is not matched a default category will be returned
* @param {String} docSlug the document slug name to find the a document category for
* @returns {Promise} listoption type document-category matched/default object to
* the given document name slug
* @author Cein [edaccei]
*/

global.adp.docs.list.push(__filename);
const packName = 'global.adp.document.matchDocNameToCategory';

/**
 * fetches the listoptions auto category and title document list
 * @returns {Promise} array of listoptions objects
 * @author Cein
 */
const fetchCatsDocs = () => {
  const dbModel = new adp.models.Listoption();
  return dbModel.getManyByGroupID([10, 11]);
};

/**
 * Matches the db auto document title to the give document slug,
 * If title match found the corrisponding category slug and name will be returned
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
  let defaultCateorySelectId = null;

  catDocTitleArray.forEach((catDocTitleObj) => {
    const groupId = catDocTitleObj['group-id'];
    const title = catDocTitleObj.name;
    const selectId = catDocTitleObj['select-id'];

    if (groupId === 10 && typeof selectId !== 'undefined') {
      catLookUpObj[selectId] = {
        name: title,
        slug: global.adp.slugIt(title),
      };
      if (catDocTitleObj.default) {
        defaultCateorySelectId = selectId;
      }
    } else if (groupId === 11 && typeof selectId !== 'undefined') {
      const dbDocSlug = global.adp.slugIt(title);
      if (dbDocSlug === docSlug) {
        matchedCategorySelectId = catDocTitleObj['documentation-categories-auto'];
      }
    }
  });

  if (matchedCategorySelectId !== null && typeof catLookUpObj[matchedCategorySelectId] !== 'undefined') {
    return catLookUpObj[matchedCategorySelectId];
  }
  if (defaultCateorySelectId !== null && typeof catLookUpObj[defaultCateorySelectId] !== 'undefined') {
    return catLookUpObj[defaultCateorySelectId];
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
    if (catsDocsArr.docs && catsDocsArr.docs.length > 0) {
      const matchedCatObj = matchDocTitleToCat(catsDocsArr.docs, docSlug);
      if (matchedCatObj !== null && matchedCatObj.name && matchedCatObj.name.trim() !== '') {
        resolve(matchedCatObj);
        return matchedCatObj;
      }
    }
    const errorMSG = ['Incorrect default document data'];
    adp.echoLog(errorMSG, { docSlug }, 500, packName, true);
    reject(errorMSG);
    return false;
  }).catch((docMatchError) => {
    adp.echoLog('Error in [ fetchCatsDocs ]', docMatchError, 500, packName, true);
    reject(docMatchError);
  });
});
