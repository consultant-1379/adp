// ============================================================================================= //
/**
* [ global.adp.migration.slugItNow ]
* Check if the slug is correct.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
/* eslint-disable no-underscore-dangle                                                           */
/* eslint-disable no-param-reassign                                                              */
/* The mission of this method is rewrite the original object to update                           */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = MS => new Promise((RESOLVE) => {
  const packName = 'global.adp.migration.slugItNow';
  // ------------------------------------------------------------------------------------------- //
  // Denormalisation Values from listOptions
  // ------------------------------------------------------------------------------------------- //
  global.adp.listOptions.get()
    .then(() => {
      const listOptions = JSON.parse(global.adp.listOptions.cache.options);
      const onlyDocumentationCategoriesGroup = listOptions.filter(GROUP => GROUP.id === 7);
      const onlyDocumentationTitlesGroup = listOptions.filter(GROUP => GROUP.id === 8);
      const documentationCategories = onlyDocumentationCategoriesGroup[0].items;
      const documentationTitles = onlyDocumentationTitlesGroup[0].items;
      // --------------------------------------------------------------------------------------- //
      // Function to get the title from "denormalisation Values"
      const getTitle = (ID, CID) => {
        // id is ID as string, because sometimes the value from DB is string.
        // Just for comparison.
        const id = ID.toString();
        // cid (Category ID) is CID as string, because sometimes the value from DB is string.
        // Just for comparison.
        const cid = CID.toString();
        // Array with an applied filter
        const array = documentationTitles.filter((e) => {
          // eid (Element ID) as string, just for comparison.
          const eid = e.id.toString();
          // ecid (Element Category ID) as string, just for comparison.
          const ecid = e.documentationCategories.toString();
          // If Element ID is equal ID
          // and If Element Category ID is equal Category ID
          // should return true.
          if (eid === id && ecid === cid) {
            // Success, return true.
            return true;
          }
          // The values are not ok, return false.
          return false;
        });
        // The array should contain just one result.
        let result = null;
        if (array.length === 1) {
          // Array contains one value. Get the title.
          result = array[0].name;
        } else {
          // Array contains no values
          result = `No name found ID${ID} CID${CID}`;
        }
        // Returns the final result.
        return result;
      };
      // --------------------------------------------------------------------------------------- //
      // First Step, let's work with the slug of the Object Name
      // --------------------------------------------------------------------------------------- //
      // Variable to check if we have any change (true) or not (false)
      let foundChange = false;
      // Removing _rev from object to CouchDB be able to update the object, if necessary.
      delete MS._rev;
      // Generating the slug using the Object Name for future comparison/attribution.
      const nameSlugged = global.adp.slugIt(MS.name);
      // Checking if the Object Slug is different from the result of Slug Generator.
      if (MS.slug !== nameSlugged) {
        // Set the slug to a new value, following the generator!
        MS.slug = nameSlugged;
        // Setting variable to update values in the end.
        foundChange = true;
      }
      // --------------------------------------------------------------------------------------- //
      // Second Step, let's work with the slug of the Document(s) Name
      // --------------------------------------------------------------------------------------- //
      // Checking if documentation is an Array and if there is elements one element inside of.
      if ((Array.isArray(MS.documentation)) && (MS.documentation.length > 0)) {
        // ForEach in documentation array
        MS.documentation.forEach((DOCUMENT) => {
          // Get the Category ID, and be sure this is a number
          const categoryID = parseInt(DOCUMENT.categoryId, 10);
          // Preparing the variable to get the logical 'folder' of the document
          // This allows two documents with the same name, but in different categories
          let folder = null;
          // Checking the ID and getting the name.
          const folderObject = documentationCategories.filter(CATITEM => CATITEM.id === categoryID);
          if (Array.isArray(folderObject)) {
            if (folderObject.length > 0) {
              if (folderObject[0].name !== undefined && folderObject[0].name !== null) {
                folder = folderObject[0].name.trim().toLowerCase();
              }
            }
          }
          if (folder === null) {
            folder = 'general';
          }
          // Preparing the slug for the document...
          let documentSlug = '';
          // If the titleId is 11, should use the Document Title. If not,
          // should get the title from the Denormalisation Values.
          if (DOCUMENT.titleId === 11 || DOCUMENT.titleId === '11') {
            // Applying the document title on the Slug Generator
            documentSlug = `${folder}/${global.adp.slugIt(DOCUMENT.title)}`;
          } else {
            // Slugging the Denormalisation Value got by the getTitle,
            // and applying on Slug Generator.
            documentSlug = `${folder}/${global.adp.slugIt(getTitle(DOCUMENT.titleId, DOCUMENT.categoryId))}`;
          }
          // Checking if the current Document Slug is differente from the Slug generated...
          if (DOCUMENT.slug !== documentSlug) {
            // If yes, update it!
            DOCUMENT.slug = documentSlug;
            // Setting variable to update values in the end.
            foundChange = true;
          }
        });
      }
      // --------------------------------------------------------------------------------------- //
      // Final Step, taking decisions...
      // --------------------------------------------------------------------------------------- //
      if (!foundChange) {
        // Everything is right, no changes...
        RESOLVE(true);
      }
      // Something is different, should send the updated object...
      RESOLVE(MS);
    })
    .catch((ERROR) => {
      adp.echoLog('Error calling [ adp.listOptions.get ]', ERROR, 500, packName, true);
    });
});
// ============================================================================================= //
