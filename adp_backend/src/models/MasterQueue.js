/**
* [ adp.models.MasterQueue ]
* masterQueue Database Model
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable class-methods-use-this */
const errorLog = require('./../library/errorLog');
// ===============================================================================
const syncStatusConstant = require('./../library/utils/constants').SYNC_STATUS;
// ===============================================================================

class MasterQueue {
  constructor() {
    this.dbMongoCollection = 'masterQueue';
    this.packName = 'adp.models.MasterQueue';
  }

  /**
   * createIndexesForMasterQueueCollection
   * Just once per Backend run, this method
   * creates the indexes in masterQueue collection.
   * @author Armando Dias [zdiaarm]
   */
  async createIndexesForMasterQueueCollection() {
    if (adp && adp.models && adp.models.MasterQueueCheckIndex) {
      return;
    }
    adp.models.MasterQueueCheckIndex = 'checked';
    try {
      await adp.mongoDatabase.collection(this.dbMongoCollection)
        .createIndex({ status: 1 }, { name: 'queue_status' });
      await adp.mongoDatabase.collection(this.dbMongoCollection)
        .createIndex({ index: 1 }, { name: 'queue_index' });
      await adp.mongoDatabase.collection(this.dbMongoCollection)
        .createIndex({ priority: 1 }, { name: 'queue_priority' });
      await adp.mongoDatabase.collection(this.dbMongoCollection)
        .createIndex({ attempts: 1 }, { name: 'queue_attempts' });
      await adp.mongoDatabase.collection(this.dbMongoCollection)
        .createIndex({ objective: 1 }, { name: 'queue_objective' });
      await adp.mongoDatabase.collection(this.dbMongoCollection)
        .createIndex({ mission: 1 }, { name: 'queue_mission' });
      await adp.mongoDatabase.collection(this.dbMongoCollection)
        .createIndex({ target: 1 }, { name: 'queue_target' });
      await adp.mongoDatabase.collection(this.dbMongoCollection)
        .createIndex({ runner: 1 }, { name: 'queue_runner' });
      // queue_added index >>> expireAfterSeconds >>> 259200 ( 3 days )
      // This document will be deleted three days after was added.
      await adp.mongoDatabase.collection(this.dbMongoCollection)
        .createIndex(
          { added: 1 },
          { name: 'queue_added', expireAfterSeconds: 259200 },
        );
      return;
    } catch (ERROR) {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error on creating a mongo index';
      const errorData = {
        collection: this.dbMongoCollection,
        error: ERROR,
      };
      errorLog(errorCode, errorMessage, errorData, 'createIndexesForMasterQueueCollection', this.packName);
    }
  }

