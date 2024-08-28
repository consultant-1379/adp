// ============================================================================================= //
/**
* [ global.adp.slugIt ]
* Convert text into slug
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
module.exports = (TEXT, allowPeriods = false) => {
  /* eslint-disable no-useless-escape */
  const regexSpecialChar = (allowPeriods ? /[^\w.\-\+]/g : /[^\w\-]+/g);

  let textSlug = `${TEXT}`.trim();
  if (textSlug.length > 0) {
    textSlug = textSlug.toLowerCase();
    textSlug = textSlug.replace(/\s+/g, '-'); // Replace spaces with -
    textSlug = textSlug.replace(regexSpecialChar, ''); // Remove all non-word chars
    textSlug = textSlug.replace(/\-\-+/g, '-'); // Replace multiple - with single -
    textSlug = textSlug.replace(/^-+/, ''); // Trim - from start of text
    textSlug = textSlug.replace(/-+$/, ''); // Trim - from end of text
  }
  return textSlug;
  /* eslint-enable no-useless-escape */
};
// ============================================================================================= //
