// ============================================================================================= //
/**
* [ global.adp.microservice.menuCheckIfShouldCallDocumentRefresh ]
* Check if should call the document refresh (true) or not (false).
* @param {Object} MS Microservice to be checked.
* @param {Object} OLDMSTOCOMPARE Previous microservice to compare. Can be undefined/null.
* @return True if have to call the document refresh. Otherwise, false.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (MS, OLDMSTOCOMPARE) => {
  if (MS.menu_auto !== true) {
    return false;
  }
  if (MS.repo_urls === undefined || MS.repo_urls === null) {
    return false;
  }
  if (typeof MS.repo_urls.development !== 'string') {
    return false;
  }
  if (typeof MS.repo_urls.release !== 'string') {
    return false;
  }
  const ms = MS;
  if (MS.repo_urls.development.trim().length !== MS.repo_urls.development.length) {
    ms.repo_urls.development = `${MS.repo_urls.development.trim()}`;
  }
  if (MS.repo_urls.release.trim().length !== MS.repo_urls.release.length) {
    ms.repo_urls.release = `${MS.repo_urls.release.trim()}`;
  }
  if (OLDMSTOCOMPARE !== undefined && OLDMSTOCOMPARE !== null) {
    if (OLDMSTOCOMPARE.repo_urls !== undefined && OLDMSTOCOMPARE.repo_urls !== null) {
      if (JSON.stringify(OLDMSTOCOMPARE.repo_urls) === JSON.stringify(MS.repo_urls)) {
        if (`${MS.mimer_version_starter}` === `${OLDMSTOCOMPARE.mimer_version_starter}`) {
          return false;
        }
      }
    }
  }
  return true;
};
// ============================================================================================= //
