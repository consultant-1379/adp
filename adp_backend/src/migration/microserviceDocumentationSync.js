const errorLog = require('../library/errorLog');

/**
* [ global.adp.migration.microserviceDocumentationSync ]
* runs the migration to fetch all microservice IDs
* @author Githu Jeeva Savy [zjeegit], Armando Dias [zdiaarm]
*/

const packName = 'adp.migration.microserviceDocumentationSync';
module.exports = () => new Promise(async (RESOLVE, REJECT) => {
  try {
    const adpModel = new adp.models.Adp();
    const ids = await adpModel.indexAssetsGetOnlyIDsAndSlugs();
    const idsSimpleArray = ids.docs.map(ITEM => ITEM._id);
    const queueObjective = `multipleMicroservices__${(new Date()).getTime()}`;
    const priorityForDocSync = 1;
    await adp.queue.addJob(
      'microserviceDocumentsElasticSync',
      'multiplesMicroservices',
      'adp.microservice.synchronizeDocumentsWithElasticSearch.add',
      [idsSimpleArray, null, null, queueObjective, 'ALL', 'syncIntegration', 'microserviceDocumentsElasticSync', 'microservice'],
      queueObjective,
      0,
      priorityForDocSync,
    );
    await adp.queue.startJobs();
    RESOLVE(true);
  } catch (ERROR) {
    const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
    const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
    const errorObject = {
      error: ERROR,
    };
    REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
  }
});
