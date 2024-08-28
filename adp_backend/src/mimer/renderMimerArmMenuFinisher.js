// ============================================================================================= //
/**
* [ adp.mimer.renderMimerArmMenuFinisher ]
* Finish the Mimer Menu Render process.
* @param {string} MSID Microservice ID.
* @param {string} MDEV Mimer Development Version.
* @return {Promise} Resolve if successful, reject if fails.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const packName = 'adp.mimer.renderMimerArmMenuFinisher';
// ============================================================================================= //
module.exports = (MSID, MDEV, OBJECTIVE) => new Promise((RESOLVE, REJECT) => {
  const timer = (new Date()).getTime();
  const renderMenu = new adp.mimer.RenderMimerArm();
  renderMenu.finshRenderProcess(MSID, MDEV)
    .then((RESULT) => {
      adp.queue.getGroupStatus(OBJECTIVE)
        .then(async (GROUPSTATUS) => {
          await adp.queue.setPayload(OBJECTIVE, { status: GROUPSTATUS, from: packName });
          const adpModel = new adp.models.Adp();
          const slug = await adpModel.getAssetSlugUsingID(MSID);
          const endTimer = (new Date()).getTime();
          const command = 'adp.mimer.assetCacheClear';
          await adp.queue.addJob('mimer', MSID, command, [MSID, slug], `${OBJECTIVE}`, 0, 0, 'MAIN');
          adp.echoLog(`Asset [ ${slug} ] menu is finished in ${endTimer - timer}ms`, null, 200, packName);
          RESOLVE({ status: 200, result: RESULT });
        })
        .catch(ERROR => REJECT(ERROR));
    })
    .catch(ERROR => REJECT(ERROR));
});
// ============================================================================================= //
