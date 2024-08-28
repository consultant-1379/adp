// ============================================================================================= //
/**
* [ global.adp.endpoints.version.get ] Display the version of the App.
* @author Armando Schiavon Dias [escharm]
*/

/**
 * @swagger
 * /version:
 *    get:
 *      description: This endpoint Display the version of the App.
 *      responses:
 *        '200':
 *          description: Ok. Successfully displayed the version from package.json.
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '404':
 *          $ref: '#/components/responses/NotFound'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - Miscellaneous
 */

// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const packName = 'global.adp.endpoints.version.get';
  let duplicateNames;
  await global.adp.microservice.duplicateUniqueFields(null, undefined, true)
    .then((E) => {
      if (E !== true) {
        if (E.namesDuplicated.length > 0) {
          duplicateNames = E.namesDuplicated;
        }
      }
    })
    .catch((ERR) => {
      const errorText = 'Error in [ adp.microservice.duplicateUniqueFields ]';
      adp.echoLog(errorText, { error: ERR }, 500, packName, true);
    });
  const regExpRemoveLastSlashSRCAndBeyond = new RegExp(/(\/src(?!.*\/src))([\s\S])*/gim);
  const sVersionPath = global.adp.path.replace(regExpRemoveLastSlashSRCAndBeyond, '/.ver/version.conf');
  let serverVersionJSON = '-';
  if (global.fs.existsSync(sVersionPath)) {
    adp.echoLog(`/version - Reading " ${sVersionPath} "`, null, 200, packName);
    serverVersionJSON = JSON.parse(global.fs.readFileSync(sVersionPath, 'utf-8'));
  } else {
    const errorText = 'File not found';
    const errorOBJ = {
      path: sVersionPath,
    };
    adp.echoLog(errorText, errorOBJ, 500, packName, true);
  }
  const res = global.adp.setHeaders(RES);
  res.statusCode = 200;
  const myJSON = {
    name: 'ADP Portal',
    description: 'BackEnd Application Server',
    version: `${global.version}`,
    serverVersionControl: serverVersionJSON.current,
  };
  if (global.adp.cpus !== undefined && global.adp.cpus !== null) {
    myJSON.cpuCount = global.adp.cpus.length;
  }
  const obj = await global.adp.getSizeStatusToEchoOnLoad();
  if (obj !== null && obj !== undefined) {
    myJSON.memory = obj.memory;
  }

  const adpLogModel = new adp.models.AdpLog();
  await adpLogModel.getLatestRestarts()
    .then((RESULT) => {
      if (RESULT && RESULT.docs && Array.isArray(RESULT.docs)) {
        const restarts = [];
        RESULT.docs.forEach((ITEM) => {
          restarts.push({
            backend: ITEM.backend_mode,
            version: ITEM.desc,
            when: ITEM.datetime,
          });
        });
        myJSON.backend_latest_10_starts = restarts;
      }
    })
    .catch(() => {});

  if (duplicateNames) {
    myJSON.duplicateMicroserviceNames = duplicateNames;
  }
  res.end(JSON.stringify(myJSON));
  adp.echoLog(`/version - ${global.version}`, null, 200, packName);
};
// ============================================================================================= //
