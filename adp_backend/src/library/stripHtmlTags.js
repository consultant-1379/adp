/**
 * Removes html tags from a given block of text
 * @param {string} html the html text to strip the html tags from
 * @returns {string} the raw text without html tags
 * @author Armando, Cein
 */
module.exports = (html) => {
  let rawText = html
    .replace(new RegExp(/(<(?!\/?strong|\/?sub|\/?sup)([\s\S])+?>)/gim), '')
    .replace(new RegExp(/(\s)+/gim), ' ')
    .replace(new RegExp(/ *\[[^\]]*]/gim), ' ')
    .replace(new RegExp(/^((?!<strong|<sub|<sup)([\s\S]))*?(>)/gim), '')
    .trim();
  const lastOpenedTag = (new RegExp(/(<(?![\s\S]*>))(?!.*\1)/gim)).exec(rawText);
  if (lastOpenedTag) {
    rawText = rawText.substr(0, lastOpenedTag.index).trim();
  }
  return rawText;
};
