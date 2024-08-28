// ============================================================================================= //
/**
* [ adp.db.start ]
* Initialize the connection and select the database
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise((RESOLVE, REJECT) => {
  const timerMSG = `[+${global.adp.timeStepNext()}]`;
  const packName = 'adp.db.start';
  adp.echoLog(`${timerMSG} Loading 'MongoDB' and connecting on Database Server...`, null, 200, packName);
  adp.mongoConnection = new adp.db.Mongo();
  adp.MongoObjectID = adp.mongoConnection.ObjectID;
  adp.mongoConnection.connect()
    .then((CONNECTION) => {
      if (CONNECTION === true) {
        adp.mongoDatabase = adp.mongoConnection.client.db('adpPortal');
        RESOLVE(true);
      } else {
        const error = 'Error on [ adp.mongoConnection.connect ]';
        const errorOBJ = { result: CONNECTION };
        adp.echoLog(error, errorOBJ, 500, packName, false);
        REJECT(CONNECTION);
      }
    })
    .catch((ERROR) => {
      const error = 'Catch an error on [ adp.mongoConnection.connect ]';
      const errorOBJ = { error: ERROR };
      adp.echoLog(error, errorOBJ, 500, packName, false);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
