// ============================================================================================= //
/**
* [ global.adp.microservice.delete ]
* (Soft) Delete a Microservice. <b>Permissions should be checked before</b>.
* @param {String} MICROSERVICEID A simple String with the MicroService ID.
* @return Returns a Server Code.
* 200 if Ok, 404 if the MicroService was not found ( or already deleted ) or 500 for other errors.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (MICROSERVICEID, USR) => new Promise((RESOLVE, REJECT) => {
  const dbModel = new adp.models.Adp();
  const timer = new Date();
  const packName = 'global.adp.microservice.delete';
  let errorCode = null;
  dbModel.getById(MICROSERVICEID)
    .then(async (expectMicroservice) => {
      if (Array.isArray(expectMicroservice.docs)) {
        if (expectMicroservice.docs[0] === null || expectMicroservice.docs[0] === undefined) {
          errorCode = 400;
          REJECT(errorCode);
        }
        const ms = expectMicroservice.docs[0];
        const { slug } = ms;
        const justChange = {
          _id: ms._id,
          _rev: ms._rev,
          deleted: true,
        };
        if (errorCode === null) {
          dbModel.update(justChange)
            .then((afterUpdate) => {
              if (afterUpdate.ok === true) {
                RESOLVE(200);
                adp.microservice.synchronizeWithElasticSearch(null, justChange._id)
                  .then(() => {
                    adp.echoLog(`[ ${slug} ] removed from ElasticSearch`, null, 200, packName, false);
                  })
                  .catch(() => {});
                global.adp.notification.sendAssetMail(USR, 'delete', ms)
                  .then(() => {
                    const endTimer = new Date();
                    adp.echoLog(`Asset "${ms.name}" deleted by "${USR.signum}" in ${endTimer.getTime() - timer.getTime()}ms`, null, 200, packName);
                  })
                  .catch((ERR) => {
                    adp.echoLog('Error in [ adp.notification.sendAssetMail ]', ERR, 500, packName, true);
                  });
                global.adp.microservice.CRUDLog(ms, {}, 'delete', USR);
              } else {
                errorCode = 500;
                adp.echoLog('Database invalid answer in [ dbModel.update ]', afterUpdate, 500, packName, true);
                REJECT(errorCode);
              }
            })
            .catch((ERROR) => {
              adp.echoLog('Error in [ dbModel.update ]', ERROR, 500, packName, true);
              errorCode = 500;
              REJECT(errorCode);
            });
        }
      } else {
        errorCode = 500;
        adp.echoLog('Database invalid answer in [ dbModel.getById ]', { answer: expectMicroservice }, 500, packName, true);
        REJECT(errorCode);
      }
    }).catch((ERROR) => {
      adp.echoLog('Error in [ dbModel.getById ]', ERROR, 500, packName, true);
      errorCode = 404;
      REJECT(errorCode);
    });
});
// ============================================================================================= //
