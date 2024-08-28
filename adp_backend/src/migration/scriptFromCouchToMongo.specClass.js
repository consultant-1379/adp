class Mongo {
  constructor() {
    this.client = {
      db: () => {
        const level1 = {
          collection: (COLLECTION) => {
            const body = {
              drop: () => new Promise((RESOLVE, REJECT) => {
                if (adp.MongoCreateDropBehavior === 0) {
                  RESOLVE();
                } else if (adp.MongoCreateDropBehavior === 1) {
                  const error = { codeName: 'NamespaceNotFound' };
                  REJECT(error);
                } else {
                  const error = { codeName: 'unknown' };
                  REJECT(error);
                }
              }),
              insertMany: ARRAY => new Promise((RESOLVE, REJECT) => {
                if (adp.MongoInsertOneCrash === true) {
                  REJECT();
                  return;
                }
                if (adp.mockMongo === undefined) {
                  adp.mockMongo = [];
                }
                adp.mockMongo.push({ collection: COLLECTION, register: ARRAY });
                const obj = {};
                obj.result = {};
                obj.result.ok = adp.MongoInsertOneAnswerCode;
                obj.result.n = ARRAY.length;
                RESOLVE(obj);
              }),
            };
            return body;
          },
          createCollection: () => new Promise((RESOLVE, REJECT) => {
            if (adp.MongoCreateCollectionCrash === true) {
              REJECT();
              return;
            }
            RESOLVE();
          }),
        };
        return level1;
      },
    };
    this.testScenario = adp.MongoConnectionCrash;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.testScenario = adp.MongoConnectionCrash;
      if (this.testScenario === false) {
        resolve();
      } else {
        reject();
      }
    });
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      this.testScenario = adp.MongoDisconnectionCrash;
      if (this.testScenario === false) {
        resolve();
      } else {
        reject();
      }
    });
  }
}

module.exports = Mongo;
