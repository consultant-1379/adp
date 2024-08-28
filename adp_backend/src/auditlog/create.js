// ============================================================================================= //
/**
* [ global.adp.auditlog.create ]
* Create an entry in adpLog Database
* @param {Any} OBJ The error object. Could be undefined/null.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = OBJ => new Promise((RESOLVE, REJECT) => {
  const timer = (new Date()).getTime();
  const packName = 'global.adp.auditlog.create';
  const model = new adp.models.AdpLog();
  model.createOne(OBJ)
    .then(() => {
      RESOLVE();
    })
    .catch((ERROR) => {
      adp.echoLog(`Error on [ adp.db.create ] in ${(new Date()).getTime() - timer}ms`, ERROR, 500, packName, true);
      REJECT();
    });
});
// ============================================================================================= //
