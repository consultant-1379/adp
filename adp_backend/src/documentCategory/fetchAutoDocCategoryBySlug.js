/**
* [ global.adp.documentCategory.fetchAutoDocCategoryBySlug ]
* fetches an autoMenu true document category obj by the given document category slug
* @param {string} categorySlug the slug of the category to match
* @returns {object|null} the matched db document category obj or null if not found
* @author Cein [edaccei]
*/
global.adp.docs.list.push(__filename);
const packName = 'global.adp.documentCategory.fetchAutoDocCategoryBySlug';

/**
 * fetches all menu Auto document categories
 * @returns {Promise} array of listoptions objects
 * @author Cein
 */
const fetchAllDocCat = () => {
  const dbModel = new adp.models.Listoption();
  return dbModel.getManyByGroupID([10]);
};

/**
 * matches the given category slug with the db list of category objects
 * @param {string} categorySlug the slug of the category to match
 * @param {array} dbCatList list of menu_auto document category objects from the db
 * @returns {object|null} the matched db document category obj or null if not found
 * @author Cein
 */
const matchCatgorySlug = (categorySlug, dbCatList) => {
  const matchedCatObj = dbCatList.find((dbCatObj) => {
    if (dbCatObj && dbCatObj.slug === categorySlug) {
      return true;
    }
    return false;
  });
  return (typeof matchedCatObj !== 'undefined' ? matchedCatObj : null);
};

/**
 * Entry method that fetches an autoMenu true document category obj by
 * the given document category slug
 * @param {string} categorySlug the slug of the category to match
 * @returns {object|null} the matched db document category obj or null if not found
 * @author Cein [edaccei]
 */
module.exports = async (categorySlug) => {
  let matchedCategoryObj = null;
  await fetchAllDocCat().then((catList) => {
    if (catList.docs && catList.docs.length > 0) {
      matchedCategoryObj = matchCatgorySlug(categorySlug, catList.docs);
    }
  }).catch((catListFetchError) => {
    adp.echoLog('Error on [ fetchAllDocCat ]', { error: catListFetchError }, 500, packName, true);
  });

  return matchedCategoryObj;
};
