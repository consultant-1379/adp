// ============================================================================================= //
/**
* [ adp.mimer.mimerTranslationAction ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
module.exports = (
  MSID,
  DOCUMENT,
  REVISION,
  LANGUAGE,
  VERSION,
) => new Promise((RESOLVE, REJECT) => {
  const timer = (new Date()).getTime();
  const translation = new adp.mimer.MimerTranslation();
  translation.getDocumentDetails(MSID, DOCUMENT, REVISION, LANGUAGE, VERSION)
    .then((SUCCESS) => {
      const payload = SUCCESS.document;
      payload.status = 1;
      const slug = SUCCESS
        && SUCCESS.document
        && SUCCESS.document.slug
        ? SUCCESS.document.slug
        : DOCUMENT;
      const endTimer = (new Date()).getTime();
      adp.echoLog(`Document [ ${slug} ] translated and updated in ${endTimer - timer}ms`, null, 200, 'adp.mimer.mimerTranslationAction');
      RESOLVE(SUCCESS);
    })
    .catch((ERROR) => {
      REJECT(ERROR);
    });
});
// ============================================================================================= //
