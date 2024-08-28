// ============================================================================================= //
const packName = 'adp.restore';
// ============================================================================================= //
const createCollection = DBNAME => new Promise((RESOLVE, REJECT) => {
  adp.mongoDatabase.createCollection(DBNAME)
    .then(() => {
      RESOLVE();
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ adp.mongoDatabase.createCollection() ]';
      const errorOBJ = {
        collection: DBNAME,
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
const dropCollection = DBNAME => new Promise((RESOLVE, REJECT) => {
  adp.mongoDatabase.collection(DBNAME).drop()
    .then((DROPRESULT) => {
      if (DROPRESULT === true) {
        createCollection(DBNAME)
          .then(() => {
            RESOLVE();
          })
          .catch((ERRORONCREATE) => {
            const errorText = 'Error in [ createCollection ] at [ dropCollection ]';
            const errorOBJ = {
              collection: DBNAME,
              error: ERRORONCREATE,
            };
            adp.echoLog(errorText, errorOBJ, 500, packName, true);
            REJECT(ERRORONCREATE);
          });
      } else {
        const errorText = 'Error in [ adp.mongoDatabase.collection().drop() ] at [ dropCollection ]';
        const pError = `Expected true as result, got "${DROPRESULT}" instead.`;
        const errorOBJ = {
          collection: DBNAME,
          error: pError,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
        REJECT(pError);
      }
    })
    .catch((ERROR) => {
      if (ERROR.codeName === 'NamespaceNotFound') {
        // If collection doesn't exists, ignore
        // the error and try to create it!
        createCollection(DBNAME)
          .then(() => {
            RESOLVE();
          })
          .catch((ERRORONCREATE) => {
            const errorText = 'Error in [ createCollection ] at [ dropCollection ](catch)';
            const errorOBJ = {
              collection: DBNAME,
              error: ERRORONCREATE,
            };
            adp.echoLog(errorText, errorOBJ, 500, packName, true);
            REJECT(ERRORONCREATE);
          });
      } else {
        const errorText = 'Error in [ adp.mongoDatabase.collection().drop() ] at [ dropCollection ]';
        const errorOBJ = {
          collection: DBNAME,
          error: ERROR,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
        REJECT(ERROR);
      }
    });
});
// ============================================================================================= //
const recreateDatabase = DBNAME => new Promise((RESOLVE, REJECT) => {
  dropCollection(DBNAME)
    .then(() => RESOLVE())
    .catch(ERROR => REJECT(ERROR));
});
// ============================================================================================= //
const insertExtraAsset = () => new Promise((RESOLVE, REJECT) => {
  const tempPath = `${__dirname}/templateDataBase/adpExtra.js`;
  if (!(global.fs.existsSync(tempPath))) {
    REJECT();
    return;
  }
  // eslint-disable-next-line import/no-dynamic-require
  const extraAsset = require(tempPath);
  const extraAssetObject = extraAsset()[0];
  adp.db.create('adp', extraAssetObject)
    .then(() => {
      adp.actionCounter.registers += 1;
      adp.echoDivider();
      adp.echoLog(' ', null, 300, packName);
      adp.echoLog(`Extra Huge Asset [ ${extraAssetObject.slug} ] added on adp collection,`, null, 300, packName);
      adp.echoLog('because the "extra" parameter in command line [ npm run testDataGenerator extra ].', null, 300, packName);
      adp.echoLog(' ', null, 300, packName);
      adp.echoDivider();
      RESOLVE();
    })
    .catch((ERROR) => {
      const errorText = 'Catch an error on [ adp.db.create ] at [ insertExtraAsset ]';
      const errorObject = {
        error: ERROR,
        item: extraAssetObject,
      };
      adp.echoLog(errorText, errorObject, 500, packName, false);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
module.exports = (QUANTMS, QUANTUSER) => new Promise((RESOLVE, REJECT) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  let lastDB = '';
  let softDeletedMicroservices = 0;
  const deletedAssetArray = [];
  const dynamicObject = adp.dynamicData();
  const recreateIt = DB => new Promise((RESOLVETHIS, REJECTTHIS) => {
    let startTime = new Date();
    const randRange = (MIN, MAX) => {
      const min = Math.ceil(MIN);
      const max = Math.floor(MAX);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const tempPathArray = __dirname.split('/');
    let path = `${tempPathArray.splice(0, tempPathArray.length - 2).join('/')}`;
    const checkFolder = (ADDFOLDER) => {
      path = `${path}/${ADDFOLDER}`;
      if (!(global.fs.existsSync(path))) {
        global.fs.mkdirSync(path, 0o744);
      }
    };
    const ms = [];
    const msSlug = [];
    const usr = [];
    const usrSignum = [];
    const filePath = `${__dirname}/templateDataBase/${DB.collection}.js`;
    const fileExists = global.fs.existsSync(filePath);
    const collectionName = DB.collection;
    return recreateDatabase(collectionName)
      .then(() => {
        if (!fileExists) {
          const msg = `File "${collectionName}.js" not found. Cannot restore "${collectionName}". This collection is empty.`;
          const msgObject = {
            error: 'File not found',
            filePath,
          };
          adp.echoLog(msg, msgObject, 404, packName);
          RESOLVETHIS();
          return false;
        }
        adp.echoLog(`File "${collectionName}.js" found! Starting to restore "${collectionName}"...`, null, 200, packName);
        // eslint-disable-next-line import/no-dynamic-require
        const dataCommand = require(filePath);
        const dataArray = dataCommand(dynamicObject);
        let quant = 0;
        // ///////////////////////////////////////////////////////////////////////////////////// //
        let canUseProcessUpdate = false;
        const withoutProcessHelper = [];
        let dateStart;
        let dateEnd;
        let msAcummulated = 0;
        if (process !== undefined && process !== null) {
          if (process.stdout !== undefined && process.stdout !== null) {
            const haveClearLine = process.stdout.clearLine !== undefined
              && process.stdout.clearLine !== null;
            const haveCursorTo = process.stdout.cursorTo !== undefined
              && process.stdout.cursorTo !== null;
            const haveWrite = process.stdout.write !== undefined
              && process.stdout.write !== null;
            if (haveClearLine && haveCursorTo && haveWrite) {
              canUseProcessUpdate = true;
            }
          }
        }
        const updateProgressLine = (STR, PERCENTAGE) => {
          if (canUseProcessUpdate === true) {
            process.stdout.clearLine();
            process.stdout.cursorTo(47);
            process.stdout.write(`${STR}${PERCENTAGE}%`);
          } else {
            let newPercentage = -1;
            if (dateStart === undefined) {
              dateStart = new Date();
            }
            for (let searchMultiplier = 0; searchMultiplier <= 100; searchMultiplier += 10) {
              if (parseInt(PERCENTAGE, 10) === searchMultiplier
                && !(withoutProcessHelper.includes(searchMultiplier))) {
                newPercentage = searchMultiplier;
                withoutProcessHelper.push(searchMultiplier);
              }
            }
            if (newPercentage !== -1) {
              dateEnd = new Date();
              const stepMS = dateEnd.getTime() - dateStart.getTime();
              msAcummulated += stepMS;
              adp.echoLog(`${(' ').repeat(18)}${STR}${newPercentage}% in ${stepMS}ms ( Total Database time ${msAcummulated}ms )`);
              dateStart = new Date();
            }
          }
        };
        const endOfProgressLine = () => {
          if (canUseProcessUpdate === true) {
            process.stdout.write('\n');
          }
        };
        // ///////////////////////////////////////////////////////////////////////////////////// //
        const objToSave = [];
        dataArray.forEach((ITEM) => {
          objToSave.push({
            dbMongo: DB.collection,
            item: ITEM,
          });
          if (ITEM.type === 'microservice' && DB.collection === 'adp') {
            const cITEM = JSON.parse(JSON.stringify(ITEM));
            delete cITEM._id;
            ms.push(cITEM);
            if (cITEM.deleted === undefined) {
              msSlug.push(`${cITEM.slug}`);
            } else {
              softDeletedMicroservices += 1;
              deletedAssetArray.push(`${cITEM.slug}`);
            }
          } else if (ITEM.type === 'user' && DB.collection === 'adp') {
            usr.push(ITEM);
            usrSignum.push(ITEM.signum);
          }
          quant += 1;
        });
        // ///////////////////////////////////////////////////////////////////////////////////// //
        if (ms.length > 0) {
          let extrasMS = QUANTMS - ms.length;
          if (extrasMS > 0) {
            for (let extraIndex = 0; extraIndex < extrasMS; extraIndex += 1) {
              const random = randRange(0, ms.length - 1);
              const extraElement = adp.clone(ms[random]);
              delete extraElement._id;
              extraElement.name = `Auto Generated ${extraIndex + 1}`;
              extraElement.slug = `auto-generated-${extraIndex + 1}`;
              delete extraElement.deleted;
              objToSave.push({
                dbMongo: DB.collection,
                item: extraElement,
              });
              if (extraElement.deleted === undefined) {
                msSlug.push(`${extraElement.slug}`);
              } else {
                deletedAssetArray.push(`${extraElement.slug}`);
                softDeletedMicroservices += 1;
                extrasMS += 1;
              }
            }
          }
        }
        // ///////////////////////////////////////////////////////////////////////////////////// //
        if (usr.length > 0) {
          const extrasUSR = QUANTUSER - usr.length;
          if (extrasUSR > 0) {
            for (let extraIndex = 0; extraIndex < extrasUSR; extraIndex += 1) {
              const random = randRange(0, usr.length - 1);
              const extraElement = adp.clone(usr[random]);
              extraElement._id = `euser${extraIndex + 1}`;
              extraElement.signum = `euser${extraIndex + 1}`;
              objToSave.push({
                dbMongo: DB.collection,
                item: extraElement,
              });
              usrSignum.push(extraElement.signum);
            }
          }
        }
        // ///////////////////////////////////////////////////////////////////////////////////// //
        const finishIt = () => {
          const clearSlugArray = [];
          if (msSlug.length > 0) {
            msSlug.forEach((ITEM) => {
              if (!deletedAssetArray.includes(ITEM)) {
                clearSlugArray.push(ITEM);
              }
            });
            checkFolder('tools');
            checkFolder('performanceFeeders');
            path = `${path}/microservices-slugs.csv`;
            if (global.fs.existsSync(path)) {
              global.fs.unlinkSync(path);
            }
            const fd = global.fs.openSync(path, 'a');
            global.fs.appendFileSync(fd, `${clearSlugArray.join('\r\n')}`, 'utf8');
          }
          const plusMS = (QUANTMS - ms.length);
          const plusUSR = (QUANTUSER - usr.length);
          const endTime = (new Date()).getTime() - startTime.getTime();
          if (clearSlugArray.length >= 0 && DB.collection === 'adp' && (plusMS > 0 || plusUSR > 0)) {
            let counters = '';
            if (plusMS > 0) {
              counters = `${counters} ${plusMS} extra Asset(s)`;
            }
            if (plusUSR > 0) {
              if (counters.length > 0) {
                if (softDeletedMicroservices > 0) {
                  counters = `${counters},`;
                } else {
                  counters = `${counters} and`;
                }
              }
              counters = `${counters} ${plusUSR} extra User(s)`;
            }
            if (softDeletedMicroservices > 0) {
              counters = `${counters} and ${softDeletedMicroservices} Soft-Deleted Asset(s)`;
            }
            const txt = `The "${collectionName}" was successfully restored in ${endTime}ms with ${quant} registers!`;
            adp.echoLog(txt, null, 200, packName);
            if (counters.length > 0) {
              adp.echoLog(`(${counters} )`, null, 200, packName);
            }
          } else {
            adp.echoLog(`The "${collectionName}" was successfully restored in ${endTime}ms with ${quant} registers!`, null, 200, packName);
          }
          if (adp.insertExtra && collectionName === 'adp') {
            insertExtraAsset()
              .then(() => {
                RESOLVETHIS(true);
                return true;
              })
              .catch((ERROR) => {
                const errorText = 'Catch an error on [ insertExtra ]';
                const errorObject = {
                  collection: collectionName,
                  error: ERROR,
                };
                adp.echoLog(errorText, errorObject, 500, packName, false);
                REJECTTHIS(ERROR);
                return false;
              });
          } else {
            RESOLVETHIS(true);
            return true;
          }
          return true;
        };
        // ///////////////////////////////////////////////////////////////////////////////////// //
        let index = -1;
        const saveIt = () => {
          index += 1;
          if (index < objToSave.length) {
            const obj = objToSave[index];
            const name = obj.dbMongo;
            if (name === 'adp') {
              const id = obj
                && obj.item
                && obj.item._id
                ? obj.item._id
                : new adp.MongoObjectID();
              return adp.db.create(name, { _id: id })
                .then(() => {
                  lastDB = name;
                  if (obj && obj.item && !obj.item._id) {
                    obj.item._id = id;
                  }
                  return adp.db.update(name, obj.item)
                    .then(() => {
                      adp.actionCounter.registers += 1;
                      updateProgressLine(`Working on [ ${lastDB} ] :: `, ((index * 100) / objToSave.length).toFixed(2));
                      return saveIt();
                    })
                    .catch((ERROR) => {
                      const errorText = 'Catch an error on [ adp.db.update for adp collection ] at [ recreateIt ]';
                      const errorObject = {
                        error: ERROR,
                        collection: collectionName,
                        name,
                        item: obj.item,
                      };
                      adp.echoLog(errorText, errorObject, 500, packName, false);
                      REJECTTHIS(ERROR);
                      return false;
                    });
                })
                .catch((ERROR) => {
                  const errorText = 'Catch an error on [ adp.db.create for adp collection ] at [ recreateIt ]';
                  const errorObject = {
                    name,
                    item: obj.item,
                    error: ERROR,
                  };
                  adp.echoLog(errorText, errorObject, 500, packName, false);
                  REJECTTHIS(ERROR);
                  return false;
                });
            }
            return adp.db.create(name, obj.item)
              .then(() => {
                lastDB = name;
                adp.actionCounter.registers += 1;
                updateProgressLine(`Working on [ ${lastDB} ] :: `, ((index * 100) / objToSave.length).toFixed(2));
                return saveIt();
              })
              .catch((ERROR) => {
                const errorText = 'Catch an error on [ adp.db.create ] at [ recreateIt ]';
                const errorObject = {
                  name,
                  item: obj.item,
                  error: ERROR,
                };
                adp.echoLog(errorText, errorObject, 500, packName, false);
                REJECTTHIS(ERROR);
                return false;
              });
          }
          updateProgressLine(`Working on [ ${lastDB} ] :: `, 100.00);
          endOfProgressLine();
          return finishIt();
        };
        startTime = new Date();
        return saveIt();
      })
      .catch((ERROR) => {
        const errorText = 'Catch an error on [ recreateDatabase() ] at [ recreateIt ]';
        const errorObject = {
          collectionName,
          error: ERROR,
        };
        adp.echoLog(errorText, errorObject, 500, packName, false);
        REJECTTHIS(ERROR);
      });
    // ///////////////////////////////////////////////////////////////////////////////////////// //
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  let localIndex = -1;
  const dbs = adp.config.database;
  const runDB = () => {
    localIndex += 1;
    if (localIndex < dbs.length) {
      adp.actionCounter.collections += 1;
      recreateIt(dbs[localIndex])
        .then(() => runDB())
        .catch((ERROR) => {
          const errorText = 'Error in [ recreateIt ]';
          const errorOBJ = {
            param: dbs[localIndex],
            error: ERROR,
          };
          adp.echoLog(errorText, errorOBJ, 500, packName, true);
          REJECT(ERROR);
        });
    } else {
      RESOLVE('DONE!');
    }
  };
  runDB();
});
// ============================================================================================= //
