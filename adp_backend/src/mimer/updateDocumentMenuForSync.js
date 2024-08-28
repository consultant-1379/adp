// ============================================================================================= //
/**
* [ adp.mimer.updateDocumentMenuForSync ]
* Add the updateDocumentMenu to the queue.
* @param {Boolean} ALLVERSIONS Default false.
                               If true update all version if false update new versions only
* @return {Promise} Resolve if successful, reject if fails.
* @author Tirth [zpiptir]
*/
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
module.exports = (ALLVERSIONS = false) => new Promise((RESOLVE, REJECT) => {
  const adpModel = new adp.models.Adp();
  adpModel.getAllWithMimerVersionStarter()
    .then((RESULT) => {
      const jobQueue = [];
      const check = RESULT && Array.isArray(RESULT.docs) && RESULT.docs.length > 0;
      const queueObjective = `mimerDocumentSync__${(new Date()).getTime()}`;
      // These comments can be added when queueObject require to me MS Slug
      // instead of mimer Document Sync in the master queue collection
      // let queueObjective;
      if (check) {
        let index = 0;
        RESULT.docs.forEach((MS) => {
          // queueObjective = `${MS.slug}__${(new Date()).getTime()}`;
          const checkAutoMenuStatus = MS
          && MS.menu_auto
            ? MS.menu_auto === true
            : false;

          const checkMimerProductNumber = MS
          && MS.product_number
            ? MS.product_number.trim().length > 0
            : false;

          const checkMimerMinimalVersion = MS
            && MS.mimer_version_starter
            ? MS.mimer_version_starter.trim().length > 0
            : false;

          if (MS.mimer_version_starter && checkAutoMenuStatus
            && checkMimerProductNumber && checkMimerMinimalVersion) {
            const productNumber = (`${MS.product_number}`).trim().split(' ').join('');
            const job = {
              command: 'adp.mimer.getProduct',
              target: MS._id,
              parameters: [productNumber, ALLVERSIONS, MS._id, queueObjective, null],
              index,
            };
            index += 1;
            jobQueue.push(job);
          }
        });
      }
      if (jobQueue.length > 0) {
        adp.queue.addJobs('mimerDocumentSync',
          'multiple microservices',
          queueObjective,
          jobQueue)
          .then((QUEUERESULT) => {
            RESOLVE(QUEUERESULT);
          })
          .catch((ERROR) => {
            const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [  adp.queue.addJobs ]';
            const errorObject = { error: ERROR };
            const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'main', 'adp.mimer.updateDocumentMenuForSync');
            REJECT(errorLogObject);
          });
      } else {
        RESOLVE('No Microservice found');
      }
    })
    .catch((ERROR) => {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ adpModel.getAllWithMimerVersionStarter() @ adp.models.Adp ]';
      const errorObject = { error: ERROR };
      const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'main', 'adp.mimer.updateDocumentMenuForSync');
      REJECT(errorLogObject);
    });
});
