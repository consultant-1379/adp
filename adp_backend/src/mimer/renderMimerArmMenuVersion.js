// ============================================================================================= //
/**
* [ adp.mimer.renderMimerArmMenuVersion ]
* Finish the Mimer Menu process.
* @param {string} MSID Microservice ID.
* @param {boolean} ALLVERSIONS To retrieve all the versions (if true).
* @return {Promise} Resolve if successful, reject if fails.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const packName = 'adp.mimer.renderMimerArmMenuVersion';
// ============================================================================================= //
module.exports = (
  MSID,
  MIMERVERSIONSTARTER,
  CURRENTVERSION,
  CURRENTSOURCE,
) => new Promise((RESOLVE, REJECT) => {
  const timer = (new Date()).getTime();
  const renderMenu = new adp.mimer.RenderMimerArm();
  renderMenu.versionDocumentPreparation(
    MSID,
    MIMERVERSIONSTARTER,
    CURRENTVERSION,
    CURRENTSOURCE,
  )
    .then(async (RESULT) => {
      RESOLVE({ result: RESULT });
      const endTimer = (new Date()).getTime();
      const adpModel = new adp.models.Adp();
      const slug = await adpModel.getAssetSlugUsingID(MSID);
      adp.echoLog(`Asset [ ${slug} :: ${CURRENTVERSION.length} versions ] total time: ${endTimer - timer}ms`, null, 200, packName);
    })
    .catch(ERROR => REJECT(ERROR));
});
// ============================================================================================= //