  /**
   * add
   * Method to add a new step on the queue
   * @param {string} COMMAND The function reference in the namespace.
   * @param {array} PARAMS Array of Parameters which will be passed as parameters.
   * @param {string} OBJECTIVE If this will be used in a job group,
   * the objective should be informed.
   * @returns {Promise} Returns a promise with the result of the request.
   * @author Armando Dias [zdiaarm]
   */
  add(MISSION, TARGET, COMMAND, PARAMS, OBJECTIVE = '', INDEX = 0, PRIORITY = 0, THERUNNER = 'WORKER') {
    this.createIndexesForMasterQueueCollection();
    let queueStatusLink;
    if (OBJECTIVE || OBJECTIVE !== '') {
      queueStatusLink = adp.queue.obtainObjectiveLink(OBJECTIVE);
    }
    const queueItem = {
      status: 0,
      attempts: 0,
      index: INDEX,
      priority: PRIORITY,
      mission: `${MISSION}`,
      target: `${TARGET}`,
      objective: `${OBJECTIVE}`,
      command: COMMAND,
      params: PARAMS,
      added: new Date(),
      waited: 0,
      started: 0,
      duration: 0,
      ended: 0,
      type: 'queueItem',
      runner: THERUNNER.trim().toUpperCase() === 'WORKER' ? 'WORKER' : 'MAIN',
      payload: null,
      data: {
        status: 0,
        message: 'Status 0: Waiting...',
        queueStatusLink,
      },
    };
    return adp.db.create(this.dbMongoCollection, queueItem)
      .then((RESULT) => {
        if (RESULT.ok === true) {
          return { status: true, queue: RESULT.id };
        }
        const errorCode = 500;
        const errorMessage = 'Invalid answer from database ( ok === true is expected ) from db.create at add()';
        const errorData = {
          collection: this.dbMongoCollection,
          queueItem,
          databaseAnswer: RESULT,
        };
        errorLog(errorCode, errorMessage, errorData, 'add', this.packName);
        return { status: false };
      })
      .catch((ERROR) => {
        const errorCode = ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.db.create ] at adp.models.MasterQueue.add()';
        const errorData = {
          collection: this.dbMongoCollection,
          queueItem,
          error: ERROR,
        };
        return errorLog(errorCode, errorMessage, errorData, 'add', this.packName);
      });
  }


  /**
   * addMany
   * Method to add a group of jobs using insertMany on MongoDB.
   * @param {string} OBJECTIVE A group name for the task group + a timestamp to become unique.
   * @param {array} COMMANDSANDPARAMS Array of objects, following the example:
   * [
   *  {
   *    command: The function reference in the namespace.
   *    parameters: Array of Parameters which will be passed as parameters.
   *  }
   * ]
   * @returns {Promise} Returns a promise with the result of the request.
   * @author Armando Dias [zdiaarm]
   */
  addMany(MISSION, TARGET, OBJECTIVE, COMMANDSANDPARAMS, THERUNNER = 'WORKER') {
    this.createIndexesForMasterQueueCollection();
    if (!Array.isArray(COMMANDSANDPARAMS)) {
      const errorMessage = 'The parameter COMMANDSANDPARAMS should be an Array of Objects';
      return new Promise((RES, REJ) => REJ(errorMessage));
    }
    const jobsToInsert = [];
    const queueStatusLink = adp.queue.obtainObjectiveLink(OBJECTIVE);

    COMMANDSANDPARAMS.forEach((ITEM) => {
      let msTarget = TARGET;
      if (ITEM && ITEM.target) {
        msTarget = ITEM.target;
      }
      jobsToInsert.push({
        status: 0,
        attempts: 0,
        index: ITEM.index,
        priority: ITEM.priority ? ITEM.priority : 0,
        mission: `${MISSION}`,
        target: `${msTarget}`,
        objective: `${OBJECTIVE}`,
        command: ITEM.command,
        params: ITEM.parameters,
        added: new Date(),
        waited: 0,
        started: 0,
        duration: 0,
        ended: 0,
        type: 'queueItem',
        runner: THERUNNER.trim().toUpperCase() === 'WORKER' ? 'WORKER' : 'MAIN',
        payload: null,
        data: {
          status: 0,
          message: 'Status 0: Waiting...',
          queueStatusLink,
        },
      });
    });
    return adp.db.createMany(this.dbMongoCollection, jobsToInsert)
      .then((RESULT) => {
        if (RESULT.ok === true) {
          return { status: true, queue: OBJECTIVE };
        }
        const errorCode = 500;
        const errorMessage = 'Invalid answer from database ( ok === true is expected ) from db.createMany at add()';
        const errorData = {
          collection: this.dbMongoCollection,
          jobsToInsert,
          databaseAnswer: RESULT,
        };
        errorLog(errorCode, errorMessage, errorData, 'addObjective', this.packName);
        return { status: false };
      })
      .catch((ERROR) => {
        const errorCode = ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.db.createMany ] at adp.models.MasterQueue.addObjective()';
        const errorData = {
          collection: this.dbMongoCollection,
          jobsToInsert,
          error: ERROR,
        };
        return errorLog(errorCode, errorMessage, errorData, 'addObjective', this.packName);
      });
  }


  /**
   * next
   * Returns the next step to be executed and
   * set this as started if found the next step.
   * @param {string} RUNNERMODE String which contains 'WORKER'
   * or 'MAIN' to change the Queue's Action Behavior.
   * @returns {Promise} Returns a promise, where the result could be:
   * The object of the next step.
   * Boolean true if the queue is empty.
   * Boolean false if the query crashes.
   * @author Armando Dias [zdiaarm]
   */
  next(RUNNERMODE = 'WORKER') {
    const mongoQuery = {
      runner: RUNNERMODE.trim().toUpperCase() === 'WORKER' ? 'WORKER' : 'MAIN',
      status: 0,
    };
    const mongoOptions = { limit: 1, skip: 0, sort: { priority: 1, added: 1, index: 1 } };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    )
      .then((RESULT) => {
        if (RESULT && Array.isArray(RESULT.docs)) {
          if (RESULT.docs.length === 1) {
            const theNextStep = RESULT.docs[0];
            theNextStep.started = new Date();
            theNextStep.waited = theNextStep.started.getTime() - theNextStep.added.getTime();
            theNextStep.status = 1;
            theNextStep.attempts += 1;
            theNextStep.data = {
              status: 1,
              message: 'Status 1: Running...',
              desc: 'This Job is being executed right now...',
            };
            return adp.db.update(this.dbMongoCollection, theNextStep)
              .then((AFTERUPDATE) => {
                if (AFTERUPDATE.ok === true) {
                  // Returning the next item of the queue. Everything is fine here.
                  return theNextStep;
                }
                const errorCode = 500;
                const errorMessage = 'Invalid answer from database ( ok === true is expected ) from db.update next()';
                const errorData = {
                  collection: this.dbMongoCollection,
                  theNextStep,
                  databaseAnswer: AFTERUPDATE,
                };
                errorLog(errorCode, errorMessage, errorData, 'next', this.packName);
                return false;
              })
              .catch((ERROR) => {
                const errorCode = ERROR.code ? ERROR.code : 500;
                const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.db.update ] at adp.models.MasterQueue.next()';
                const errorData = {
                  collection: this.dbMongoCollection,
                  theNextStep,
                  error: ERROR,
                };
                errorLog(errorCode, errorMessage, errorData, 'next', this.packName);
                return false;
              });
          }
          // The queue is empty. Everything is fine here.
          return true;
        }
        const errorCode = 500;
        const errorMessage = 'Invalid answer from database from db.find at next()';
        const errorData = {
          collection: this.dbMongoCollection,
          mongoQuery,
          mongoOptions,
          databaseAnswer: RESULT,
        };
        errorLog(errorCode, errorMessage, errorData, 'next', this.packName);
        return false;
      })
      .catch((ERROR) => {
        const errorCode = ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.db.find ] at adp.models.MasterQueue.next()';
        const errorData = {
          collection: this.dbMongoCollection,
          mongoQuery,
          mongoOptions,
          error: ERROR,
        };
        errorLog(errorCode, errorMessage, errorData, 'next', this.packName);
        return false;
      });
  }


  /**
   * retake
   * Returns the next step to be executed and
   * set this as started if found the next step.
   * @param {string} RUNNERMODE String which contains 'WORKER'
   * or 'MAIN' to change the Queue's Action Behavior.
   * @returns {Promise} Returns a promise, where the result could be:
   * The object of the next step.
   * Boolean true if the queue is empty.
   * Boolean false if the query crashes.
   * @author Armando Dias [zdiaarm]
   */
  retake(RUNNERMODE = 'WORKER') {
    const mongoQuery = {
      runner: RUNNERMODE.trim().toUpperCase() === 'WORKER' ? 'WORKER' : 'MAIN',
      status: 1,
      attempts: { $lte: 3 },
    };
    const mongoOptions = { limit: 1, skip: 0, sort: { added: 1 } };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    )
      .then((RESULT) => {
        if (RESULT && Array.isArray(RESULT.docs)) {
          if (RESULT.docs.length === 1) {
            const theNextStep = RESULT.docs[0];
            theNextStep.started = new Date();
            theNextStep.waited = theNextStep.started.getTime() - theNextStep.added.getTime();
            if (theNextStep.attempts === 3) {
              theNextStep.status = 3;
              theNextStep.data = {
                status: 3,
                message: 'Status 3: Maximum attempts exceeded',
                desc: 'Unable to finish this job after a few attempts.',
              };
            } else {
              theNextStep.status = 1;
              theNextStep.attempts += 1;
              theNextStep.data = {
                status: 1,
                message: 'Status 1: Running again...',
                desc: 'Unable to finish this job on a previous try. Trying again right now.',
              };
            }
            return adp.db.update(this.dbMongoCollection, theNextStep)
              .then((AFTERUPDATE) => {
                if (AFTERUPDATE.ok === true) {
                  if (theNextStep.status === 3) {
                    // If status === 3, the return is false ( Maximum attempts exceeded )
                    return false;
                  }
                  // Returning the next item of the queue. Everything is fine here.
                  return theNextStep;
                }
                const errorCode = 500;
                const errorMessage = 'Invalid answer from database ( ok === true is expected ) from db.update at retake()';
                const errorData = {
                  collection: this.dbMongoCollection,
                  theNextStep,
                  databaseAnswer: AFTERUPDATE,
                };
                errorLog(errorCode, errorMessage, errorData, 'retake', this.packName);
                return false;
              })
              .catch((ERROR) => {
                const errorCode = ERROR.code ? ERROR.code : 500;
                const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.db.update ] at adp.models.MasterQueue.retake()';
                const errorData = {
                  collection: this.dbMongoCollection,
                  theNextStep,
                  error: ERROR,
                };
                errorLog(errorCode, errorMessage, errorData, 'retake', this.packName);
                return false;
              });
          }
          // The queue is empty. Everything is fine here.
          return true;
        }
        const errorCode = 500;
        const errorMessage = 'Invalid answer from db.find at retake()';
        const errorData = {
          collection: this.dbMongoCollection,
          mongoQuery,
          mongoOptions,
          databaseAnswer: RESULT,
        };
        errorLog(errorCode, errorMessage, errorData, 'retake', this.packName);
        return false;
      })
      .catch((ERROR) => {
        const errorCode = ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.db.find ] at adp.models.MasterQueue.retake()';
        const errorData = {
          collection: this.dbMongoCollection,
          mongoQuery,
          mongoOptions,
          error: ERROR,
        };
        errorLog(errorCode, errorMessage, errorData, 'retake', this.packName);
        return false;
      });
  }


  /**
   * done
   * Method to register a step done.
   * @param {string} ID The ID of the step to be updated.
   * @param {number} STATUSCODE The Server Status Code ( 200: Ok, 400: Bad Request, etc. ).
   * @param {object} DATA Object with the result of the job.
   * @returns {Promise} Returns a promise with true if successful or false if crashes.
   * @author Armando Dias [zdiaarm]
   */
  done(ID, STATUSCODE, DATA) {
    const status = STATUSCODE >= 0 ? STATUSCODE : 500;
    const ObjectID = adp.MongoObjectID;
    const mongoQuery = {
      _id: new ObjectID(ID),
    };
    const mongoOptions = { limit: 1, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    )
      .then((RESULT) => {
        if (RESULT && Array.isArray(RESULT.docs)) {
          if (RESULT.docs.length === 1) {
            const theStep = RESULT.docs[0];
            theStep.ended = new Date();
            theStep.duration = theStep.ended.getTime() - theStep.started.getTime();
            theStep.status = status;
            theStep.data = DATA;
            return adp.db.update(this.dbMongoCollection, theStep)
              .then((AFTERUPDATE) => {
                if (AFTERUPDATE.ok === true) {
                  // Everything is updated as expected. Everything is fine here.
                  return true;
                }
                const errorCode = 500;
                const errorMessage = 'Invalid answer from database ( ok === true is expected ) from db.update at done()';
                const errorData = {
                  collection: this.dbMongoCollection,
                  theStep,
                  databaseAnswer: AFTERUPDATE,
                };
                errorLog(errorCode, errorMessage, errorData, 'done', this.packName);
                return false;
              })
              .catch((ERROR) => {
                const errorCode = ERROR.code ? ERROR.code : 500;
                const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.db.find ] at adp.models.MasterQueue.done()';
                const errorData = {
                  collection: this.dbMongoCollection,
                  mongoQuery,
                  mongoOptions,
                  error: ERROR,
                };
                errorLog(errorCode, errorMessage, errorData, 'done', this.packName);
                return false;
              });
          }
        }
        const errorCode = 500;
        const errorMessage = 'Invalid answer from database ( RESULT.docs[0] is expected )';
        const errorData = {
          collection: this.dbMongoCollection,
          mongoQuery,
          mongoOptions,
          databaseAnswer: RESULT,
        };
        errorLog(errorCode, errorMessage, errorData, 'done', this.packName);
        return false;
      })
      .catch((ERROR) => {
        const errorCode = ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.db.find ] at adp.models.MasterQueue.done()';
        const errorData = {
          collection: this.dbMongoCollection,
          mongoQuery,
          mongoOptions,
          error: ERROR,
        };
        errorLog(errorCode, errorMessage, errorData, 'done', this.packName);
        return false;
      });
  }


  /**
   * already
   * Returns true if the combination of COMMAND x PARAMS is waiting
   * on the queue ( status = 0 ). Otherwiser, returns false.
   * @param {string} COMMAND The function reference in the namespace.
   * @param {array} PARAMS Array of Parameters which will be passed as parameters.
   * @returns {Boolean/String} Returns the id if is already waiting in the queue.
   * @author Armando Dias [zdiaarm]
   */
  already(MISSION, TARGET, OBJECTIVE, THERUNNER = 'WORKER') {
    const mongoQuery = {
      $and: [
        { mission: { $eq: MISSION } },
        { target: { $eq: TARGET } },
        { runner: { $eq: THERUNNER.trim().toUpperCase() === 'WORKER' ? 'WORKER' : 'MAIN' } },
        { objective: { $ne: OBJECTIVE } },
        { status: { $lt: 2 } },
      ],
    };
    const mongoOptions = { limit: 1, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    )
      .then((RESULT) => {
        if (RESULT && Array.isArray(RESULT.docs)) {
          if (RESULT.docs.length > 0) {
            const queued = RESULT.docs[0];
            const queueStatusLink = adp.queue.obtainObjectiveLink(queued.objective);
            // The requested command/params combination is waiting in the queue.
            return queueStatusLink;
          }
        }
        // The requested command/params combination is not waiting in the queue.
        return false;
      })
      .catch((ERROR) => {
        const errorCode = ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.db.find ] at adp.models.MasterQueue.already()';
        const errorData = {
          collection: this.dbMongoCollection,
          mongoQuery,
          mongoOptions,
          error: ERROR,
        };
        // Cannot check if the requested command/params combination is waiting in the queue.
        return errorLog(errorCode, errorMessage, errorData, 'already', this.packName);
      });
  }


  /**
   * group
   * Retrieves how many jobs of this group are in total and
   * how many are waiting.
   * @param {object} JOB Object Job.
   * @returns {object} If successful, returns an object as:
   * {
   *   objective,
   *   total,
   *   totalWaiting,
   *   running,
   *   percentageDone,
   * }
   * @author Armando Dias [zdiaarm]
   */
  group(JOB) {
    const objective = JOB.objective ? JOB.objective : null;
    if (!objective) {
      return new Promise(RES => RES(false));
    }
    const pipelines = [];

    pipelines.push({
      $facet: {
        totalCount: [{
          $match: {
            objective: { $eq: objective },
          },
        },
        { $count: 'total' },
        ],
        waitingCount: [{
          $match: {
            $and: [
              { objective: { $eq: objective } },
              { status: 0 },
            ],
          },
        },
        { $count: 'total' }],
      },
    });

    return adp.db.aggregate(this.dbMongoCollection, pipelines)
      .then((RESULT) => {
        const total = RESULT
          && RESULT.docs
          && RESULT.docs[0]
          && RESULT.docs[0].totalCount
          && RESULT.docs[0].totalCount[0]
          ? RESULT.docs[0].totalCount[0].total - 1
          : 0;
        const waiting = RESULT
          && RESULT.docs
          && RESULT.docs[0]
          && RESULT.docs[0].waitingCount
          && RESULT.docs[0].waitingCount[0]
          ? RESULT.docs[0].waitingCount[0].total
          : 0;
        if (total === 0) {
          return new Promise(RES => RES({ error: 'Not Available' }));
        }
        const status = {
          objective,
          total,
          totalWaiting: waiting,
          running: total - waiting,
          percentageDone: ((total - waiting) * 100 / total),
        };
        return new Promise(RES => RES(status));
      })
      .catch((ERROR) => {
        adp.echoLog('Error on [ adp.db.aggregate ]', { origin: 'group', error: ERROR }, 500, 'adp.models.MasterQueue');
        return new Promise((RES, REJ) => REJ(ERROR));
      });
  }


  /**
   * duplicates
   * Check if exists repeated requests and set them as "duplicated".
   * A "Duplicated Request" happens when a command/params combination
   * is requested and matches with another step which is not started yet.
   * @param {object} JOB The JOB Object.
   * @param {string} RUNNERMODE String which contains 'WORKER'
   * or 'MAIN' to change the Queue's Action Behavior.
   * @returns {Promise} Returns a Promise with a number if successful or
   * an errorLog Object if fails. This number is how many duplicates were
   * detected and updated to not run.
   * @author Armando Dias [zdiaarm]
   */
  duplicates(JOB, RUNNERMODE = 'WORKER') {
    const id = `${JOB._id}`;
    const { command, params } = JOB;
    const ObjectID = adp.MongoObjectID;
    const mongoFilter = {
      $and: [
        { _id: { $ne: new ObjectID(id) } },
        { runner: { $eq: RUNNERMODE.trim().toUpperCase() === 'WORKER' ? 'WORKER' : 'MAIN' } },
        { command: { $eq: command } },
        { params: { $eq: params } },
        { status: { $eq: 0 } },
      ],
    };
    let queueStatusLink;
    if (JOB && JOB.objective) {
      queueStatusLink = adp.queue.obtainObjectiveLink(JOB.objective);
    } else {
      queueStatusLink = `${adp.config.siteAddress}/queue/${id}`;
    }
    const updateObject = {
      $set: {
        status: 2,
        data: {
          status: 2,
          message: 'Status 2: Duplicated',
          desc: 'Job requested at the same time of another job with the same method/parameters. This job will not run.',
          duplicatedFrom: id,
          queueStatusLink,
        },
      },
    };
    return adp.db.updateMany(this.dbMongoCollection, mongoFilter, updateObject)
      .then((RESULT) => {
        if (RESULT.ok === true) {
          return RESULT.modifiedCount;
        }
        const errorCode = 500;
        const errorMessage = 'Invalid answer from db.updateMany ( RESULT.ok === true is expected )';
        const errorData = {
          collection: this.dbMongoCollection,
          mongoFilter,
          updateObject,
          error: RESULT,
        };
        return errorLog(errorCode, errorMessage, errorData, 'duplicates', this.packName);
      })
      .catch((ERROR) => {
        const errorCode = ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.db.updateMany ] at adp.models.MasterQueue.ducplicates()';
        const errorData = {
          collection: this.dbMongoCollection,
          mongoFilter,
          updateObject,
          error: ERROR,
        };
        return errorLog(errorCode, errorMessage, errorData, 'duplicates', this.packName);
      });
  }


  /**
   * running
   * Returns true if the queue is running or
   * false if the queue is not running.
   * @param {string} RUNNERMODE String which contains 'WORKER'
   * or 'MAIN' to change the Queue's Action Behavior.
   * @returns {Promise} Returns a promise, with a boolean value.
   * @author Armando Dias [zdiaarm]
   */
  running(RUNNERMODE = 'WORKER') {
    const mongoQuery = {
      runner: RUNNERMODE.trim().toUpperCase() === 'WORKER' ? 'WORKER' : 'MAIN',
      status: 1,
    };
    const mongoOptions = { limit: 1, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    )
      .then((RESULT) => {
        if (RESULT && Array.isArray(RESULT.docs)) {
          if (RESULT.docs.length === 1) {
            return true;
          }
        }
        return false;
      })
      .catch((ERROR) => {
        const errorCode = ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.db.find ] at adp.models.MasterQueue.running()';
        const errorData = {
          collection: this.dbMongoCollection,
          mongoQuery,
          mongoOptions,
          error: ERROR,
        };
        errorLog(errorCode, errorMessage, errorData, 'running', this.packName);
        return false;
      });
  }


  /**
   * groupHeader
   * Retrieve the header of the group
   * ( OBJECTIVE with index equals zero  )
   * @param {string} OBJECTIVE The Group JOB id.
   * @returns Promise which results in a JSON Object
   */
  groupHeader(OBJECTIVE) {
    return new Promise((RESOLVE, REJECT) => {
      const mongoQuery = {
        objective: OBJECTIVE,
        index: { $eq: 0 },
      };
      const mongoOptions = { limit: 1, skip: 0, sort: { added: 1, index: 1 } };
      adp.db.find(
        this.dbMongoCollection,
        mongoQuery,
        mongoOptions,
      )
        .then((RESULT) => {
          RESOLVE(RESULT);
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.db.find ] at adp.models.MasterQueue.groupHeader()';
          const errorData = {
            error: ERROR,
            collection: this.dbMongoCollection,
            mongoQuery,
            mongoOptions,
          };
          REJECT(errorLog(errorCode, errorMessage, errorData, 'groupHeader', this.packName));
        });
    });
  }


  /**
   * getPayload
   * Retrieve the payload of the group
   * @param {string} OBJECTIVE The Group JOB id.
   * @returns Promise which results in a JSON Object
   */
  getPayload(OBJECTIVE) {
    return new Promise((RESOLVE, REJECT) => {
      const mongoQuery = {
        objective: OBJECTIVE,
        index: { $eq: 0 },
      };
      const mongoOptions = {
        limit: 1, skip: 0, sort: { added: 1, index: 1 },
      };
      const mongoProjection = {
        _id: 0, payload: 1,
      };
      adp.db.find(
        this.dbMongoCollection,
        mongoQuery,
        mongoOptions,
        mongoProjection,
      )
        .then((RESULT) => {
          if (RESULT
            && Array.isArray(RESULT.docs)
            && RESULT.docs[0]
            && RESULT.docs[0].payload) {
            RESOLVE(RESULT.docs[0].payload);
          } else {
            RESOLVE(undefined);
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.db.find ] at adp.models.MasterQueue.groupHeader()';
          const errorData = {
            error: ERROR,
            collection: this.dbMongoCollection,
            mongoQuery,
            mongoOptions,
          };
          REJECT(errorLog(errorCode, errorMessage, errorData, 'getPayload', this.packName));
        });
    });
  }


  /**
   * setPayload
   * Set the payload of the group
   * @param {string} OBJECTIVE The Group JOB id.
   * @param {object} OBJECT The JSON Object to be
   * saved as Group Payload.
   * @returns Promise which true if successful
   */
  setPayload(OBJECTIVE, OBJECT) {
    return new Promise((RESOLVE, REJECT) => {
      const mongoQuery = {
        objective: OBJECTIVE,
        index: { $eq: 0 },
      };
      const toUpdate = { $set: { payload: OBJECT } };
      adp.db.updateMany(this.dbMongoCollection, mongoQuery, toUpdate)
        .then((RESULT) => {
          if (RESULT && RESULT.matchedCount > 0) {
            RESOLVE(RESULT.ok);
          } else {
            const errorCode = 500;
            const errorMessage = 'Error on [ adp.db.updateMany ] at adp.models.MasterQueue.setPayload()';
            const errorData = {
              error: 'The matchedCount should be greater than zero.',
              possible_reason: 'Check if the objective of the queue request contains an index starting in zero.',
              result: RESULT,
              collection: this.dbMongoCollection,
              mongoQuery,
              toUpdate,
            };
            REJECT(errorLog(errorCode, errorMessage, errorData, 'setPayload', this.packName));
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.db.updateMany ] at adp.models.MasterQueue.setPayload()';
          const errorData = {
            error: ERROR,
            collection: this.dbMongoCollection,
            mongoQuery,
            toUpdate,
          };
          REJECT(errorLog(errorCode, errorMessage, errorData, 'setPayload', this.packName));
        });
    });
  }


  /**
   * groupEnd
   * Retrieve the last job of the group
   * @param {string} OBJECTIVE The Group JOB id.
   * @returns Promise which results in a JSON Object
   */
  groupEnd(OBJECTIVE) {
    return new Promise((RESOLVE, REJECT) => {
      const mongoQuery = {
        objective: OBJECTIVE,
      };
      const mongoOptions = { limit: 1, skip: 0, sort: { index: -1 } };
      adp.db.find(
        this.dbMongoCollection,
        mongoQuery,
        mongoOptions,
      )
        .then((RESULT) => {
          if (RESULT && Array.isArray(RESULT.docs) && RESULT.docs[0]) {
            const result = RESULT.docs[0].data;
            RESOLVE(result);
          } else {
            const result = {
              status: 404,
              statusMessage: 'Job Group not found in our queue',
            };
            RESOLVE(result);
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.db.find ] at adp.models.MasterQueue.groupEnd()';
          const errorData = {
            error: ERROR,
            collection: this.dbMongoCollection,
            mongoQuery,
            mongoOptions,
          };
          REJECT(errorLog(errorCode, errorMessage, errorData, 'groupEnd', this.packName));
        });
    });
  }

  /**
   * Retrieve the current status of the queue
   * looking for the OBJECTIVE group.
   * @param {string} OBJECTIVE The Group JOB id.
   * @returns if successful, returns an object as
   * { currentStatus, percentage }
   */
  currentStatus(OBJECTIVE) {
    return new Promise((RESOLVE, REJECT) => {
      this.group({ objective: OBJECTIVE })
        .then((QUEUESTATUS) => {
          if (QUEUESTATUS && QUEUESTATUS.error === 'Not Available') {
            RESOLVE({ currentStatus: '( 1/1 job - 100% done )', percentage: 100.00 });
            return;
          }
          const running = QUEUESTATUS
          && QUEUESTATUS.running >= 0
            ? QUEUESTATUS.running
            : 0;
          const total = QUEUESTATUS
          && QUEUESTATUS.total >= 0
            ? QUEUESTATUS.total : 0;
          const percentageDone = QUEUESTATUS
          && QUEUESTATUS.percentageDone >= 0
            ? QUEUESTATUS.percentageDone
            : 0;
          const percentage = percentageDone.toFixed(2);
          const currentStatus = `( ${running}/${total} jobs - ${percentage}% done )`;
          RESOLVE({ currentStatus, percentage });
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this.group() ]';
          const errorData = {
            collection: this.dbMongoCollection,
            OBJECTIVE,
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorData, 'groupEnd', this.packName));
        });
    });
  }


  /**
   * status
   * Retrieve the status of a job in the queue
   * to be sent to the frontend.
   * @param {string} ID The JOB id.
   * @returns Promise which results in a JSON Object
   */
  status(ID) {
    return new Promise((RESOLVE, REJECT) => {
      const ObjectID = adp.MongoObjectID;
      const mongoQuery = {
        _id: new ObjectID(ID),
      };
      const mongoOptions = { limit: 1, skip: 0 };
      adp.db.find(
        this.dbMongoCollection,
        mongoQuery,
        mongoOptions,
      )
        .then((RESULT) => {
          if (RESULT && Array.isArray(RESULT.docs) && RESULT.docs.length > 0) {
            const result = RESULT.docs[0];
            const resultToSend = {
              job: {
                id: ID,
                status: result.status,
                statusDescription: this.queueStatusCodeToString(result.status),
                queue: {
                  added: result.added,
                  waited: `${result.waited}ms`,
                  started: result.started,
                  duration: `${result.duration}ms`,
                  ended: result.ended,
                },
                result: result.data,
              },
            };
            RESOLVE(resultToSend);
          } else {
            RESOLVE(`${ID} was not found`);
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.db.find ] at adp.models.MasterQueue.status()';
          const errorData = {
            collection: this.dbMongoCollection,
            mongoQuery,
            mongoOptions,
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorData, 'status', this.packName));
        });
    });
  }

  /**
   * lastJobs
   * Generate a quick report with the current status of the queue.
   * @param {integer} QUANT How many results do you want to see
   * from the newest to the oldest.
   * @returns The Report of the Queue in JSON format.
   */
  lastJobs(QUANT = 100) {
    const pipelines = [];
    pipelines.push({
      $group:
        {
          _id: '$objective',
          mission: { $first: '$mission' },
          firstStatus: { $first: '$status' },
          lastStatus: { $last: '$status' },
          added: { $first: '$added' },
          started: { $first: '$started' },
          ended: { $last: '$ended' },
          durationFatestInMS: { $min: '$duration' },
          durationSlowestInMS: { $max: '$duration' },
          durationAverageInMS: { $avg: '$duration' },
          durationTotalInMS: { $sum: '$duration' },
          jobs: { $sum: 1 },
        },
    });
    pipelines.push({
      $sort: { index: 1 },
    });
    pipelines.push({
      $limit: QUANT,
    });
    return adp.db.aggregate(this.dbMongoCollection, pipelines)
      .then((RESULT) => {
        const result = [];
        RESULT.docs.forEach((ITEM) => {
          const obj = {
            objective: ITEM._id,
            mission: ITEM.mission,
            status: 'placeHolder',
            statusMessage: 'placeHolder',
            queueStatusLink: adp.queue.obtainObjectiveLink(ITEM._id),
            objectiveAdded: ITEM.added,
            objectiveStarted: ITEM.started,
            objectiveEnded: ITEM.ended,
            totalJobs: ITEM.jobs,
            durationInMS: {
              fatestJob: ITEM.durationFatestInMS,
              slowestJob: ITEM.durationSlowestInMS,
              averageJob: parseInt(ITEM.durationAverageInMS, 10),
              allJobs: ITEM.durationTotalInMS,
            },
          };
          if (ITEM.lastStatus > 99) {
            obj.status = ITEM.lastStatus;
            obj.statusMessage = this.queueStatusCodeToString(ITEM.lastStatus);
          } else if (ITEM.lastStatus <= 1 && ITEM.firstStatus > 99) {
            obj.status = 1;
            obj.statusMessage = this.queueStatusCodeToString(1);
          } else {
            obj.status = ITEM.firstStatus;
            obj.statusMessage = this.queueStatusCodeToString(ITEM.firstStatus);
          }
          result.push(obj);
        });
        const orderResult = result.sort(adp.dynamicSort('-objectiveAdded'));
        return orderResult;
      })
      .catch((ERROR) => {
        adp.echoLog('Error on [ adp.db.aggregate ]', { origin: 'group', error: ERROR }, 500, 'adp.models.MasterQueue');
        return new Promise((RES, REJ) => REJ(ERROR));
      });
  }

  /**
   * documentSyncStatus
   * Generate a quick report with the current status of the queue.
   * @returns The Report of the Queue in JSON format.
   */
  documentSyncStatus(MICROSERVICES) {
    const pipelines = [];
    const allowedAssetsIDs = [];
    MICROSERVICES.forEach((ITEM) => {
      allowedAssetsIDs.push(ITEM.id);
    });
    pipelines.push({
      // commented to implement this logic when mimer sync and pagination is required
      $match: {
        target: { $in: allowedAssetsIDs },
        mission: { $in: ['documentRefresh', 'mimerDocumentUpdate', 'microserviceDocumentsElasticSync', 'mimerDocumentSync'] },
      },
      // $match: { target: { $in: allowedAssetsIDs }, mission: { $in: ['documentRefresh'] } },
    });
    pipelines.push({
      $group:
        {
          _id: '$objective',
          mission: { $first: '$mission' },
          msId: { $last: '$target' }, // slug
          firstStatus: { $first: '$status' },
          lastStatus: { $last: '$status' },
          status: { $addToSet: '$status' },
          added: { $first: '$added' },
          started: { $first: '$started' },
          ended: { $last: '$ended' },
        },
    });

    // if (TOTAL) {
    //   pipelines.push({
    //     $count: 'total',
    //   });
    // }
    // if (!TOTAL) {
    pipelines.push({
      $sort: { index: 1 },
    });
    // pipelines.push({
    //   $limit: limit,
    // });
    // pipelines.push({
    //   $skip: SKIP,
    // });
    // }

    return adp.db.aggregate(this.dbMongoCollection, pipelines)
      .then((RESULT) => {
        const result = [];
        // if (TOTAL) {
        //   const count = RESULT.docs[0] && RESULT.docs[0].total ? RESULT.docs[0].total : 0;
        //   result.push(count);
        // }
        const uniqueGroupObjectives = [];
        RESULT.docs.forEach((ITEM) => {
          const obj = {
            added: ITEM.added,
            started: ITEM.started,
            ended: ITEM.ended,
            mission: ITEM.mission,
            objective: ITEM._id,
          };
          if (ITEM && ITEM._id) {
            const uniqueobjective = ITEM._id.split(/_(.*)/s)[1];
            if (!uniqueGroupObjectives.includes(uniqueobjective)) {
              uniqueGroupObjectives.push(uniqueobjective);
            }
            obj.groupobjective = uniqueobjective;
          }
          if (ITEM.status.includes(400) || ITEM.status.includes(500) || ITEM.status.includes(3)) {
            obj.status = syncStatusConstant.FAILED;
          } else if (ITEM.lastStatus <= 1 && ITEM.firstStatus > 0) {
            obj.status = syncStatusConstant.IN_PROGRESS;
          } else if (ITEM.lastStatus === 0 && ITEM.firstStatus === 0) {
            obj.status = syncStatusConstant.QUEUED;
          } else {
            obj.status = syncStatusConstant.COMPLETED;
          }
          MICROSERVICES.forEach((MSIDNAME) => {
            if (ITEM.msId === MSIDNAME.id) {
              obj.microservice = MSIDNAME.name;
            }
          });
          result.push(obj);
        });
        const orderResult = result.sort(adp.dynamicSort('-added'));
        const finalresult = [];
        if (Array.isArray(uniqueGroupObjectives) && uniqueGroupObjectives.length > 0) {
          uniqueGroupObjectives.forEach((GROUPOBJECTIVE) => {
            const resp = orderResult.filter(res => res.objective.includes(GROUPOBJECTIVE));
            const sortedResp = resp.sort(adp.dynamicSort('-added'));
            let finalstatus = syncStatusConstant.QUEUED;
            let finishingTime;
            // Rules for deciding overall status:
            // [1] If All of the sync are in queued state overall state will be 'QUEUED'.
            // [2] If All of the sync are in completed state overall state will be 'COMPLETED'.
            // [3] If Any of the sync is failed overall state will 'FAILED'.
            // [4] Other wise overall state will be marked as 'IN PROGRESS'.
            if (sortedResp.every(ITEM => ITEM.status === syncStatusConstant.QUEUED)) {
              finalstatus = syncStatusConstant.QUEUED;
              finishingTime = '';
            } else if (sortedResp.every(ITEM => ITEM.status === syncStatusConstant.COMPLETED)) {
              finalstatus = syncStatusConstant.COMPLETED;
              finishingTime = sortedResp.length === 3 ? sortedResp[1].ended : sortedResp[0].ended;
            } else if (sortedResp.some(Item => Item.status === syncStatusConstant.FAILED)) {
              finalstatus = syncStatusConstant.FAILED;
              finishingTime = sortedResp[0].ended;
            } else {
              finalstatus = syncStatusConstant.IN_PROGRESS;
              finishingTime = '';
            }
            const finalobj = {
              added: sortedResp[sortedResp.length - 1].added,
              started: sortedResp[sortedResp.length - 1].started,
              ended: finishingTime,
              groupobjective: sortedResp[0].groupobjective,
              status: finalstatus,
              microservice: sortedResp[0].microservice,
            };
            finalresult.push(finalobj);
          });
        }
        const finalSortedResult = finalresult.sort(adp.dynamicSort('-added'));
        return finalSortedResult;
      })
      .catch((ERROR) => {
        adp.echoLog('Error on [ adp.db.aggregate ]', { origin: 'group', error: ERROR }, 500, 'adp.models.MasterQueue');
        return new Promise((RES, REJ) => REJ(ERROR));
      });
  }

  /**
   * documentSyncStatusDetails
   * give details of an asset sync status details.
   * @param {String} GROUPOBJECTIVE Groupobjective of which asset document sync status
   * details should be shown
   * @returns The document sync status details of an asset in JSON format.
   * @author Ravikiran G [zgarsri]
   */
  documentSyncStatusDetails(GROUPOBJECTIVE) {
    return new Promise((RESOLVE, REJECT) => {
      const pipelines = [];
      pipelines.push({
        $match: {
          objective: { $regex: GROUPOBJECTIVE },
          mission: { $in: ['documentRefresh', 'mimerDocumentUpdate', 'mimerDocumentSync', 'microserviceDocumentsElasticSync'] },
        },
      });
      pipelines.push({
        $group:
          {
            _id: '$objective',
            mission: { $first: '$mission' },
            msId: { $last: '$target' },
            firstStatus: { $first: '$status' },
            lastStatus: { $last: '$status' },
            status: { $addToSet: '$status' },
            added: { $first: '$added' },
            started: { $first: '$started' },
            ended: { $last: '$ended' },
            errorOrWarnings: {
              $addToSet: {
                $cond: {
                  if: {
                    $or:
                      [{ $gt: ['$payload.yamlErrorsQuant', 0] },
                        { $gt: ['$data.yamlWarningsQuant', 0] },
                      ],
                  },
                  then: {
                    yamlErrorsQuant: {
                      $ifNull: ['$payload.yamlErrorsQuant', 0],
                    },
                    yamlErrors: {
                      $ifNull: ['$payload.yamlErrors', []],
                    },
                    yamlWarningsQuant: '$data.yamlWarningsQuant',
                    yamlWarnings: '$data.yamlWarnings',
                    taskid: '$_id',
                    status: '$status',
                  },
                  else: '$$REMOVE',
                },
              },
            },
          },
      });
      adp.db.aggregate(this.dbMongoCollection, pipelines)
        .then((RESULT) => {
          if (RESULT && Array.isArray(RESULT.docs) && RESULT.docs.length > 0) {
            const result = [];
            RESULT.docs.forEach((ITEM) => {
              const obj = {
                added: ITEM.added,
                started: ITEM.started,
                ended: ITEM.ended,
                mission: ITEM.mission,
                objective: ITEM._id,
                msId: RESULT.docs[0].msId,
              };
              if (ITEM.status.includes(400)
                  || ITEM.status.includes(500)
                  || ITEM.status.includes(3)) {
                obj.status = syncStatusConstant.FAILED;
              } else if (ITEM.lastStatus <= 1 && ITEM.firstStatus > 0) {
                obj.status = syncStatusConstant.IN_PROGRESS;
              } else if (ITEM.lastStatus === 0 && ITEM.firstStatus === 0) {
                obj.status = syncStatusConstant.QUEUED;
              } else {
                obj.status = syncStatusConstant.COMPLETED;
              }
              if (Array.isArray(ITEM.errorOrWarnings)
                  && ITEM.errorOrWarnings.length > 0) {
                obj.errorOrWarnings = ITEM.errorOrWarnings;
              }
              result.push(obj);
            });
            const sortedResult = result.sort(adp.dynamicSort('added'));
            RESOLVE(sortedResult);
          }
          RESOLVE(`${GROUPOBJECTIVE} was not found`);
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message
            : 'Error on [ adp.db.aggregate ] at adp.models.MasterQueue.documentSyncStatusDetails()';
          const errorData = {
            collection: this.dbMongoCollection,
            pipelines,
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorData, 'status', this.packName));
        });
    });
  }


  /**
   * queueStatusCodeToString
   * Convert the Queue Status Code to descriptive string.
   * @param {integer} CODE The Queue Status Code.
   * @returns String with the result.
   */
  queueStatusCodeToString(CODE) {
    switch (CODE) {
      case 0:
        return 'Waiting...';
      case 1:
        return 'Running...';
      case 2:
        return 'Duplicated, ignored. See message to more details.';
      case 3:
        return 'Process crashed. Ignored because reached the maximum number of allowed attempts.';
      default:
        return `Server Status Code: ${CODE}`;
    }
  }

  countItemsInQueue() {
    const steps = [];
    steps.push({ $match: { status: 0 } });
    steps.push({ $group: { _id: { status: '$status' }, count: { $sum: 1 } } });
    return adp.db.aggregate(this.dbMongoCollection, steps)
      .then((RESULT) => {
        if (RESULT && Array.isArray(RESULT.docs) && RESULT.docs.length === 0) {
          return 0;
        }
        if (RESULT && Array.isArray(RESULT.docs) && RESULT.docs.length > 0) {
          const counter = RESULT.docs[0]
            && RESULT.docs[0].count
            ? RESULT.docs[0].count
            : 0;
          return counter;
        }
        const errorObject = {
          code: 500,
          message: 'Invalid answer from Database',
          error: RESULT,
        };
        return new Promise((RES, REJ) => REJ(errorObject));
      })
      .catch((ERROR) => {
        const errorObject = {
          code: ERROR && ERROR.code ? ERROR.code : 500,
          message: ERROR && ERROR.message ? ERROR.message : 'Invalid answer from Database',
          error: ERROR,
        };
        return new Promise((RES, REJ) => REJ(errorObject));
      });
  }

  oldestItemInQueue() {
    const mongoQuery = {
      status: { $eq: 0 },
    };
    const mongoOptions = { limit: 1, skip: 0, sort: { added: 1 } };
    const mongoProjection = { added: 1 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
      mongoProjection,
    )
      .then((RESULT) => {
        if (RESULT && Array.isArray(RESULT.docs) && RESULT.docs.length === 0) {
          return 0;
        }
        if (RESULT && Array.isArray(RESULT.docs) && RESULT.docs.length > 0) {
          const oldestDate = RESULT.docs[0]
            && RESULT.docs[0].added
            ? RESULT.docs[0].added
            : 0;
          const seconds = Math.ceil(((new Date()).getTime()
            - (new Date(oldestDate)).getTime()) / 1000);
          return seconds;
        }
        const errorObject = {
          code: 500,
          message: 'Invalid answer from Database',
          error: RESULT,
        };
        return new Promise((RES, REJ) => REJ(errorObject));
      })
      .catch((ERROR) => {
        const errorObject = {
          code: ERROR && ERROR.code ? ERROR.code : 500,
          message: ERROR && ERROR.message ? ERROR.message : 'Invalid answer from Database',
          error: ERROR,
        };
        return new Promise((RES, REJ) => REJ(errorObject));
      });
  }

  /**
   * getNextIndex
   * Retrieve from the database the next index from database based on
   * Objective. Should be used case the addJobs is called more than
   * once per Objective in different executions.
   * @param {string} OBJECTIVE A group name for the task group + a timestamp to become unique.
   * @returns Number with the next index. Zero if fails.
   * @author Armando Dias [zdiaarm]
   */
  getNextIndex(OBJECTIVE) {
    const steps = [];
    steps.push({ $match: { objective: { $eq: OBJECTIVE } } });
    steps.push({ $group: { _id: { objective: '$objective' }, count: { $sum: 1 } } });
    return adp.db.aggregate(this.dbMongoCollection, steps)
      .then((RESULT) => {
        if (RESULT && Array.isArray(RESULT.docs) && RESULT.docs[0]) {
          return RESULT.docs[0].count;
        }
        return 0;
      })
      .catch((ERROR) => {
        const errorObject = {
          code: ERROR && ERROR.code ? ERROR.code : 500,
          message: ERROR && ERROR.message ? ERROR.message : 'Invalid answer from Database',
          error: ERROR,
        };
        return errorObject;
      });
  }

  /**
   * getTheLastEntryOfTheObjective
   * Retrieve the id of the last entry.
   * @param {string} OBJECTIVE The Group JOB id.
   * @returns Promise which results in a JSON Object
   * @author Armando Dias [zdiaarm]
   */
  getTheLastEntryOfTheObjective(OBJECTIVE) {
    return new Promise((RESOLVE, REJECT) => {
      const mongoQuery = {
        objective: OBJECTIVE,
      };
      const mongoOptions = { limit: 1, skip: 0, sort: { added: -1, index: -1 } };
      const mongoProjection = { _id: 1 };
      adp.db.find(
        this.dbMongoCollection,
        mongoQuery,
        mongoOptions,
        mongoProjection,
      )
        .then((RESULT) => {
          if (RESULT
            && Array.isArray(RESULT.docs)
            && RESULT.docs.length > 0
            && RESULT.docs[0]._id
          ) {
            RESOLVE(RESULT.docs[0]._id);
          } else {
            RESOLVE(null);
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.db.find ] at adp.models.MasterQueue.getTheLastEntryOfTheObjective()';
          const errorData = {
            error: ERROR,
            collection: this.dbMongoCollection,
            mongoQuery,
            mongoOptions,
          };
          REJECT(errorLog(errorCode, errorMessage, errorData, 'getTheLastEntryOfTheObjective', this.packName));
        });
    });
  }


  /**
   * getObjectiveStatusCodes
   * Retrieve a list of the status codes of
   * the all jobs from an Objective
   * @param {string} OBJECTIVE The Group JOB id.
   * @returns Promise which results in a JSON Object
   * @author Armando Dias [zdiaarm]
   */
  async getObjectiveStatusCodes(OBJECTIVE) {
    const idToAvoid = await this.getTheLastEntryOfTheObjective(OBJECTIVE);
    const steps = [];
    if (idToAvoid) {
      steps.push({
        $match: {
          $and: [
            { _id: { $ne: adp.MongoObjectID(idToAvoid) } },
            { objective: { $eq: OBJECTIVE } },
          ],
        },
      });
    } else {
      steps.push({ $match: { objective: { $eq: OBJECTIVE } } });
    }
    steps.push({ $group: { _id: { status: '$status' }, count: { $sum: 1 } } });
    steps.push({ $group: { _id: '$_id.status', count: { $sum: 1 } } });

    return adp.db.aggregate(this.dbMongoCollection, steps)
      .then((RESULT) => {
        if (RESULT && Array.isArray(RESULT.docs) && RESULT.docs.length > 0) {
          const list = {};
          RESULT.docs.forEach((ITEM) => {
            list[ITEM._id] = ITEM.count;
          });
          return new Promise(RES => RES(list));
        }
        return {};
      })
      .catch((ERROR) => {
        const errorObject = {
          code: ERROR && ERROR.code ? ERROR.code : 500,
          message: ERROR && ERROR.message ? ERROR.message : 'Invalid answer from Database',
          error: ERROR,
        };
        return new Promise((RES, REJ) => REJ(errorObject));
      });
  }

  /**
   * queueIsFree
   * Expect zero if the queue is free
   * or a number bigger than zero, if
   * there is something waiting/being
   * processed.
   * @returns Integer ( or an error )
   * @author Armando Dias [zdiaarm]
   */
  queueIsFree() {
    return new Promise((RESOLVE, REJECT) => {
      const steps = [];
      steps.push({ $match: { status: { $lt: 2 } } });
      steps.push({ $count: 'jobs' });
      adp.db.aggregate(this.dbMongoCollection, steps)
        .then((RESULT) => {
          if (RESULT && RESULT.docs && RESULT.docs[0]) {
            const theJobs = RESULT.docs[0].jobs;
            RESOLVE(theJobs);
          }
          RESOLVE(0);
        })
        .catch((ERROR) => {
          REJECT(ERROR);
        });
    });
  }
}

module.exports = MasterQueue;
