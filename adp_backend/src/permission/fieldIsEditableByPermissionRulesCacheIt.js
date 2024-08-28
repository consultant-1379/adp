// ============================================================================================= //
/**
* [ global.adp.permission.fieldIsEditableByPermissionRulesCacheIt ]
* @param {String} ID A simple String, with the ID of the Microservice.
* @param {JSON} MS A JSON Object with the fields has to been changed or added.
* @returns {Number} Returns a 200 if everything is ok.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise((RESOLVE) => {
  const timer = new Date();
  const packName = 'global.adp.permission.fieldIsEditableByPermissionRulesCacheIt';
  if (global.adp.permission.fieldIsEditableByPermissionRulesCache !== undefined) {
    // The Schema cannot be changed without a restart of this API,
    // so, we can cache this without time control to expire.
    const endTime = (new Date()).getTime() - timer.getTime();
    adp.echoLog(`Read Only Field List with Permission Rules obtained in ${endTime}ms`, null, 200, packName);
    RESOLVE(global.adp.permission.fieldIsEditableByPermissionRulesCache);
  } else {
    const microserviceSchema = global.adp.config.schema.microservice;
    const readOnlyFields = [];
    Object.keys(microserviceSchema.properties).forEach((FIELDNAME) => {
      const field = microserviceSchema.properties[FIELDNAME];
      Object.keys(field).forEach((PROPERTY) => {
        const value = field[PROPERTY];
        if (Array.isArray(value) && PROPERTY !== 'searchableLookupKeys') {
          const readOnlyObject = {
            field: FIELDNAME,
            readOnlyExceptionsForListOption: value,
          };
          readOnlyFields.push(readOnlyObject);
        }
      });
    });
    global.adp.permission.fieldIsEditableByPermissionRulesCache = readOnlyFields;
    const endTime = (new Date()).getTime() - timer.getTime();
    adp.echoLog(`Read Only Field List with Permission Rules generated in ${endTime}ms`, null, 200, packName);
    RESOLVE(readOnlyFields);
  }
});
// ============================================================================================= //
