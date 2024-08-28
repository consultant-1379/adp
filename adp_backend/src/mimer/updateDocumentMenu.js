// ============================================================================================= //
/**
* [ adp.mimer.updateDocumentMenu ]
* Add the updateDocumentMenu to the queue.
* @param {String} MSIDORSLUG Microservice ID or Slug.
* @return {Promise} Resolve if successful, reject if fails.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
module.exports = (
  MSIDORSLUG,
  ALLVERSIONS = false,
  SPECIFICVERSION = null,
  QUEUEOBJECTIVE = '',
) => new Promise((RESOLVE, REJECT) => {
  const adpModel = new adp.models.Adp();
  adpModel.getAssetByIDorSLUG(MSIDORSLUG)
    .then((RESULT) => {
      const check = RESULT && Array.isArray(RESULT.docs) && RESULT.docs.length > 0;
      const checkAutoMenuStatus = RESULT
        && RESULT.docs
        && RESULT.docs[0]
        ? RESULT.docs[0].menu_auto === true
        : false;
      const checkMimerProductNumber = RESULT
        && RESULT.docs
        && RESULT.docs[0]
        && RESULT.docs[0].product_number
        ? RESULT.docs[0].product_number.trim().length > 0
        : false;
      const checkMimerMinimalVersion = RESULT
        && RESULT.docs
        && RESULT.docs[0]
        && RESULT.docs[0].mimer_version_starter
        ? RESULT.docs[0].mimer_version_starter.trim().length > 0
        : false;

      if (check && checkAutoMenuStatus && checkMimerProductNumber && checkMimerMinimalVersion) {
        const productNumber = (`${RESULT.docs[0].product_number}`).split(' ').join('');
        const theMSID = RESULT.docs[0]._id;
        const theSlug = RESULT.docs[0].slug;
        let objective;
        if (QUEUEOBJECTIVE !== '') {
          objective = QUEUEOBJECTIVE;
        } else {
          objective = `${theSlug}__${(new Date()).getTime()}`;
        }
        adp.queue.addJob(
          'mimerDocumentUpdate',
          theMSID,
          'adp.mimer.getProduct',
          [productNumber, ALLVERSIONS, theMSID, objective, SPECIFICVERSION],
          objective,
          0,
        )
          .then((QUEUERESULT) => {
            RESOLVE(QUEUERESULT);
          })
          .catch((ERROR) => {
            const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [  adp.queue.addJob ]';
            const errorObject = { error: ERROR };
            const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'main', 'adp.mimer.updateDocumentMenu');
            REJECT(errorLogObject);
          });
      } else if (check && !checkMimerProductNumber) {
        const obj = {
          code: 400,
          message: `The microservice [ ${MSIDORSLUG} ] does not have a Mimer Product Number.`,
        };
        RESOLVE(obj);
      } else if (check && !checkMimerMinimalVersion) {
        const obj = {
          code: 400,
          message: `The microservice [ ${MSIDORSLUG} ] does not have the Mimer Minimal Version.`,
        };
        RESOLVE(obj);
      } else if (check && !checkAutoMenuStatus) {
        const obj = {
          code: 400,
          message: `The microservice [ ${MSIDORSLUG} ] cannot be setted as manual documentation mode.`,
        };
        RESOLVE(obj);
      } else {
        const obj = {
          code: 404,
          message: `The microservice [ ${MSIDORSLUG} ] was not found.`,
        };
        RESOLVE(obj);
      }
    })
    .catch((ERROR) => {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ adpModel.getAssetByIDorSLUG(MSIDORSLUG) @ adp.models.Adp ]';
      const errorObject = { error: ERROR };
      const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'main', 'adp.mimer.updateDocumentMenu');
      REJECT(errorLogObject);
    });
});
// ============================================================================================= //
