// ============================================================================================= //
/**
* [ global.adp.migration.checkMicroserviceSchema ]
* This migration script is used to check the microservice schema on start.
* This script change nothing. Only echo possible problems on console.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = MS => new Promise((RESOLVE) => {
  const { validateSchema } = global.adp.microservice;
  const echo = adp.echoLog;
  const packName = 'global.adp.migration.checkMicroserviceSchema';

  const ms = MS;
  const isValid = validateSchema(ms);
  if (Array.isArray(isValid)) {
    echo(`Found problems in ${ms.name}:`, { error: isValid, ms }, 500, packName, true);
  }

  RESOLVE(true);
});
// ============================================================================================= //
