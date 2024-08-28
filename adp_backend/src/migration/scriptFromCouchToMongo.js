const errorLog = require('../library/errorLog');

// ============================================================================================= //
/**
* [ adp.migration.scriptFromCouchToMongo ]
* Copy from CouchDB and save it in Mongo
* @author Armando Dias [ zdiaarm ]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //

/**
 * Unsets the mongoToCouch migration and removes issues with couch data
 * Punctuation in the object keys in the adplog db
 * reserved words such as in mongo queries found in adplog db
 * @param {string} TOMONGO the collection name
 * @param {array} ORIGINALDOCS the list of documents from the couchdb database
 * @returns {array} cleaned data which will be safe to insert into Mongo
 * @author Armando, Cein
 */
const cleanCouchData = (TOMONGO, ORIGINALDOCS) => {
  if (TOMONGO === 'migrationscripts' || TOMONGO === 'adplog') {
    return ORIGINALDOCS.map((DOCOBJECT) => {
      const OBJECT = DOCOBJECT;
      if (TOMONGO === 'migrationscripts') {
        if (OBJECT.commandName === 'scriptFromCouchToMongo') {
          OBJECT.commandName = 'scriptFromCouchToMongoDISABLEDBYMIGRATION';
          OBJECT.runOnce = true;
          OBJECT.lastRun = `${new Date()}`;
        }
      } else if (TOMONGO === 'adplog') {
        // some data had punctuation in its object keys, mongo rejects this
        // this strips out all punctuation and spaces
        if (OBJECT.info && OBJECT.info.Rules) {
          Object.keys(OBJECT.info.Rules).forEach((key) => {
            const regexPunctSpaces = /[^A-Za-z0-9]/ig;
            if (typeof key === 'string' && regexPunctSpaces.test(key)) {
              let newKey = key.replace(regexPunctSpaces, '');
              if (newKey.length === 0 || typeof OBJECT.info.Rules.newKey !== 'undefined') {
                newKey += Math.random().toString(36).substr(2, 9);
              }
              OBJECT.info.Rules[newKey] = OBJECT.info.Rules[key];
              delete OBJECT.info.Rules[key];
            }
          });
        }
        // logs with queries, remove the $
        if (OBJECT.object && OBJECT.object.query) {
          let strQuery = JSON.stringify(OBJECT.object.query);
          strQuery = strQuery.replace(/\$/g, '');
          OBJECT.object.query = JSON.parse(strQuery);
        }
      }
      return OBJECT;
    });
  }
  return ORIGINALDOCS;
};


