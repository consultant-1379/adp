// ============================================================================================= //
/**
* [ global.adp.notification.buildMailSchema ]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const JsonDereferrer = require('@apidevtools/json-schema-ref-parser');

const sortSchemaItems = (schemaOrigin) => {
  const schema = [];
  Object.keys(schemaOrigin.properties).forEach((KEY) => {
    const object = schemaOrigin.properties[KEY];
    if (object.mail_order !== undefined && object.mail_order !== null) {
      object.field_name = `${KEY}`;
      if (object.items && object.items.properties) {
        const originalItems = global.adp.clone(object.items.properties);
        const schemaItem = [];
        Object.keys(originalItems).forEach((ITEMKEY) => {
          const objectItem = originalItems[ITEMKEY];
          if (objectItem.mail_order !== undefined && objectItem.mail_order !== null) {
            objectItem.field_name = `${ITEMKEY}`;
            schemaItem.push(objectItem);
          }
        });
        const sortSchemaItem = schemaItem.sort(global.adp.dynamicSort('mail_order'));
        object.items = sortSchemaItem;
      } else if (object.properties) {
        const originalProperties = global.adp.clone(object.properties);
        const schemaItem = [];
        Object.keys(originalProperties).forEach((ITEMKEY) => {
          const objectItem = originalProperties[ITEMKEY];
          if (objectItem.mail_order) {
            objectItem.field_name = `${ITEMKEY}`;
            if (objectItem.properties) {
              const secondLevelPropertiesSorted = sortSchemaItems(objectItem);
              objectItem.properties = secondLevelPropertiesSorted;
            } else if (objectItem.items) {
              const secondLevelPropertiesSorted = sortSchemaItems(objectItem);
              objectItem.items = secondLevelPropertiesSorted;
            }
            schemaItem.push(objectItem);
          }
        });
        const sortSchemaItem = schemaItem.sort(global.adp.dynamicSort('mail_order'));
        object.properties = sortSchemaItem;
      }
      schema.push(object);
    }
  });
  return schema;
};

module.exports = MAILOBJECT => new Promise(async (RESOLVE) => {
  const timer = (new Date()).getTime();
  const packName = 'global.adp.notification.buildMailSchema';
  if (MAILOBJECT.type && MAILOBJECT.type === 'assembly') {
    const mergedAssemblyBaseSchema = new adp.assets.BuildAssetSchemaClass(false);
    const assemblySchema = mergedAssemblyBaseSchema.buildSchema().assetSchema;

    let schemaOrigin = global.adp.clone(assemblySchema);
    schemaOrigin = await JsonDereferrer.dereference(schemaOrigin);
    const sortedSchema = sortSchemaItems(schemaOrigin).sort(global.adp.dynamicSort('mail_order'));
    // eslint-disable-next-line no-param-reassign
    MAILOBJECT.mailSchema = sortedSchema;
    adp.echoLog(`Mail Schema builded in ${(new Date()).getTime() - timer}ms`, null, 200, packName);
    RESOLVE(MAILOBJECT);
  }
  let schemaOrigin = global.adp.clone(global.adp.config.schema.microservice);
  schemaOrigin = await JsonDereferrer.dereference(schemaOrigin);
  const sortedSchema = sortSchemaItems(schemaOrigin).sort(global.adp.dynamicSort('mail_order'));
  // eslint-disable-next-line no-param-reassign
  MAILOBJECT.mailSchema = sortedSchema;
  adp.echoLog(`Mail Schema builded in ${(new Date()).getTime() - timer}ms`, null, 200, packName);
  RESOLVE(MAILOBJECT);
});
// ============================================================================================= //
