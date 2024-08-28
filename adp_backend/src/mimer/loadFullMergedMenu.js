// ============================================================================================= //
/**
* [ adp.mimer.loadFullMergedMenu ]
* //
* @param {Object} ASSETOBJECT The Product ID from Mimer/Munin.
* @param {string} requestedVersion Asset Version.
* @return {Object} .
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const packName = 'adp.mimer.loadFullMergedMenu';
// ============================================================================================= //
module.exports = (ASSETOBJECT, requestedVersion) => new Promise(async (RESOLVE) => {
  const startTimer = (new Date()).getTime();
  if (!ASSETOBJECT || !ASSETOBJECT.docs || !ASSETOBJECT.docs[0] || !ASSETOBJECT.docs[0]._id) {
    RESOLVE({ docs: [] });
    return;
  }
  const asset = ASSETOBJECT.docs[0];
  const id = asset._id;

  const assetDocModel = new adp.models.AssetDocuments();
  const mergedMenu = await assetDocModel.getFullMenuByType(id, 'merged', requestedVersion);

  const menuObject = {};

  if (mergedMenu && Array.isArray(mergedMenu) && mergedMenu.length > 0) {
    mergedMenu.forEach((ITEM) => {
      if (ITEM && ITEM.docs && Object.keys(ITEM.docs).length > 0) {
        if (ITEM.docs.docs && Object.keys(ITEM.docs.docs).length > 0) {
          menuObject[ITEM.version] = ITEM.docs.docs;
        } else {
          menuObject[ITEM.version] = ITEM.docs;
        }
      }
    });
    asset.menu_merged = menuObject;
    const endTimer = (new Date()).getTime();
    adp.echoLog(`Merged menu rebuilded in ${endTimer - startTimer}ms`, null, 200, packName);
  } else {
    delete asset.mimer_menu;
    delete asset.menu_merged;
    const endTimer = (new Date()).getTime();
    adp.echoLog(`No merged menu was found in ${endTimer - startTimer}ms`, null, 200, packName);
  }

  RESOLVE(ASSETOBJECT);
});
// ============================================================================================= //
