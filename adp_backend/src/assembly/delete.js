// ============================================================================================= //
/**
* [ global.adp.assembly.delete ]
* (Soft) Delete an Assembly. <b>Permissions should be checked before</b>.
* @param {String} ASSEMBLYID A simple String with the Assembly ID.
* @return Returns a Server Code.
* 200 if Ok, 404 if the Assembly was not found ( or already deleted ) or 500 for other errors.
* @author Githu Jeeva Savy [zjeegit]
*/
// ============================================================================================= //
module.exports = (ASSEMBLYID, USR) => new Promise((RESOLVE, REJECT) => {
  const dbModel = new adp.models.Adp();
  const timer = new Date();
  const packName = 'global.adp.assembly.delete';
  let errorCode = null;
  dbModel.getById(ASSEMBLYID)
    .then(async (expectAssembly) => {
      if (Array.isArray(expectAssembly.docs)) {
        if (expectAssembly.docs[0] === null || expectAssembly.docs[0] === undefined) {
          errorCode = 400;
          REJECT(errorCode);
        }
        const assembly = expectAssembly.docs[0];
        const { slug } = assembly;
        const justChange = {
          _id: assembly._id,
          _rev: assembly._rev,
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
                global.adp.notification.sendAssetMail(USR, 'delete', assembly)
                  .then(() => {
                    const endTimer = new Date();
                    adp.echoLog(`Asset "${assembly.name}" deleted by "${USR.signum}" in ${endTimer.getTime() - timer.getTime()}ms`, null, 200, packName);
                  })
                  .catch((ERR) => {
                    adp.echoLog('Error in [ adp.notification.sendAssetMail ]', ERR, 500, packName, true);
                  });
                global.adp.microservice.CRUDLog(assembly, {}, 'delete', USR);
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
        } else {
          errorCode = 500;
          adp.echoLog('Database invalid answer in [ dbModel.getById ]', { answer: expectAssembly }, 500, packName, true);
          REJECT(errorCode);
        }
      }
    }).catch((ERROR) => {
      adp.echoLog('Error in [ dbModel.getById ]', ERROR, 500, packName, true);
      errorCode = 404;
      REJECT(errorCode);
    });
});
// ============================================================================================= //
