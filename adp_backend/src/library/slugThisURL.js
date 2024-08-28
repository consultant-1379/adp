// ============================================================================================= //
/**
* [ global.adp.slugThisURL ]
* Convert URL into slug
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (TEXT) => {
  /* eslint-disable no-useless-escape */
  let textSlug = TEXT.trim();
  if (textSlug.length > 0) {
    textSlug = textSlug.toLowerCase();
    textSlug = textSlug.replace(/\s+/g, '-'); // Replace spaces with -
    textSlug = textSlug.replace(/[^\w\-]+/g, '_'); // Remove all non-word chars
    textSlug = textSlug.replace(/\-\-+/g, '-'); // Replace multiple - with single -
    textSlug = textSlug.replace(/\_\_+/g, '_'); // Replace multiple _ with single _
    textSlug = textSlug.replace(/^-+/, ''); // Trim - from start of text
    textSlug = textSlug.replace(/-+$/, ''); // Trim - from end of text
  }
  return textSlug;
  /* eslint-enable no-useless-escape */
};
// ============================================================================================= //
