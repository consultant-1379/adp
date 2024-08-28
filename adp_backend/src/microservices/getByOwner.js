// ============================================================================================= //
/**
* [ global.adp.microservices.getByOwner ]
* Returns a list of MicroServices from DataBase, by Owner ( From Token ).
* @param {String} SIGNUM The signum of the user ( From Token ).
* @param {String} ROLE The role of the logged user ( From Token ).
* @param {Boolean} MSIDNAME Set the paramet to true to fetch Microservices Name and ID only.
* @return {JSON} Returns a list of MicroServices, returns all if "admin".
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
/**
 * [ rbacPermissionsList ]
 * List of Asset Ids allowed for the logged user.
 * @param {String} SIGNUM the user request signum
 * @param {Object} RBAC the RBAC Object
 * @return {Array} If successful returns an Array.
 * If not, returns null.
 * @author Armando Dias [zdiaarm]
 */
const rbacPermissionsList = (SIGNUM, RBAC) => {
  const isAdmin = RBAC[SIGNUM].admin;
  if (isAdmin) {
    return [];
  }
  let allowedAssetsIDs = [];
  if (RBAC[SIGNUM] && RBAC[SIGNUM].allowed && RBAC[SIGNUM].allowed.assets) {
    allowedAssetsIDs = RBAC[SIGNUM].allowed.assets;
  }
  if (allowedAssetsIDs.length > 0) {
    return allowedAssetsIDs;
  }
  return null;
};
// ============================================================================================= //
module.exports = (SIGNUM, ROLE, ASSETTYPE, REQ, MSIDNAME) => new Promise(async (RESOLVE) => {
  const assetType = (ASSETTYPE) ? ASSETTYPE.toString().split(' ') : ['microservice'];
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const dbModel = new adp.models.Adp(assetType);
  const startedAt = new Date();
  const packName = 'global.adp.microservices.getByOwner';
  const answer = new global.adp.Answers();
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  let resultOfQuery = [];
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //

  /**
   * Updates the assets list to include the integration access_token
   * @param {array} msArray list of microservices
   * @returns {array} list of assets with access_token included each.
   * @author Cein
   */
  const includeIntegrationTokens = (msArray) => {
    const updatedMsArray = [];
    msArray.forEach((msObj) => {
      const updatedObj = msObj;
      if (msObj.inval_secret && msObj.inval_secret.trim() !== '') {
        const token = global.jsonwebtoken.sign(
          {
            msid: msObj._id,
            inval_secret: msObj.inval_secret,
          }, global.adp.config.jwtIntegration.secret,
          { noTimestamp: true },
        );
        updatedObj.access_token = token;
      }
      updatedMsArray.push(updatedObj);
    });
    return updatedMsArray;
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  if (ROLE !== 'admin') {
    await global.adp.permission.fieldListWithPermissions();
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const pipelineobj = {};
  const RBACAssetsList = await rbacPermissionsList(SIGNUM, REQ.rbac, pipelineobj);
  await dbModel.allAssetsForRBAC(RBACAssetsList, ROLE, true, MSIDNAME, assetType)
    .then(async (ANSWER) => {
      resultOfQuery = ANSWER.docs;
      if (ROLE !== 'admin') {
        let isFieldAdminVariable = false;
        let filteredMS = [];
        adp.echoLog(`[${SIGNUM}, ${ROLE}] is not admin level.`, null, 200, packName);
        // ===================================================================================== //
        // STORY UPDATE - Before to check if is Service Owner, we have to check
        // if the user is Field Admin over that Field ID / Option.
        // ===================================================================================== //
        const allPromises = [];
        await global.adp.permission.checkFieldPermissionCacheIt();
        await resultOfQuery.forEach((ms) => {
          allPromises.push(global.adp.permission.isFieldAdmin(SIGNUM, ms));
        });
        await Promise.all(allPromises)
          .then((ALLRESULTS) => {
            if (Array.isArray(ALLRESULTS)) {
              filteredMS = ALLRESULTS.filter(ASSET => ASSET !== undefined);
              resultOfQuery = filteredMS;
              if (resultOfQuery.length > 0) {
                const endTime = (new Date()).getTime() - startedAt.getTime();
                adp.echoLog(`[${SIGNUM}, ${ROLE}] is Field Admin of ${resultOfQuery.length} Asset(s) in ${endTime}ms.`, null, 200, packName);
                isFieldAdminVariable = true;
              }
            }
          })
          .catch((ERROR) => {
            adp.echoLog('Error in [ Promise.all ]', ERROR, 500, packName, true);
          });
        // ===================================================================================== //
        // If not Field Admin, we have to check if user is Service Domain.
        // ===================================================================================== //
        if (!isFieldAdminVariable) {
          resultOfQuery = ANSWER.docs;
          resultOfQuery.forEach((ms) => {
            const byTeam = ms.team.filter(e => (e.signum.trim()
              .toLowerCase() === SIGNUM.trim().toLowerCase())
              && (e.serviceOwner === true));
            if (byTeam.length > 0) {
              filteredMS.push(ms);
            }
          });
          resultOfQuery = filteredMS;
          if (resultOfQuery.length > 0) {
            const endTime = (new Date()).getTime() - startedAt.getTime();
            adp.echoLog(`[${SIGNUM}, ${ROLE}] is Service Owner of ${resultOfQuery.length} Asset(s) in ${endTime}ms.`, null, 200, packName);
            isFieldAdminVariable = true;
          }
        }
        // ===================================================================================== //
      }
      if (resultOfQuery.length > 0) {
        resultOfQuery = includeIntegrationTokens(resultOfQuery);
      }
      if (resultOfQuery.length > 1) {
        resultOfQuery = resultOfQuery.sort(await global.adp.dynamicSort('name'));
      }
      if (resultOfQuery.length === 0) {
        adp.echoLog(`[${SIGNUM}, ${ROLE}] has no assigned microservices.`, null, 200, packName);
      }
    })
    .catch((ERROR) => {
      adp.echoLog('Error in [ dbModel.indexMicroservices ]', { error: ERROR }, 500, packName, true);
    });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  resultOfQuery.forEach((ASSET) => {
    const asset = ASSET;
    delete asset.team;
    delete asset.domain;
    delete asset.inval_secret;
  });
  answer.setCode(200);
  answer.setCache('Not from Cache');
  answer.setMessage('200 - Search Successful');
  answer.setTotal(resultOfQuery.length);
  answer.setData(resultOfQuery);
  answer.setSize(global.adp.getSizeInMemory(resultOfQuery));
  answer.setLimit(9999999);
  answer.setPage(1);
  const theEndTime = new Date() - startedAt;
  answer.setTime(theEndTime);
  adp.echoLog(`Finishing the search in ${theEndTime}ms.`, null, 200, packName);
  RESOLVE(answer);
});
// ============================================================================================= //
