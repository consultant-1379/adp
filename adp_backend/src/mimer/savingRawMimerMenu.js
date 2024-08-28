// ============================================================================================= //
/**
* [ adp.mimer.savingRawMimerMenu ]
* Finish the Mimer Menu process.
* @param {string} MSID Microservice ID.
* @param {boolean} ALLVERSIONS To retrieve all the versions (if true).
* @return {Promise} Resolve if successful, reject if fails.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
const packName = 'adp.mimer.savingRawMimerMenu';
// ============================================================================================= //
module.exports = (
  MSID,
  ALLVERSIONS,
) => new Promise((RESOLVE, REJECT) => {
  const timer = (new Date()).getTime();
  const adpModel = new adp.models.Adp();
  adpModel.getOneById(MSID)
    .then((RESULT) => {
      const ms = RESULT && RESULT.docs && RESULT.docs[0] ? RESULT.docs[0] : null;
      if (ALLVERSIONS === true || ALLVERSIONS === 'true') {
        if (ms && ms.mimer_menu_in_progress) {
          ms.mimer_menu = adp.clone(ms.mimer_menu_in_progress);
          ms.mimer_menu_in_progress = null;
        } else {
          ms.mimer_menu = {};
        }
      } else {
        if (ms && !ms.mimer_menu) {
          ms.mimer_menu = {};
        }
        if (ms && !ms.mimer_menu_in_progress) {
          ms.mimer_menu_in_progress = {};
        }
        Object.keys(ms.mimer_menu_in_progress).forEach((VERSION) => {
          ms.mimer_menu[VERSION] = adp.clone(ms.mimer_menu_in_progress[VERSION]);
        });
        ms.mimer_menu_in_progress = null;
      }
      adpModel.update(ms)
        .then(() => {
          const endTimer = (new Date()).getTime();
          adp.echoLog(`Microservice [ ${ms.slug} ] mimer menu finished in ${endTimer - timer}ms`, null, 200, packName);
          RESOLVE({ savingRawMimerMenu: true });
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ adpModel.update @ adp.models.Adp() ]';
          const errorObject = { error: ERROR };
          const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'main', packName);
          REJECT(errorLogObject);
        });
    })
    .catch((ERROR) => {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ adpModel.getOneById(MSID) @ adp.models.Adp() ]';
      const errorObject = { error: ERROR };
      const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'main', packName);
      REJECT(errorLogObject);
    });
});
// ============================================================================================= //
