// ============================================================================================= //
/**
* [ global.adp.permission.fieldListWithPermissions ]
* Return a list with all Field names (slugs) which have Permission Rules.
* @return This functions is a <b>Promise</b>.
* Returns in the <b>Then</b> block if found something,
* or in the <b>Catch</b> block if found nothing.
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise(async (RESOLVE, REJECT) => {
  const timer = new Date();
  const packName = 'global.adp.permission.fieldListWithPermissions';
  if (global.adp.permission.fieldPermissionCache !== undefined) {
    // The Schema cannot be changed without a restart of this API,
    // so, we can cache this without time control to expire.
    const endTime = (new Date()).getTime() - timer.getTime();
    adp.echoLog(`Field List with Permission Rules obtained in ${endTime}ms`, null, 200, packName);
    RESOLVE(global.adp.permission.fieldPermissionCache);
  } else {
    const microserviceSchema = global.adp.config.schema.microservice;
    const fieldsWithPermissions = [];
    global.adp.listOptions.get()
      .then((LISTOPTIONSSTRING) => {
        const listOptions = JSON.parse(LISTOPTIONSSTRING);
        Object.keys(microserviceSchema.properties).forEach((FIELD) => {
          if (microserviceSchema.properties[FIELD].permission_rules) {
            const field = listOptions
              .filter(ITEM => ITEM.slug.toLowerCase() === FIELD.toLowerCase());
            if (Array.isArray(field)) {
              if (field.length === 1) {
                const fieldWithPermissionRules = {
                  id: field[0].id,
                  slug: FIELD.toLowerCase(),
                };
                fieldsWithPermissions.push(fieldWithPermissionRules);
              }
            }
          }
        });
        global.adp.permission.fieldPermissionCache = fieldsWithPermissions;
        const endTime = (new Date()).getTime() - timer.getTime();
        adp.echoLog(`Field List with Permission Rules generated in ${endTime}ms`, null, 200, packName);
        RESOLVE(fieldsWithPermissions);
      })
      .catch((ERROR) => {
        const errorText = 'Error in [ adp.listOptions.get ]';
        const errorOBJ = {
          error: ERROR,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
        REJECT();
      });
  }
});
// ============================================================================================= //
