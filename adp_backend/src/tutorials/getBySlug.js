/**
* [ global.adp.tutorials.getBySlug ]
* Returns the tutorials information (at the moment only Title) by slug.
* @param {String} Slug Tutorial slug for which information is requested
* @return {object} 200 - Returns a full tutorial data
* @author Omkar Sadegaonkar [zsdgmkr]
 */
module.exports = (slug, forceResolve = false) => new Promise((RESPONSE, REJECT) => {
  const packName = 'adp.tutorials.getBySlug';
  const setupObj = {
    followRedirect: false,
    followAllRedirects: false,
    encoding: null,
    url: `${adp.config.wordpress.url}tutorialPageBySlug?slug=${slug}`,
    timeout: 3000,
  };
  global.request(setupObj, (ERROR, RESP) => {
    if (ERROR) {
      const errorText = 'Error on [ global.request ] in [ getBySlug ]';
      const errorOBJ = {
        setupObj,
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      const errorResp = {
        code: '500',
        message: ERROR,
      };
      // resolve it forcefully while running addTutorialToAdditionalInfo migration script
      if (forceResolve) {
        RESPONSE(errorResp);
        return;
      }
      REJECT(errorResp);
      return;
    }
    const resposne = JSON.parse(RESP.body.toString());
    const tutObj = resposne[0] || null;
    if (tutObj && tutObj.post_title) {
      const successResp = {
        code: '200',
        title: tutObj.post_title,
      };
      RESPONSE(successResp);
      return;
    }
    const errorResp = {
      code: '400',
      message: `Tutorial not found for the slug - ${slug}`,
    };
    adp.echoLog(errorResp.message, errorResp, 400, packName, false);
    // resolve it forcefully while running addTutorialToAdditionalInfo migration script
    if (forceResolve) {
      RESPONSE(errorResp);
      return;
    }
    REJECT(errorResp);
  });
});
