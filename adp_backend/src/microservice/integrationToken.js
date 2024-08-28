/**
* [ global.adp.microservice.integrationToken ]
* Returns one <b>microservice integration access_token</b>.
* @param {string} userId The _id of the user, essentially the signum.
* @param {string} userRole The users role as given from the users token.
* @param {string} microserviceId The _id of the microservice to return the access_token of.
* @return {obj} the microservice integration access_token.
* @author Cein [edaccei]
*/

/* eslint-disable no-underscore-dangle */
global.adp.docs.list.push(__filename);

module.exports = (userId, userRole, microserviceId, REQ) => new Promise((RESOLVE, REJECT) => {
  const packName = 'global.adp.microservice.integrationToken';
  const returningError = { message: 'Forbidden', code: 403 };

  if (userId && userRole && microserviceId) {
    return global.adp.microservices.getByOwner(userId, userRole, 'microservice', REQ).then((usersMSListResult) => {
      const ownerDataIsSet = (
        usersMSListResult && usersMSListResult.templateJSON && usersMSListResult.templateJSON.data
      );

      if (ownerDataIsSet && usersMSListResult.templateJSON.data.length > 0) {
        const foundMS = usersMSListResult.templateJSON.data.find(
          usersMSObj => usersMSObj._id === microserviceId,
        );

        if (foundMS && foundMS.access_token && foundMS.access_token.trim() !== '') {
          RESOLVE({ access_token: foundMS.access_token });
          return true;
        }
      }
      adp.echoLog('Forbidden', { userId, userRole, microserviceId }, 403, packName);
      REJECT(returningError);
      return false;
    }).catch((errorFetchingMSList) => {
      adp.echoLog('Error in [ adp.microservices.getByOwner ]', { error: errorFetchingMSList }, 500, packName, true);
      REJECT(errorFetchingMSList);
      return false;
    });
  }
  adp.echoLog('Forbidden', { userId, userRole, microserviceId }, 403, packName);
  REJECT(returningError);
  return false;
});
