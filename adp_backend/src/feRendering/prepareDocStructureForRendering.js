/**
   *This function is used to build the document menu for each version
   * @param {Array} unstructuredArray Array of Documents for specific version
   * @param {Object} listOptionGroupSlug Slug for document categories and titles in listoptions
   * @returns {Object} Object of document menu
   * @author Omkar
   */
async function buildDocumentMenu(unstructuredArray, listOptionGroupSlug) {
  const respObject = {};
  let docsForACategory;
  let titlesForACategory;
  let documentForSpecificTitleAndCat;
  let sortedDocsForACategory = [];
  const listOptions = JSON.parse(global.adp.listOptions.cache.options);
  const listOptionDocCatAuto = listOptions.find(
    listOption => listOption.slug === listOptionGroupSlug.catSlug,
  );
  const listOptionDocTitleAuto = listOptions.find(
    listOption => listOption.slug === listOptionGroupSlug.titleSlug,
  );

  if (listOptionDocCatAuto && listOptionDocCatAuto.items) {
    listOptionDocCatAuto.items = listOptionDocCatAuto.items.sort(global.adp.dynamicSort('order'));
    let exceptionCategory = listOptionDocCatAuto.items.find(catObj => catObj.default);
    exceptionCategory = exceptionCategory ? exceptionCategory.slug : '';

    listOptionDocCatAuto.items.forEach((docCat) => {
      docsForACategory = unstructuredArray.filter(
        docObj => docObj.category_slug === docCat.slug,
      );

      if (docsForACategory.length) {
        if (docCat.slug === exceptionCategory) {
          respObject[docCat.slug] = docsForACategory;
        } else if (listOptionDocTitleAuto && listOptionDocTitleAuto.items) {
          titlesForACategory = listOptionDocTitleAuto.items.filter(
            title => title.documentationCategories === docCat.id,
          );
          titlesForACategory = titlesForACategory.sort(global.adp.dynamicSort('order'));
          titlesForACategory.forEach((docTitle) => {
            documentForSpecificTitleAndCat = docsForACategory.find(
              doc => doc.slug === docTitle.slug,
            );
            if (documentForSpecificTitleAndCat) {
              sortedDocsForACategory.push(documentForSpecificTitleAndCat);
              documentForSpecificTitleAndCat = null;
            }
          });
          respObject[docCat.slug] = sortedDocsForACategory;
          sortedDocsForACategory = [];
        }
      }
      docsForACategory = null;
    });
  }
  return respObject;
}

/**
 *This function is used to prepare documents for rendering on FE
 * @param {Object} MSOBJ Microservice object under process
 * @returns {Object} Microservice object with ready to render documents structure
 * @author Omkar
 */
async function prepareDocStructureForRendering(MSOBJ) {
  const msObj = MSOBJ;
  const menuAutoObjKey = (MSOBJ.menu_auto ? 'auto' : 'manual');
  const structuredDocObject = {};
  let listOptionGroupSlug = {};

  listOptionGroupSlug = {
    catSlug: 'documentation-categories-auto',
    titleSlug: 'documentation-titles-auto',
  };

  if (msObj.menu && msObj.menu[menuAutoObjKey]) {
    const docObjUnderProcess = msObj.menu[menuAutoObjKey];
    if (docObjUnderProcess.development && docObjUnderProcess.development.length) {
      structuredDocObject.development = await
      buildDocumentMenu(docObjUnderProcess.development, listOptionGroupSlug);
    }
    if (Array.isArray(docObjUnderProcess.release) && docObjUnderProcess.release.length) {
      const structuredDocsResult = [];
      docObjUnderProcess.release.forEach(async (docObjRelease) => {
        if (docObjRelease.version) {
          const sluggedVersion = global.adp.slugIt(docObjRelease.version, true);
          structuredDocObject[sluggedVersion] = await
          buildDocumentMenu(docObjRelease.documents, listOptionGroupSlug);

          const menuItem = structuredDocObject[sluggedVersion];
          menuItem.versionLabel = docObjRelease.version;
          menuItem.isCpiUpdated = docObjRelease.is_cpi_updated;
          structuredDocsResult.push(
            menuItem,
          );
        }
      });
      await Promise.all(structuredDocsResult);
    }
  }
  msObj.documentsForRendering = structuredDocObject;
  return msObj;
}

module.exports = {
  prepareDocStructureForRendering,
};