module.exports = () => new Promise((RESOLVE, REJECT) => {
  const packName = 'adp.migration.scriptFromCouchToMongo';
  const { defaultDB } = global.adp.config;
  if (defaultDB !== 'couchDB') {
    RESOLVE();
    return;
  }
  const lockFileExists = global.fs.existsSync(`${adp.path}/mongoLock/lock.json`);
  if (lockFileExists) {
    const msg = 'The [ adp.migration.scriptFromCouchToMongo ] can`t run because the mongoLock file was found!';
    const obj = {
      path: `${adp.path}/mongoLock/lock.json`,
    };
    adp.echoLog(msg, obj, 500, packName, false);
    RESOLVE();
    return;
  }
  const timer = (new Date()).getTime();
  let couchTimerStart = (new Date()).getTime();
  let mongoTimerStart = (new Date()).getTime();
  const allCouchDB = adp.config.database;
  let mongoClass;
  let mongo;
  let indexDB = -1;
  let startMongo = null;
  let nextDatabase = null;
  let getFromCouch = null;
  let putInMongo = null;
  let finishIt = null;
  let databaseQuant = 0;
  let registersQuant = 0;
  let couchMS = 0;

  /**
  * Private :: finishIt
  * Creates the MongoLock folder and finish the execution
  * @author Armando Dias [zdiaarm]
  */
  finishIt = () => {
    mongoClass.disconnect()
      .then(() => {
        mongo = null;
        mongoClass = null;
      })
      .catch(() => {}); // No reason to stop...
    const { path } = adp;
    const tempPath = `${path}/mongoLock`;
    if (!global.fs.existsSync(tempPath)) {
      global.fs.mkdirSync(tempPath);
    }
    const filePath = `${tempPath}/lock.json`;
    if (global.fs.existsSync(filePath)) {
      try {
        global.fs.unlinkSync(filePath);
        adp.echoLog(`File ${filePath} deleted`, null, 200, packName);
      } catch (error) {
        errorLog(
          error.code === 'ENOENT' ? 404 : 500,
          `Failure to unlink file: ${filePath}`,
          { error, filePath },
          'main',
          packName,
        );
      }
    }
    const thisJSON = {
      createdBy: '[ adp.migration.scriptFromCouchToMongo ]',
      started: `${adp.dateFormat(timer)}`,
      finished: `${adp.dateFormat((new Date()).getTime())}`,
      totalDatabase: databaseQuant,
      totalRegister: registersQuant,
    };
    const lockFile = global.fs.openSync(filePath, 'a');
    const objectFormatted = global.jsonFormatter.format(JSON.stringify(thisJSON), '  ');
    global.fs.appendFileSync(lockFile, objectFormatted, 'utf8');
    const msg = 'Mongo Lock File created';
    const obj = {
      path: filePath,
    };
    adp.echoLog(msg, obj, 200, packName, false);
    const endTimer = (new Date()).getTime() - timer;
    const msg2 = `Migration from Couch to Mongo finished in ${endTimer}ms`;
    adp.echoLog(msg2, null, 200, packName, false);
    adp.echoLog('Restarting...', null, 200, packName, false);
    adp.processExit();
  };

  /**
  * Private :: putInMongo
  * Save the object from CouchDB in MongoDB and
  * calls getFromCouch for the next register
  * @param {string} FROMCOUCH CouchDB database name
  * @param {string} TOMONGO MongoDB table name
  * @param {array} ORIGINALDOCS Register to save in MongoDB
  * @author Armando Dias [zdiaarm]
  */
  putInMongo = async (FROMCOUCH, TOMONGO, ORIGINALDOCS) => {
    if (Array.isArray(ORIGINALDOCS)) {
      const readCount = ORIGINALDOCS.length;
      if (readCount) {
        mongoTimerStart = (new Date()).getTime();
        const cleanData = cleanCouchData(TOMONGO, ORIGINALDOCS);
        const insertSuccess = await mongo.collection(TOMONGO).insertMany(cleanData)
          .then((insertResp) => {
            if (insertResp.result && insertResp.result.ok && insertResp.result.n === readCount) {
              registersQuant += insertResp.result.n;
              adp.echoLog(`${insertResp.result.n} documents inserted into Mongo collection [ ${TOMONGO} ] in ${(new Date()).getTime() - mongoTimerStart}ms`, null, 200, packName, false);
              return true;
            }
            const error = `Error occurred during Mongo insertion [ mongo.collection(${TOMONGO}).insertMany(OBJECT) ] at [ putInMongo ]`;
            const errorOBJ = {
              fromCouch: FROMCOUCH,
              toMongo: TOMONGO,
              insertResp,
              insertionData: cleanData,
              couchData: ORIGINALDOCS,
              couchDataLen: readCount,
            };
            adp.echoLog(error, errorOBJ, 500, packName, false);
            return false;
          }).catch((insertError) => {
            const error = `Error on Mongo insertion [ mongo.collection(${TOMONGO}).insertMany(OBJECT) ] at [ putInMongo ]`;
            const errorOBJ = {
              fromCouch: FROMCOUCH,
              toMongo: TOMONGO,
              error: insertError,
              couchData: ORIGINALDOCS,
            };
            adp.echoLog(error, errorOBJ, 500, packName, false);
            return false;
          });
        if (!insertSuccess) {
          REJECT();
          return;
        }
      } else {
        adp.echoLog(`[ ${TOMONGO} ] has nothing to insert - count[${readCount}]`, null, 200, packName, false);
      }
      nextDatabase();
    } else {
      const error = 'Error in the answer of [ adp.db.find ] at [ putInMongo ]';
      const errorOBJ = {
        fromCouch: FROMCOUCH,
        toMongo: TOMONGO,
        originalDocs: ORIGINALDOCS,
      };
      adp.echoLog(error, errorOBJ, 500, packName, false);
      REJECT();
    }
  };

  /**
  * Private :: getFromCouch
  * Retrieve one register from CouchDB and call the step to insert it
  * on MongoDB. If there is no more registers, call nextDatabase.
  * @param {string} FROMCOUCH CouchDB database name
  * @param {string} TOMONGO MongoDB table name
  * @author Armando Dias [zdiaarm]
  */
  getFromCouch = (FROMCOUCH, TOMONGO) => {
    couchMS = 0;
    const selector = {
      selector: {},
      skip: 0,
      limit: 99999999,
      execution_stats: true,
    };
    couchTimerStart = (new Date()).getTime();
    adp.db.find(FROMCOUCH, selector)
      .then((RESULT) => {
        couchMS = (new Date()).getTime() - couchTimerStart;
        if (Array.isArray(RESULT.docs)) {
          const dataCount = RESULT.docs.length;
          adp.echoLog(`${dataCount} documents were fetched from couch db [ ${TOMONGO} ] in ${couchMS}ms`, null, 200, packName, false);
          if (dataCount) {
            const docsWithoutRev = RESULT.docs.map((docObj) => {
              const updatedDocObj = docObj;
              delete updatedDocObj._rev;
              return updatedDocObj;
            });
            putInMongo(FROMCOUCH, TOMONGO, docsWithoutRev);
          } else {
            nextDatabase();
          }
        } else {
          const error = 'Error in the answer of [ adp.db.find ] at [ getFromCouch ]';
          const errorOBJ = {
            fromCouch: FROMCOUCH,
            toMongo: TOMONGO,
            answer: RESULT,
          };
          adp.echoLog(error, errorOBJ, 500, packName, false);
          REJECT();
        }
      })
      .catch((ERROR) => {
        const error = 'Error in [ adp.db.find ] at [ getFromCouch ]';
        const errorOBJ = {
          fromCouch: FROMCOUCH,
          toMongo: TOMONGO,
          error: ERROR,
        };
        adp.echoLog(error, errorOBJ, 500, packName, false);
        REJECT();
      });
  };

  /**
  * Private :: nextDatabase
  * Change the pointer (indexDB) to the next database in CouchDB,
  * creates the respective table in MongoDB and call the next step.
  * If there is no more databases, call the final step.
  * @author Armando Dias [zdiaarm]
  */
  nextDatabase = () => {
    indexDB += 1;
    if (indexDB > (allCouchDB.length - 1)) {
      finishIt();
      RESOLVE();
      return;
    }
    const fromCouch = allCouchDB[indexDB].appname;
    const toMongo = allCouchDB[indexDB].name;
    databaseQuant += 1;
    mongo.collection(`${toMongo}`).drop()
      .then(() => {
        mongo.createCollection(`${toMongo}`)
          .then(() => {
            const msg = `Collection '${toMongo}' created!`;
            adp.echoLog(msg, null, 200, packName, false);
            getFromCouch(fromCouch, toMongo);
          })
          .catch((ERROR_A1) => {
            const error = 'Error in [ mongo.createCollection(toMongo) ] inside of the [ mongo.collection(toMongo).drop() ]`s then()';
            const errorOBJ = {
              toMongo,
              error: ERROR_A1,
            };
            adp.echoLog(error, errorOBJ, 500, packName, false);
            REJECT();
          });
      })
      .catch((ERROR) => {
        if (ERROR.codeName === 'NamespaceNotFound') {
          mongo.createCollection(`${toMongo}`)
            .then(() => {
              const msg = `Collection '${toMongo}' created!`;
              adp.echoLog(msg, null, 200, packName, false);
              getFromCouch(fromCouch, toMongo);
            })
            .catch((ERROR_A2) => {
              const error = 'Error in [ mongo.createCollection(toMongo) ] inside of the [ mongo.collection(toMongo).drop() ]`s catch()';
              const errorOBJ = {
                toMongo,
                error: ERROR_A2,
              };
              adp.echoLog(error, errorOBJ, 500, packName, false);
              REJECT();
            });
        } else {
          const error = 'Error in [ mongo.collection(toMongo).drop() ]';
          const errorOBJ = {
            toMongo,
            error: ERROR,
          };
          adp.echoLog(error, errorOBJ, 500, packName, false);
          REJECT();
        }
      });
  };

  /**
  * Private :: startMongo
  * Trigger synchronously the proccess, starting the class Mongo,
  * connect to "adpPortal" database and call next step.
  * @author Armando Dias [zdiaarm]
  */
  startMongo = () => {
    mongoClass = new adp.db.Mongo();
    mongoClass.connect()
      .then(() => {
        mongo = mongoClass.client.db('adpPortal');
        nextDatabase();
      })
      .catch((ERROR) => {
        const error = 'Error in [ mongoClass.connect ]';
        const errorOBJ = {
          error: ERROR,
        };
        adp.echoLog(error, errorOBJ, 500, packName, false);
        REJECT();
      });
  };


  startMongo();
});
// ============================================================================================= //
