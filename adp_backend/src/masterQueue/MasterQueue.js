/* eslint-disable prefer-destructuring */
// ============================================================================================= //
/**
* [ adp.masterQueue.MasterQueue ]
* Controller Class of Master Queue
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //

const prometheus = require('prom-client');
const errorLog = require('./../library/errorLog');
const { customMetrics } = require('../metrics/register');

class MasterQueueClass {
  constructor(RUNNERMODE = 'WORKER') {
    this.model = new adp.models.MasterQueue();
    this.packName = 'adp.MasterQueue';
    this.queueInProgress = false;
    this.queueInstances = 0;
    this.jobTimeStamp = 0;
    this.runnerMode = RUNNERMODE.trim().toUpperCase() === 'WORKER' ? 'WORKER' : 'MAIN';
    adp.echoLog(`[+${adp.timeStepNext()}] Master Queue [ ${RUNNERMODE} ] is ready!`, null, 200, this.packName);
  }


  /**
   * addJob
   * Method to add a new step on the queue
   * @param {string} COMMAND The function reference in the namespace.
   * @param {array} PARAMS Array of Parameters which will be passed as parameters.
   * @param {string} OBJECTIVE If this will be used in a job group,
   * the objective should be informed.
   * @param {integer} INDEX Order of this job case this is part of
   * a group of jobs, default is zero.
   * @param {integer} PRIORITY Default zero. Use bigger numbers to make
   * this job wait for the others.
   * @param {string} THERUNNER Default 'WORKER'. Use 'MAIN' to make the job
   * run on Main Backend ( only light jobs ).
   * @returns Promise resolve as true if successful or reject with a errorLog object if fails.
   * @author Armando Dias [zdiaarm]
   */
  addJob(MISSION, TARGET, COMMAND, PARAMS, OBJECTIVE, INDEX = 0, PRIORITY = 0, THERUNNER = 'WORKER') {
    return new Promise((RESOLVE, REJECT) => {
      this.model.already(MISSION, TARGET, OBJECTIVE, THERUNNER)
        .then((ISALREADYTHERE) => {
          if (ISALREADYTHERE === false) {
            this.model.add(MISSION, TARGET, COMMAND, PARAMS, OBJECTIVE, INDEX, PRIORITY, THERUNNER)
              .then((RESULT) => {
                if (RESULT && RESULT.status === true) {
                  const resultObject = RESULT;
                  if (!OBJECTIVE) {
                    resultObject.queueStatusLink = `${adp.config.siteAddress}/queue/${RESULT.queue}`;
                  } else {
                    resultObject.queueStatusLink = this.obtainObjectiveLink(OBJECTIVE);
                  }
                  RESOLVE(resultObject); // Command/params combination successful added on the queue
                  return;
                }
                const errorCode = RESULT.code ? RESULT.code : 500;
                const errorMessage = RESULT.message ? RESULT.message : 'Error on [ this.model.add ] when a true boolean is expected as result';
                const errorData = {
                  command: COMMAND,
                  params: PARAMS,
                  error: RESULT,
                };
                REJECT(errorLog(errorCode, errorMessage, errorData, 'addJob', this.packName));
              })
              .catch((ERROR) => {
                const errorCode = ERROR.code ? ERROR.code : 500;
                const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this.model.add ]';
                const errorData = {
                  command: COMMAND,
                  params: PARAMS,
                  error: ERROR,
                };
                REJECT(errorLog(errorCode, errorMessage, errorData, 'addJob', this.packName));
              });
          }
          if (ISALREADYTHERE !== false) {
            const resultObject = {
              statusMessage: 'Already in our queue, please access the queueStatusLink for more info.',
              queueStatusLink: ISALREADYTHERE,
            };
            RESOLVE(resultObject);
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.db.find ]';
          const errorData = {
            command: COMMAND,
            params: PARAMS,
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorData, 'addJob', this.packName));
        });
    });
  }


  /**
   * addJobs
   * Method to add multiple jobs connected by a common objective
   * @param {string} MISSION String to identify the mission of this job group.
   * @param {string} TARGET If this is about one item, use an indentifier here
   * ( like a microservice ID ). If is multiple, use something like "Multiple Microservices".
   * @param {string} OBJECTIVE A group name for the task group + a timestamp to become unique.
   * @param {array} COMMANDSANDPARAMS Array of objects, following the example:
   * [
   *  {
   *    COMMAND: The function reference in the namespace.
   *    PARAMS: Array of Parameters which will be passed as parameters.
   *  }
   * ]
   * @returns Promise resolve as true if successful or reject with a errorLog object if fails.
   * @author Armando Dias [zdiaarm]
   */
  addJobs(MISSION, TARGET, OBJECTIVE, COMMANDSANDPARAMS) {
    return new Promise((RESOLVE, REJECT) => {
      this.model.addMany(MISSION, TARGET, OBJECTIVE, COMMANDSANDPARAMS)
        .then((RESULT) => {
          if (RESULT && RESULT.status === true) {
            const resultObject = RESULT;
            resultObject.queueStatusLink = this.obtainObjectiveLink(OBJECTIVE);
            RESOLVE(resultObject); // Command/params combination successful added on the queue
            return;
          }
          const errorCode = RESULT.code ? RESULT.code : 500;
          const errorMessage = RESULT.message ? RESULT.message : 'Error on [ this.model.addObjective ] when a true boolean is expected as result';
          const errorData = {
            error: RESULT,
            objective: OBJECTIVE,
            commandsAndParams: COMMANDSANDPARAMS,
          };
          REJECT(errorLog(errorCode, errorMessage, errorData, 'addJobs', this.packName));
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this.model.addObjective ]';
          const errorData = {
            error: ERROR,
            objective: OBJECTIVE,
            commandsAndParams: COMMANDSANDPARAMS,
          };
          REJECT(errorLog(errorCode, errorMessage, errorData, 'addJobs', this.packName));
        });
    });
  }


  /**
   * startJobs
   * Request to start the queue process, check if is possible and then call _doJobs().
   * @param {boolean} RETAKE Default false. If true, it will bring
   * the object which started but not finished. Should be used only
   * at the boot of the Backend Application.
   * @returns Promise resolve as true if successful or reject with a errorLog object if fails.
   * @author Armando Dias [zdiaarm]
   */
  startJobs(RETAKE = false) {
    if (this.queueInstances < 0) {
      this.queueInstances = 0;
    }
    this.queueInstances += 1;
    if (this.queueInstances > 1) {
      this.queueInstances -= 1;
      return new Promise(RES => RES(true));
    }
    if (this.queueInProgress !== false) {
      return this.model.running(this.runnerMode)
        .then((RESULT) => {
          if (RESULT === true) {
            this.queueInstances -= 1;
            return new Promise(RES => RES(true));
          }
          this.queueInProgress = true;
          if (this.runnerMode !== 'MAIN') {
            adp.echoLog('Starting Queue: Looking for jobs...', null, 200, this.packName);
          }
          return this._doJobs();
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this.model.running ]';
          const errorData = {
            error: ERROR,
          };
          this.queueInstances -= 1;
          return new Promise((RES, REJ) => REJ(errorLog(errorCode, errorMessage, errorData, 'startJobs', this.packName)));
        });
    }
    this.queueInProgress = true;
    if (RETAKE === true) {
      if (this.runnerMode !== 'MAIN') {
        adp.echoLog('Starting "After Start" Queue: Looking for an unfinished job to be retake...', null, 200, this.packName);
      }
      return this._doJobs(true);
    }
    if (this.runnerMode !== 'MAIN') {
      adp.echoLog('Starting Queue: Looking for jobs...', null, 200, this.packName);
    }
    return this._doJobs()
      .catch((ERROR) => {
        const errorCode = ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this._doJobs() ]';
        const errorData = {
          error: ERROR,
        };
        this.queueInstances -= 1;
        return new Promise((RES, REJ) => REJ(errorLog(errorCode, errorMessage, errorData, 'startJobs', this.packName)));
      });
  }


  /**
   * _doJobs ( PRIVATE )
   * Start the queue process for real.
   * @param {boolean} RETAKE Default false. If true, it will bring
   * the object which started but not finished. Should be used only
   * at the boot of the Backend Application.
   * @returns Promise resolve as true if successful or reject with a errorLog object if fails.
   * @author Armando Dias [zdiaarm]
   */
  _doJobs(RETAKE = false) {
    this.queueInProgress = true;
    return new Promise((RESOLVE, REJECT) => {
      this._processStep(RETAKE)
        .then((RESULT) => {
          this.queueInProgress = false;
          let message = '';
          if (this.runnerMode !== 'MAIN') {
            if (RETAKE === true) {
              message = RESULT
                ? 'No job to be retaking was found.'
                : 'One job was ignored because reach the maximum number of attempts.';
            } else {
              message = 'Queue done for now.';
            }
            adp.echoLog(message, null, 200, this.packName);
          }
          this.queueInstances -= 1;
          RESOLVE();
        })
        .catch((ERROR) => {
          this.queueInProgress = false;
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error on [ this._processStep() ]';
          const errorData = {
            error: ERROR,
          };
          this.queueInstances -= 1;
          REJECT(errorLog(errorCode, errorMessage, errorData, '_doJobs', this.packName));
        });
    });
  }


  /**
   * _processStep ( PRIVATE )
   * Run step after step until the queue be completely empty.
   * @param {boolean} RETAKE Default false. If true, it will bring
   * the object which started but not finished. Should be used only
   * at the boot of the Backend Application.
   * @returns Promise resolve as true if successful or reject with a errorLog object if fails.
   * @author Armando Dias [zdiaarm]
   */
  _processStep(RETAKE = false) {
    return new Promise((RESOLVE, REJECT) => {
      const action = RETAKE === true ? 'retake' : 'next';
      this.model[action](this.runnerMode)
        .then((JOB) => {
          if (JOB === true || JOB === false) {
            RESOLVE(JOB);
            return;
          }
          if (!JOB) {
            REJECT();
            return;
          }
          this.model.duplicates(JOB, this.runnerMode)
            .then(() => {
              this.model.group(JOB)
                .then((QUEUESTATUS) => {
                  this._processJob(JOB, QUEUESTATUS)
                    .then(() => {
                      this._processStep()
                        .then((RESULT) => {
                          RESOLVE(RESULT);
                        })
                        .catch((ERROR) => {
                          const errorCode = ERROR.code ? ERROR.code : 500;
                          const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this._processStep() ]';
                          const errorData = {
                            action,
                            error: ERROR,
                          };
                          REJECT(errorLog(errorCode, errorMessage, errorData, '_processStep', this.packName));
                        });
                    })
                    .catch((ERROR) => {
                      const errorCode = ERROR.code ? ERROR.code : 500;
                      const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this._processJob(JOB) ]';
                      const errorData = {
                        action,
                        job: JOB,
                        error: ERROR,
                      };
                      REJECT(errorLog(errorCode, errorMessage, errorData, '_processStep', this.packName));
                    });
                })
                .catch((ERROR) => {
                  const errorCode = ERROR.code ? ERROR.code : 500;
                  const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this.model.queue(JOB) ]';
                  const errorData = {
                    action,
                    job: JOB,
                    error: ERROR,
                  };
                  REJECT(errorLog(errorCode, errorMessage, errorData, '_processStep', this.packName));
                });
            })
            .catch((ERROR) => {
              const errorCode = ERROR.code ? ERROR.code : 500;
              const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this.model.duplicates(JOB) ]';
              const errorData = {
                action,
                job: JOB,
                error: ERROR,
              };
              REJECT(errorLog(errorCode, errorMessage, errorData, '_processStep', this.packName));
            });
        })
        .catch((ERROR) => {
          this.queueInProgress = false;
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this.model[action]() ]';
          const errorData = {
            action,
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorData, '_processStep', this.packName));
        });
    });
  }


  /**
   * _processJob ( PRIVATE )
   * Run the JOB.
   * @returns Promise resolve as true if successful or reject with a errorLog object if fails.
   * @author Armando Dias [zdiaarm]
   */
  _processJob(JOB, QUEUESTATUS) {
    return new Promise((RESOLVE, REJECT) => {
      this.jobTimeStamp = (new Date()).getTime();
      let extraDataStart = '';
      let extraDataEnd = '';
      if (QUEUESTATUS && QUEUESTATUS.total > 0) {
        extraDataStart = ` ( ${QUEUESTATUS.running}/${QUEUESTATUS.total} jobs )`;
        extraDataEnd = `( ${QUEUESTATUS.running}/${QUEUESTATUS.total} jobs )`;
      }
      adp.echoLog(`Starting JOB [ ${JOB._id} ][ ${JOB.command} ]${extraDataStart}`, null, 300, this.packName, false);
      const { command, params, objective } = JOB;
      const commandParse = command.split('.');

      if (!Array.isArray(commandParse) || commandParse[0] !== 'adp') {
        return this._invalidCommandDetected(JOB)
          .then(() => {
            RESOLVE();
          })
          .catch((ERROR) => {
            const errorCode = ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this._invalidCommandDetected ]';
            const errorData = {
              error: ERROR,
              job: JOB,
            };
            REJECT(errorLog(errorCode, errorMessage, errorData, '_processJob', this.packName));
          });
      }

      let thisIsAValidCommand = true;
      let commandToExecute = null;
      const commandLength = commandParse.length;
      for (let index = 0; index < commandLength; index += 1) {
        if (index === 0) {
          commandToExecute = adp;
        } else {
          commandToExecute = commandToExecute[commandParse[index]];
        }
        if (!commandToExecute) {
          thisIsAValidCommand = false;
          break;
        }
      }

      if (thisIsAValidCommand) {
        return this._execute(commandToExecute, command, params, objective)
          .then((RESULT) => {
            const statusCode = RESULT && RESULT.statusCode ? RESULT.statusCode : 200;
            this._metrics(statusCode, JOB);
            const result = RESULT;
            delete result.statusCode;
            this.model.done(JOB._id, statusCode, result)
              .then(async () => {
                const timer = (new Date()).getTime() - this.jobTimeStamp;
                let waitFor = timer;
                if (adp.config.masterQueueBetweenJobsTime > 0) {
                  waitFor = adp.config.masterQueueBetweenJobsTime;
                }
                let timers = `A: ${timer}ms / R: ${waitFor}ms`;
                if (adp.config.masterQueueBetweenJobsTime === 0) {
                  timers = `A+R: ${timer * 2}ms`;
                } else if (adp.config.masterQueueBetweenJobsTime === 1) {
                  timers = `Action: ${timer}ms`;
                }
                adp.echoLog(`Finished JOB [ ${JOB._id} ][ ${JOB.command} ] ( ${timers} )${extraDataEnd}\n`, null, 300, this.packName, false);
                setTimeout(() => {
                  RESOLVE();
                }, waitFor);
              })
              .catch((ERROR) => {
                const errorCode2 = ERROR.code ? ERROR.code : 500;
                const errorMessage2 = ERROR.message ? ERROR.message : 'Error on [ this.model.done(JOBID, STATUSCODE, RESULT) ]';
                const errorData2 = {
                  error: ERROR,
                  jobid: JOB._id,
                  statusCode,
                  result,
                };
                // This error is not ok. The promise should be rejected.
                REJECT(errorLog(errorCode2, errorMessage2, errorData2, '_processJob', this.packName));
              });
          })
          .catch((ERROR) => {
            const errorCode = ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this._execute ]';
            const errorData = {
              error: ERROR,
              command,
              params,
            };
            this._metrics(errorCode, JOB);
            this.model.done(JOB._id, errorCode, errorData)
              .then(async () => {
                const timer = (new Date()).getTime() - this.jobTimeStamp;
                let waitFor = timer;
                if (adp.config.masterQueueBetweenJobsTime > 0) {
                  waitFor = adp.config.masterQueueBetweenJobsTime;
                }
                let timers = `A: ${timer}ms / R: ${waitFor}ms`;
                if (adp.config.masterQueueBetweenJobsTime === 0) {
                  timers = `A+R: ${timer * 2}ms`;
                } else if (adp.config.masterQueueBetweenJobsTime === 1) {
                  timers = `Action: ${timer}ms`;
                }
                adp.echoLog(`Finished JOB with errors [ ${JOB._id} ][ ${JOB.command} ]( ${timers} )${extraDataEnd}\n`, null, 300, this.packName, false);
                setTimeout(() => {
                  RESOLVE();
                }, waitFor);
              })
              .catch((ERROR2) => {
                const errorCode2 = ERROR.code ? ERROR.code : 500;
                const errorMessage2 = ERROR.message ? ERROR.message : 'Error on [ this.model.done(JOBID, STATUSCODE, RESULT) ]';
                const errorData2 = {
                  error: ERROR2,
                  jobid: JOB._id,
                  errorCode2,
                };
                // This error is not ok. The promise should be rejected.
                REJECT(errorLog(errorCode2, errorMessage2, errorData2, '_processJob', this.packName));
              });
            errorLog(errorCode, errorMessage, errorData, '_processJob', this.packName);
          });
      }
      const errorCode = 400;
      const errorMessage = 'The command found on the queue is not valid';
      const errorData = {
        command,
        params,
      };
      const errorObject = errorLog(errorCode, errorMessage, errorData, '_processJob', this.packName);
      REJECT(errorObject);
      return errorObject;
    });
  }


  /**
   * _invalidCommandDetected ( PRIVATE )
   * Prepares a message error if an invalid command is detected on the queue.
   * This method also set the error on the queue step on database.
   * Please notice this promise resolves because the queue can't stop because
   * found an wrong entry on the queue.
   * @returns Promise resolves if the error is correctly generated.
   * @author Armando Dias [zdiaarm]
   */
  _invalidCommandDetected(JOB) {
    return new Promise((RESOLVE, REJECT) => {
      const errorCode = 400;
      const errorMessage = 'Invalid command in the queue';
      const errorData = {
        error: `job.command should be a string, starting with the root of the namespace: 'adp'. Found '${JOB.command}' instead.`,
        job: JOB,
      };
      errorLog(errorCode, errorMessage, errorData, '_invalidCommandDetected', this.packName);
      return this.model.done(JOB._id, errorCode, errorData.error)
        .then(() => {
          RESOLVE(); // The error was generated successful at this point.
        })
        .catch((ERROR) => {
          const errorCode2 = ERROR.code ? ERROR.code : 500;
          const errorMessage2 = ERROR.message ? ERROR.message : 'Error on [ this.model.done ]';
          const errorData2 = {
            error: ERROR,
            job: JOB,
          };
          // This error is not ok. The promise should be rejected.
          REJECT(errorLog(errorCode2, errorMessage2, errorData2, '_invalidCommandDetected', this.packName));
        });
    });
  }


  /**
   * _execute ( PRIVATE )
   * Run the command with parameters (If given)
   * @param {function} COMMAND The command reference from nameSpace
   * @param {string} COMMANDNAME The string with the name of the command
   * @param {Array} PARAMS Array of parameters
   * @param {string} OBJECTIVE Case you are using job groups
   * @returns Promise resolves if the command is successful. Otherwise rejects.
   * @author Armando Dias [zdiaarm]
   */
  _execute(COMMAND, COMMANDNAME, PARAMS, OBJECTIVE) {
    const params = PARAMS;
    if (OBJECTIVE && Array.isArray(PARAMS)) {
      params.push(OBJECTIVE);
    }
    return new Promise((RESOLVE, REJECT) => {
      if (Array.isArray(params)) {
        return COMMAND(...params)
          .then((RESULT) => {
            RESOLVE(RESULT);
          })
          .catch((ERROR) => {
            const errorCode = ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR.message ? ERROR.message : `Error on [ QUEUE :: ${COMMANDNAME} ]`;
            const errorData = {
              error: ERROR,
              command: COMMAND,
              commandName: COMMANDNAME,
              params: PARAMS,
              objective: OBJECTIVE,
            };
            REJECT(errorLog(errorCode, errorMessage, errorData, '_execute', this.packName));
          });
      }
      if (!PARAMS) {
        return COMMAND(OBJECTIVE)
          .then((RESULT) => {
            RESOLVE(RESULT);
          })
          .catch((ERROR) => {
            const errorCode = ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR.message ? ERROR.message : `Error on [ QUEUE :: ${COMMANDNAME} ]`;
            const errorData = {
              error: ERROR,
              command: COMMAND,
              commandName: COMMANDNAME,
              params: PARAMS,
              objective: OBJECTIVE,
            };
            REJECT(errorLog(errorCode, errorMessage, errorData, '_execute', this.packName));
          });
      }
      return COMMAND(params)
        .then((RESULT) => {
          RESOLVE(RESULT);
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message : `Error on [ QUEUE :: ${COMMANDNAME} ]`;
          const errorData = {
            error: ERROR,
            command: COMMAND,
            commandName: COMMANDNAME,
            params: PARAMS,
            objective: OBJECTIVE,
          };
          REJECT(errorLog(errorCode, errorMessage, errorData, '_execute', this.packName));
        });
    });
  }


  /**
   * groupResult
   * Retrieve the result of all jobs of a group
   * @param {string} OBJECTIVE The objective name ( Group ID )
   * @returns Promise resolves with the result from database
   * @author Armando Dias [zdiaarm]
   */
  groupResult(OBJECTIVE) {
    return new Promise((RESOLVE, REJECT) => {
      this.model.groupResult(OBJECTIVE)
        .then((RESULT) => {
          RESOLVE(RESULT);
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this.model.groupResult ]';
          const errorData = {
            objective: OBJECTIVE,
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorData, 'status', this.packName));
        });
    });
  }


  /**
   * status
   * Retrieve the status of a queue job using the ID
   * @param {string} ID The ID of the JOB in the queue
   * @returns Promise resolves with the result from database
   * @author Armando Dias [zdiaarm]
   */
  status(ID) {
    return new Promise((RESOLVE, REJECT) => {
      this.model.status(ID)
        .then((RESULT) => {
          RESOLVE(RESULT);
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this.model.status ]';
          const errorData = {
            id: ID,
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorData, 'status', this.packName));
        });
    });
  }


  getPayload(OBJECTIVE) {
    return new Promise((RESOLVE, REJECT) => {
      this.model.getPayload(OBJECTIVE)
        .then((RESULT) => {
          RESOLVE(RESULT);
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this.model.status ]';
          const errorData = {
            objective: OBJECTIVE,
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorData, 'getPayload', this.packName));
        });
    });
  }


  setPayload(OBJECTIVE, OBJECT) {
    return new Promise((RESOLVE, REJECT) => {
      this.model.setPayload(OBJECTIVE, OBJECT)
        .then((RESULT) => {
          RESOLVE(RESULT);
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this.model.status ]';
          const errorData = {
            objective: OBJECTIVE,
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorData, 'getPayload', this.packName));
        });
    });
  }


  /**
   * groupHeader
   * Retrieve the first instance of a group
   * @param {string} OBJECTIVE The OBJECTIVE of the Group Queue
   * @returns Promise resolves with the result from database
   * @author Armando Dias [zdiaarm]
   */
  groupHeader(OBJECTIVE) {
    return this.model.groupHeader(OBJECTIVE);
  }


  /**
   * queueStatusCodeToString
   * Write a friendly text about the status code.
   * @param {number} CODE The status code
   * @returns String with the text.
   * @author Armando Dias [zdiaarm]
   */
  queueStatusCodeToString(CODE) {
    return this.model.queueStatusCodeToString(CODE);
  }

  /**
   * groupStatus
   * Retrieve the status of a group queue using a V2.0 ID
   * @param {string} ID The ID of the Group Queue
   * @param {string} OBJECTIVE If you don't have the ID,
   * you can use the Objective of the queue.
   * @returns Promise resolves with the result from database
   * @author Armando Dias [zdiaarm]
   */
  groupStatus(ID, OBJECTIVE = null) {
    let objective = OBJECTIVE;
    if (!objective) {
      objective = this.obtainObjectiveFromV2ID(ID);
    }
    const queueStatusLink = `${adp.config.siteAddress}/queue/${ID}`;
    const action = () => new Promise((RESOLVE, REJECT) => {
      this.model.currentStatus(objective)
        .then((CURRENTSTATUS) => {
          const { currentStatus, percentage } = CURRENTSTATUS;
          this.model.getPayload(objective)
            .then((PAYLOAD) => {
              if (!PAYLOAD) {
                this.model.groupHeader(objective)
                  .then((GROUPHEADER) => {
                    const groupHeader = GROUPHEADER
                      && Array.isArray(GROUPHEADER.docs)
                      && GROUPHEADER.docs[0]
                      && GROUPHEADER.docs[0].data
                      ? GROUPHEADER.docs[0].data
                      : GROUPHEADER;
                    const answer = groupHeader;
                    answer.currentStatus = currentStatus;
                    answer.percentage = percentage;

                    if (answer.status === undefined) {
                      const purePercentage = parseInt(answer.percentage, 10);
                      if (purePercentage <= 0) {
                        answer.status = 0;
                      } else if (purePercentage > 0 && purePercentage === 100) {
                        answer.status = 200;
                      } else {
                        answer.status = 1;
                      }
                    }
                    if (answer.status < 100) {
                      const purePercentage = parseInt(answer.percentage, 10);
                      if (purePercentage > 0 && purePercentage < 100) {
                        answer.queueStatusLink = queueStatusLink;
                        answer.status = 1;
                        answer.message = 'Status 1: Running...';
                      }
                    }
                    RESOLVE(answer);
                  })
                  .catch((ERROR) => {
                    const errorCode = ERROR.code ? ERROR.code : 500;
                    const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this.model.groupHeader ]';
                    const errorData = {
                      id: ID,
                      objective,
                      error: ERROR,
                    };
                    REJECT(errorLog(errorCode, errorMessage, errorData, 'groupStatus', this.packName));
                  });
              } else if (PAYLOAD && PAYLOAD.status <= 99) { // Waiting or Running...
                const answer = {
                  status: PAYLOAD.status,
                  statusMessage: this.model.queueStatusCodeToString(PAYLOAD.status),
                  currentStatus,
                  percentage,
                  queueStatusLink,
                };
                RESOLVE(answer);
              } else if (PAYLOAD && PAYLOAD.status > 99) { // Group Job Done!
                this.model.groupEnd(objective)
                  .then((RESULT) => {
                    const result = RESULT;
                    result.currentStatus = currentStatus;
                    result.percentage = percentage;
                    result.status = PAYLOAD.status;
                    result.statusMessage = this.model.queueStatusCodeToString(PAYLOAD.status);
                    RESOLVE(result);
                  })
                  .catch((ERROR) => {
                    const errorCode = ERROR.code ? ERROR.code : 500;
                    const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this.model.groupEnd ]';
                    const errorData = {
                      id: ID,
                      objective,
                      error: ERROR,
                    };
                    REJECT(errorLog(errorCode, errorMessage, errorData, 'groupStatus', this.packName));
                  });
              } else {
                RESOLVE(PAYLOAD);
              }
            })
            .catch((ERROR) => {
              const errorCode = ERROR.code ? ERROR.code : 500;
              const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this.model.getPayload ]';
              const errorData = {
                id: ID,
                objective,
                error: ERROR,
              };
              REJECT(errorLog(errorCode, errorMessage, errorData, 'groupStatus', this.packName));
            });
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message : 'Error on [ this.model.currentStatus ]';
          const errorData = {
            id: ID,
            objective,
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorData, 'groupStatus', this.packName));
        });
    });

    return new Promise((RESOLVE, REJECT) => {
      let theReport;
      let tries = 3;
      const checker = () => action()
        .then((REPORT) => {
          theReport = REPORT;
          const checkA = theReport.status > 99;
          const checkB = theReport.requestedAt === undefined;
          const checkC = theReport.startedAt === undefined;
          const checkD = theReport.finishedAt === undefined;
          if (tries > 0 && checkA && (checkB || checkC || checkD)) {
            tries -= 1;
            checker();
            return;
          }
          RESOLVE(theReport);
        })
        .catch(ERROR => REJECT(ERROR));
      checker();
    });
  }

  /**
   * currentStatus
   * Returns a Promise which results in an object { currentStatus, percentage }
   * to represent the current status of the group queue based on given objective.
   * @param {string} OBJECTIVE The unique string used to identify a Group in the Queue
   * @returns Promise with { currentStatus, percentage } object.
   * @author Armando Dias [zdiaarm]
   */
  currentStatus(OBJECTIVE) {
    return this.model.currentStatus(OBJECTIVE);
  }

  /**
   * obtainObjectiveLink
   * Generates the link to access the queue status
   * @param {string} OBJECTIVE The unique string used to
   * identify a Group in the Queue
   * @returns String with the URL if successful or null if fails.
   * @author Armando Dias [zdiaarm]
   */
  obtainObjectiveLink(OBJECTIVE, V1 = false) {
    try {
      if (V1 === false) {
        const buffer = Buffer.from(OBJECTIVE);
        const queueId = `V2.0_${buffer.toString('base64')}`;
        const queueStatusLink = `${adp.config.siteAddress}/queue/${queueId}`;
        return queueStatusLink;
      }
      const queueStatusLink = `${adp.config.siteAddress}/queue/${OBJECTIVE}`;
      return queueStatusLink;
    } catch (ERROR) {
      const errorCode = ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR.message ? ERROR.message : 'Error on [ try/catch ]';
      const errorData = {
        objective: OBJECTIVE,
        error: ERROR,
      };
      errorLog(errorCode, errorMessage, errorData, 'obtainObjectiveLink', this.packName);
      return null;
    }
  }


  /**
   * obtainObjectiveFromV2ID
   * Convert the format "V2.0_Base64String" to simple text
   * @param {string} ID The ID from V2.0 Queue Link ( "V2.0_Base64String" ).
   * @returns String with the value of the objective.
   * @author Armando Dias [zdiaarm]
   */
  obtainObjectiveFromV2ID(ID) {
    try {
      const base64ID = ID.substring(5);
      const buff = Buffer.from(base64ID, 'base64');
      const objective = buff.toString('ascii');
      return objective;
    } catch (ERROR) {
      const errorCode = ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR.message ? ERROR.message : 'Error on [ try/catch ]';
      const errorData = {
        id: ID,
        error: ERROR,
      };
      errorLog(errorCode, errorMessage, errorData, 'obtainObjectiveFromV2ID', this.packName);
      return null;
    }
  }


  /**
   * _metrics ( PRIVATE )
   * Prepares data to expose to Prometheus Metrics
   * @param {integer} CODE Server Status Code ( 200, 400, 404, 500, etc )
   * @param {object} JOB The JOB Object
   * @author Armando Dias [zdiaarm]
   */
  _metrics(CODE, JOB) {
    try {
      const thisCode = CODE;
      const thisMission = (`${JOB.mission}`).toLowerCase().trim();
      const thisRunnerMode = (`${this.runnerMode}`).toLowerCase().trim();
      const thisMetricObjectName = `MasterQueue_${thisMission}`;
      if (customMetrics && !customMetrics[thisMetricObjectName]) {
        const queueMetric = new prometheus.Histogram({
          name: `adp_${thisRunnerMode}_masterqueue_mission_${thisMission}`,
          help: `ADP Portal ${this.runnerMode} - Master Queue Job Result for the mission ${JOB.mission}`,
          buckets: [],
          labelNames: ['statusCode'],
        });
        customMetrics[thisMetricObjectName] = queueMetric;
      }
      customMetrics[thisMetricObjectName].observe({ statusCode: thisCode }, 1);
    } catch (ERROR) {
      const errorCode = ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR.message ? ERROR.message : 'Error on [ try/catch ]';
      const errorData = {
        error: ERROR,
        code: CODE,
        job: JOB,
      };
      errorLog(errorCode, errorMessage, errorData, '_metrics', this.packName);
    }
  }

  /**
   * getNextIndex
   * Retrieve from the database the next index from database based on
   * Objective. Should be used case the addJobs is called more than
   * once per Objective in different executions.
   * @param {string} OBJECTIVE A group name for the task group + a timestamp to become unique.
   * @returns Promise resolve with a number if successful or reject with a errorLog object if fails.
   * @author Armando Dias [zdiaarm]
   */
  getNextIndex(OBJECTIVE) {
    return new Promise((RESOLVE, REJECT) => {
      this.model.getNextIndex(OBJECTIVE)
        .then((INDEX) => {
          RESOLVE(INDEX);
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message : 'Error on [ promise/catch ]';
          const errorData = {
            error: ERROR,
            code: errorCode,
            message: errorMessage,
          };
          REJECT(errorLog(errorCode, errorMessage, errorData, 'getNextIndex', this.packName));
        });
    });
  }


  /**
   * getGroupStatus
   * Retrieve a list of the status codes of
   * the all jobs from an Objective
   * @param {string} OBJECTIVE The Group JOB id.
   * @returns Object with the results in a JSON Object.
   * @author Armando Dias [zdiaarm]
   */
  getGroupStatus(OBJECTIVE) {
    let groupStatus = 0;
    return this.model.getObjectiveStatusCodes(OBJECTIVE)
      .then((STATUS) => {
        const allKeys = Object.keys(STATUS);
        const haveStatusZero = allKeys.includes('0');
        const haveStatusOne = allKeys.includes('1');
        if (!haveStatusZero && !haveStatusOne) {
          const have200 = allKeys.includes('200');
          const have400 = allKeys.includes('400');
          const have404 = allKeys.includes('404');
          const have500 = allKeys.includes('500');
          const othersThan200 = [];
          const ignoreTheseCodes = ['0', '1', '2', '3', '200'];
          allKeys.forEach((THESTATUS) => {
            if (!ignoreTheseCodes.includes(THESTATUS)) {
              othersThan200.push(THESTATUS);
            }
          });
          if (have200 && othersThan200.length === 0) {
            groupStatus = 200;
          } else if (have400) {
            groupStatus = 400;
          } else if (have404) {
            groupStatus = 404;
          } else if (have500) {
            groupStatus = 500;
          } else if (othersThan200.length > 0) {
            groupStatus = othersThan200[0];
          }
        } else if (haveStatusOne) {
          groupStatus = 1;
        }
        return groupStatus;
      });
  }
}


module.exports = MasterQueueClass;
