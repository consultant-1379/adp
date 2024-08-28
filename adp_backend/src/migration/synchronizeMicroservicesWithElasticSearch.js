// ============================================================================================= //
/**
* [ adp.migration.synchronizeMicroservicesWithElasticSearch ]
* Synchronize all Microservices from MongoDB into ElasticSearch.
* Also deletes Microservices from ElasticSearch case it was deleted from MongoDB.
* @author Armando Dias [ zdiaarm ]
*/
// ============================================================================================= //
adp.docs.list.push(__filename);
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
const packName = 'adp.migration.synchronizeMicroservicesWithElasticSearch';
// ============================================================================================= //


// ============================================================================================= //
/**
 * Calls [ adp.microservice.synchronizeWithElasticSearch ] without
 * parameters to trigger the synchronization for all Microservices.
 * @returns {Promise<Boolean>} as True if successful
 * @author Armando Dias [ zdiaarm ]
 */
module.exports = () => new Promise(async (RESOLVE, REJECT) => {
  const adpModel = new adp.models.Adp();
  const jobQueue = [];
  const ids = await adpModel.indexAssetsGetOnlyIDs();
  await ids.docs.forEach((ID) => {
    const job = {
      command: 'adp.microservice.synchronizeWithElasticSearch',
      parameters: [
        ID._id,
        null,
      ],
      index: jobQueue.length,
    };
    jobQueue.push(job);
  });
  const queueObjective = `microserviceElasticSync__${(new Date()).getTime()}`;
  adp.queue.addJobs('microserviceElasticSync', 'multiple microservices', queueObjective, jobQueue)
    .then(() => {
      adp.queue.startJobs()
        .then(() => {})
        .catch(() => {});
      RESOLVE(true);
    })
    .catch((ERROR) => {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Trying to add [ adp.microservice.synchronizeWithElasticSearch ] on the queue inside of a Migration Script';
      const errorObject = {
        error: ERROR,
      };
      REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
    });
});
// ============================================================================================= //
