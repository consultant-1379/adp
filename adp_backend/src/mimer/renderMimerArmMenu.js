// ============================================================================================= //
/**
* [ adp.mimer.renderMimerArmMenu ]
* Finish the Mimer Menu process.
* @param {string} MSID Microservice ID.
* @param {boolean} ALLVERSIONS To retrieve all the versions (if true).
* @return {Promise} Resolve if successful, reject if fails.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const packName = 'adp.mimer.renderMimerArmMenu';
// ============================================================================================= //
module.exports = (
  MSID,
  ALLVERSIONS,
  QUEUEOBJECTIVE,
) => new Promise((RESOLVE, REJECT) => {
  const timer = (new Date()).getTime();
  const renderMenu = new adp.mimer.RenderMimerArm();
  renderMenu.mainQueuePreparation(MSID, QUEUEOBJECTIVE)
    .then((RESULT) => {
      RESOLVE({ statusCode: 200, result: RESULT });
      const endTimer = (new Date()).getTime();
      adp.echoLog(`Render Menu Queue ready in ${endTimer - timer}ms`, null, 200, packName, false);
    })
    .catch(ERROR => REJECT(ERROR));
});
// ============================================================================================= //
