const { MongoClient, ObjectID } = require('mongodb');

/**
* [ global.adp.db.Mongo ]
* MongoDB client connection class
* @author Cein-Sven Da Costa [edaccei]
*/
global.adp.docs.list.push(__filename);
const packName = 'global.adp.db.Mongo';

/**
 * MongoDB client connection class
 * @author Cein-Sven Da Costa [edaccei]
 */
class Mongo {
  constructor() {
    const mongoSettings = '?authMechanism=SCRAM-SHA-256&authSource=admin';
    const mongoUrl = `${global.adp.config.mongodb}${mongoSettings}`;
    this.defaultDB = 'adpPortal';
    this.client = new MongoClient(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.ObjectID = ObjectID;
  }

  /**
   * creates a list or a single collection in the defined database
   * @param {string} db the name of the database to add the collecitons to
   * @param {array} collectionList array of objects where the object.name is the name
   * of the collection
   * Example [{ name: 'collectionName' }]
   * @returns the dbCreation response
   * @author Cein
   */
  createCollections(db, collectionList) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(collectionList) && collectionList.length && db) {
        const promiseList = [];
        promiseList.push(new Promise((collResolve, collReject) => {
          collectionList.forEach((collObj) => {
            if (collObj.name) {
              this.client.db(db).createCollection(collObj.name, (errorOnCreate, createResult) => {
                if (errorOnCreate) {
                  if (errorOnCreate.codeName === 'NamespaceExists') {
                    const resp = `Collection [${collObj.name}] for db [${db}] already exists.`;
                    adp.echoLog(`Collection [${collObj.name}] for db [${db}] already exists.`, null, 200, packName);
                    global.adp[collObj.appname] = this.client.db(db).collection(collObj.name);
                    collResolve(resp);
                  } else {
                    adp.echoLog(`Error on [ this.client.db(${db}).createCollection ]`, { errorOnCreate, createResult }, 500, packName, true);
                    collReject(errorOnCreate);
                  }
                } else {
                  global.adp[collObj.appname] = this.client.db(db).collection(collObj.name);
                  adp.echoLog(`Successfully created collection [ ${collObj.name} ]`, null, 200, packName);
                  collResolve(createResult);
                }
              });
            } else {
              const error = 'Given collection List is not correctly defined, name & appname needed';
              collReject(error);
            }
          });
        }));
        Promise.all(promiseList).then((creationResult) => {
          resolve(creationResult);
        }).catch((errorCreatingColl) => {
          const error = { message: errorCreatingColl, code: 500 };
          adp.echoLog('Error on [ Promise.all(promiseList) ]', errorCreatingColl, error.code, packName);
          reject(error);
        });
      } else {
        const error = { message: 'Invalid params given', code: 400 };
        adp.echoLog('Error on [ createCollections ]', { message: error.message, db, collectionList }, error.code, packName);
        reject(error);
      }
    });
  }

  /**
   * Check if the database connection is still active
   * @returns {boolean} true if still connected
   * @author Cein
   */
  checkConnection() {
    if (this.client) {
      try {
        const activeConObj = this.client.db();
        return activeConObj.serverConfig.isConnected();
      } catch (error) {
        adp.echoLog('Error on [ checkConnection ]', error, 500, packName);
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Connects to mongodb.
   * @returns {promise} true on successfully connected
   * @author Cein
   */
  connect() {
    return new Promise((resolve, reject) => {
      this.client.connect((connectionError) => {
        if (connectionError) {
          adp.echoLog('Error on [ connect ]', connectionError, 500, packName);
          reject(connectionError);
        } else {
          adp.echoLog('Connected to Mongo successfully', null, 200, packName);
          resolve(true);
        }
      });
    });
  }

  /**
   * Disconnects from mongodb.
   * @returns {promise} true on successful disconnect
   * @author Cein
   */
  disconnect() {
    return new Promise((resolve, reject) => {
      if (this.client) {
        this.client.close((errorClosingDb) => {
          if (errorClosingDb) {
            adp.echoLog('Error on [ disconnect ]', errorClosingDb, 500, packName);
            reject(errorClosingDb);
          } else {
            adp.echoLog('Disconnected from database [ adpPortal ] successfully', null, 200, packName);
            resolve(true);
          }
        });
      } else {
        const error = 'The client is invalid.';
        reject(error);
      }
    });
  }

  /**
   * Intialisation check for the adpPortal database and related collections.
   * If the db or collections set done't exist it will be created.
   * @author Cein
   */
  async adpPortalDBInit() {
    try {
      await this.connect();
      await this.createCollections(this.defaultDB, global.adp.config.database);
    } catch (errorCheck) {
      throw errorCheck;
    }
  }
}

module.exports = Mongo;
