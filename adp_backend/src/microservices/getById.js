/**
* [ global.adp.microservices.getById ]
* Returns a list of MicroServices from DataBase by the given array of ms id objects.
* Currently does not denormalise results
* @param {array} msList list of microservice objecs that must contain _id of the microservice.
* @return {object} obj.msList list of fetched microservices objects
* obj.errors list of errors that might have occured during the fetching of the services.
* @author Cein-Sven Da Costa [edaccei]
*/

global.adp.docs.list.push(__filename);
const packageName = 'global.adp.microservices.getById';

/**
 * Compares the given msIdList with the fetched msList and returns msList that was not fetched.
 * @param {array} msIdList list of strings which are the microservices ids
 * @param {array} msListFromDb list of microservices returned from the adp db
 * @returns {array} of error objects containing each microservices id that was not fetched
 * @author Cein
 */
const missingServicesFromFetch = (msIdList, msListFromDb) => {
  const missingMsList = [];
  msIdList.forEach((msId) => {
    const msObj = msListFromDb.find(msDbObj => msDbObj._id === msId);
    if (!msObj) {
      const error = { message: `Microservice by Id [${msId}] was not found`, code: 404 };
      error.data = {
        msId, msIdList, msListFromDb, origin: 'missingServicesFromFetch',
      };

      missingMsList.push(error);
    }
  });
  return missingMsList;
};

module.exports = msList => new Promise((resolve, reject) => {
  if (Array.isArray(msList) && msList.length) {
    const {
      msIdList, errors: valErrors,
    } = adp.teamHistory.TeamHistoryController.getListAssetIds(msList);

    if (msIdList.length) {
      const adpModel = new global.adp.models.Adp();
      adpModel.getMsById(msIdList).then((msFetchResp) => {
        if (msFetchResp.docs) {
          const msListNotFound = missingServicesFromFetch(msIdList, msFetchResp.docs);
          resolve({ msList: msFetchResp.docs, errors: [...valErrors, ...msListNotFound] });
        } else {
          const error = { message: 'Microservices fetch response incorrect.', code: 500, data: { msFetchResp, msList, origin: 'getById' } };
          adp.echoLog(error.message, error.data, error.code, packageName);
          reject(error);
        }
      }).catch((errorMsFetch) => {
        const error = { message: 'Failure to fetch microservices.', code: 500, data: { error: errorMsFetch, msList, origin: 'getById' } };
        adp.echoLog(error.message, error.data, error.code, packageName);
        reject(error);
      });
    } else {
      const error = { message: 'Given microservice list does not contain any valid microservices objects with _id variable.', code: 400, data: { error: valErrors, msList, origin: 'getById' } };
      adp.echoLog(error.message, error.data, error.code, packageName);
      reject(error);
    }
  } else {
    const error = { message: 'Given microservice list is empty or is not type array.', code: 400, data: { msList, origin: 'getById' } };
    adp.echoLog(error.message, error.data, error.code, packageName);
    reject(error);
  }
});
