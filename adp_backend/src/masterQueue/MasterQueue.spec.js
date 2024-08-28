// ============================================================================================= //
/**
* Unit test for [ adp.masterQueue.MasterQueue ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
class MockMasterQueueModel {
  already() {
    let obj = null;
    return new Promise((RES, REJ) => {
      switch (adp.behaviorController.already) {
        case 1:
          RES({ OBJ: true });
          break;
        case 2:
          obj = {
            mockError: 'mockError',
          };
          REJ(obj);
          break;
        default:
          RES(false);
          break;
      }
    });
  }


  add() {
    let obj = null;
    return new Promise((RES, REJ) => {
      switch (adp.behaviorController.add) {
        case 1:
          obj = {
            status: true,
            queue: 'mockQueueID',
          };
          RES(obj);
          break;
        case 2:
          obj = {
            mockError: 'mockError',
          };
          REJ(obj);
          break;
        default:
          obj = {
            status: false,
          };
          RES(obj);
          break;
      }
    });
  }


  addMany() {
    let obj = null;
    return new Promise((RES, REJ) => {
      switch (adp.behaviorController.addMany) {
        case 1:
          obj = {
            status: true,
            queue: 'mockQueueID',
          };
          RES(obj);
          break;
        case 2:
          obj = {
            mockError: 'mockError',
          };
          REJ(obj);
          break;
        default:
          obj = {
            status: false,
          };
          RES(obj);
          break;
      }
    });
  }


  next() {
    let obj = null;
    return new Promise((RES, REJ) => {
      switch (adp.behaviorController.next) {
        case 1:
          obj = {
            status: true,
            queue: 'mockQueueID',
          };
          RES(obj);
          break;
        case 2:
          obj = {
            mockError: 'mockError',
          };
          REJ(obj);
          break;
        case 3:
          RES(false);
          break;
        case 4:
          RES(null);
          break;
        case 'END':
          RES(true);
          break;
        case 'TWO-COMMANDS-IN-QUEUE':
          obj = {
            command: 'adp.mock.command',
            params: [1],
          };
          RES(adp.clone(obj));
          obj = {
            command: 'adp.mock.command',
            params: [1, 2],
          };
          adp.behaviorController.next = adp.clone(obj);
          break;
        default:
          RES(adp.clone(adp.behaviorController.next));
          adp.behaviorController.next = 'END';
          break;
      }
    });
  }


  retake() {
    let obj = null;
    return new Promise((RES, REJ) => {
      switch (adp.behaviorController.retake) {
        case 1:
          obj = {
            status: true,
            queue: 'mockQueueID',
          };
          RES(obj);
          break;
        case 2:
          obj = {
            mockError: 'mockError',
          };
          REJ(obj);
          break;
        case 'END':
          RES(true);
          break;
        default:
          RES(adp.clone(adp.behaviorController.retake));
          adp.behaviorController.retake = 'END';
          break;
      }
    });
  }


  duplicates() {
    let obj = null;
    return new Promise((RES, REJ) => {
      switch (adp.behaviorController.duplicates) {
        case 1:
          obj = { thisIsADuplicate: true };
          REJ(obj);
          break;
        default:
          RES();
          break;
      }
    });
  }


  done() {
    let obj = null;
    return new Promise((RES, REJ) => {
      switch (adp.behaviorController.done) {
        case 1:
          obj = {
            status: true,
            queue: 'mockQueueID',
          };
          RES(obj);
          break;
        case 2:
          obj = {
            mockError: 'mockError',
          };
          REJ(obj);
          break;
        default:
          RES();
          break;
      }
    });
  }


  running() {
    let obj = null;
    return new Promise((RES, REJ) => {
      switch (adp.behaviorController.running) {
        case 1:
          RES(true);
          break;
        case 2:
          obj = {
            mockError: 'mockError',
          };
          REJ(obj);
          break;
        default:
          RES(false);
          break;
      }
    });
  }


  status() {
    let obj = null;
    return new Promise((RES, REJ) => {
      switch (adp.behaviorController.status) {
        case 1:
          obj = { mockError: true };
          REJ(obj);
          break;
        default:
          RES(true);
          break;
      }
    });
  }


  group() {
    let obj = null;
    return new Promise((RES, REJ) => {
      switch (adp.behaviorController.group) {
        case 1:
          obj = { mockError: true };
          REJ(obj);
          break;
        default:
          RES(true);
          break;
      }
    });
  }


  queueStatusCodeToString() {
    let obj = null;
    return new Promise((RES, REJ) => {
      switch (adp.behaviorController.queueStatusCodeToString) {
        case 1:
          obj = { mockError: true };
          REJ(obj);
          break;
        default:
          RES('mockResult');
          break;
      }
    });
  }


  currentStatus() {
    let obj = null;
    return new Promise((RES, REJ) => {
      switch (adp.behaviorController.currentStatus) {
        case 1:
          obj = { mockError: true };
          REJ(obj);
          break;
        default:
          RES(true);
          break;
      }
    });
  }


  groupHeader() {
    let obj = null;
    return new Promise((RES, REJ) => {
      switch (adp.behaviorController.groupHeader) {
        case 1:
          obj = { mockError: true };
          REJ(obj);
          break;
        case 2:
          obj = { docs: [{ data: { currentStatus: 'mock', percentage: '95.75' } }] };
          RES(obj);
          break;
        default:
          RES('mockResult');
          break;
      }
    });
  }


  setPayload() {
    let obj = null;
    return new Promise((RES, REJ) => {
      switch (adp.behaviorController.setPayload) {
        case 1:
          obj = { mockError: true };
          REJ(obj);
          break;
        default:
          RES('mockResult');
          break;
      }
    });
  }


  getPayload() {
    let obj = null;
    return new Promise((RES, REJ) => {
      switch (adp.behaviorController.getPayload) {
        case 1:
          obj = { mockError: true };
          REJ(obj);
          break;
        case 2:
          RES(undefined);
          break;
        case 3:
          RES({ status: 1 });
          break;
        case 4:
          RES({ status: 200 });
          break;
        default:
          RES('mockResult');
          break;
      }
    });
  }


  groupResult() {
    let obj = null;
    return new Promise((RES, REJ) => {
      switch (adp.behaviorController.groupResult) {
        case 1:
          obj = { mockError: true };
          REJ(obj);
          break;
        default:
          RES('mockResult');
          break;
      }
    });
  }


  groupEnd() {
    let obj = null;
    return new Promise((RES, REJ) => {
      switch (adp.behaviorController.groupEnd) {
        case 1:
          obj = { mockError: true };
          REJ(obj);
          break;
        default:
          RES({});
          break;
      }
    });
  }
}
// ============================================================================================= //
describe('Testing of [ adp.masterQueue.MasterQueue ] behavior', () => {
  // =========================================================================================== //
  beforeEach(() => {
    global.adp = {};
    adp.clone = OBJ => JSON.parse(JSON.stringify(OBJ));
    adp.config = {};
    adp.config.siteAddress = 'https://mockLink';
    adp.config.masterQueueBetweenJobsTime = 0;
    global.adp.config.workerInstance = false;
    adp.behaviorController = {
      already: 0,
      add: 1,
      addMany: 1,
      next: {
        command: 'adp.mock.command',
        params: [1],
      },
      duplicates: 0,
      command: 0,
      done: 0,
      running: 0,
      retake: {
        command: 'adp.mock.command',
        params: [1],
      },
      status: 0,
      group: 0,
      currentStatus: 0,
      queueStatusCodeToString: 0,
      groupHeader: 0,
      setPayload: 0,
      getPayload: 0,
      groupResult: 0,
      groupEnd: 0,
    };
    adp.mock = {};
    adp.mock.commandExecuted = false;
    adp.mock.command = () => {
      adp.mock.commandExecuted = true;
      return new Promise((RES, REJ) => {
        let obj;
        switch (adp.behaviorController.command) {
          case 1:
            obj = { mockError: true };
            REJ(obj);
            break;
          case 'CRASH-AT-SECOND-RUN':
            RES({ mockSuccess: true });
            adp.behaviorController.command = 1;
            break;
          default:
            RES({ mockSuccess: true });
            break;
        }
      });
    };
    adp.mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });
    adp.echoLog = () => {};
    adp.models = {};
    adp.models.MasterQueue = MockMasterQueueModel;
    adp.timeStepNext = () => '';
    adp.masterQueue = {};
    adp.masterQueue.MasterQueue = proxyquire('./MasterQueue', {
      '../library/errorLog': adp.mockErrorLog,
    });
  });

  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ addJob ] in a successful case.', (done) => {
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.addJob('adp.mock.command', [1])
      .then((RESULT) => {
        expect(RESULT.status).toEqual(true);
        expect(RESULT.queue).toEqual('mockQueueID');
        expect(RESULT.queueStatusLink).toEqual('https://mockLink/queue/mockQueueID');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ addJob ] case is not possible to save the request in database.', (done) => {
    adp.behaviorController.add = 0;
    global.adp.config.workerInstance = true;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.addJob('adp.mock.command', [1])
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('addJob');
        expect(ERROR.packName).toEqual('adp.MasterQueue');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ addJob ] case [ this.model.add ] rejects the request.', (done) => {
    adp.behaviorController.add = 2;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.addJob('adp.mock.command', [1])
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('addJob');
        expect(ERROR.packName).toEqual('adp.MasterQueue');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ addJob ] case the request is already waiting in database.', (done) => {
    adp.behaviorController.already = 1;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.addJob('adp.mock.command', [1])
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ addJob ] case [ this.model.already ] rejects the request.', (done) => {
    adp.behaviorController.already = 2;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.addJob('adp.mock.command', [1])
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('addJob');
        expect(ERROR.packName).toEqual('adp.MasterQueue');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ startJobs ] in a successful case.', (done) => {
    global.adp.config.workerInstance = true;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.startJobs()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ startJobs ] in a successful case when global.adp.config.workerInstance = false;', (done) => {
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.startJobs()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ startJobs ] in a successful case ( Queued command with parameters which are not an Array ).', (done) => {
    global.adp.config.workerInstance = true;
    adp.behaviorController.next = {
      command: 'adp.mock.command',
      params: 1,
    };
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.startJobs()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ startJobs ] in a successful case ( Queued command without parameters ).', (done) => {
    global.adp.config.workerInstance = true;
    adp.behaviorController.next = {
      command: 'adp.mock.command',
      params: undefined,
    };
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.startJobs()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ startJobs ] if [ this.model.next ] returns false.', (done) => {
    global.adp.config.workerInstance = true;
    adp.behaviorController.next = 3;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.startJobs()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ startJobs ] if [ this.model.next ] returns null.', (done) => {
    global.adp.config.workerInstance = true;
    adp.behaviorController.next = 4;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.startJobs()
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('startJobs');
        expect(ERROR.packName).toEqual('adp.MasterQueue');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ startJobs ] if queue looks like already in progress (and it is).', (done) => {
    global.adp.config.workerInstance = true;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.queueInProgress = true;
    adp.behaviorController.running = 1;
    adp.queue.startJobs()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ startJobs ] if queue looks like already in progress (and it is not).', (done) => {
    global.adp.config.workerInstance = true;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.queueInProgress = true;
    adp.queue.startJobs()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ startJobs ] if queue looks like already in progress (and [ this.model.running() ] breaks).', (done) => {
    global.adp.config.workerInstance = true;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.queueInProgress = true;
    adp.behaviorController.running = 2;
    adp.queue.startJobs()
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('startJobs');
        expect(ERROR.packName).toEqual('adp.MasterQueue');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ startJobs ] if [ this._doJobs() ] breaks.', (done) => {
    global.adp.config.workerInstance = true;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.behaviorController.next = 2;
    adp.queue.startJobs()
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('startJobs');
        expect(ERROR.packName).toEqual('adp.MasterQueue');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ startJobs ] in a successful case in RETAKE mode.', (done) => {
    global.adp.config.workerInstance = true;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.startJobs(true)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ startJobs ] if [ this.model.retake() ] breaks.', (done) => {
    global.adp.config.workerInstance = true;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.behaviorController.retake = 2;
    adp.queue.startJobs(true)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('_doJobs');
        expect(ERROR.packName).toEqual('adp.MasterQueue');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ startJobs ] if [ this.model.duplicates ] rejects.', (done) => {
    global.adp.config.workerInstance = true;
    adp.behaviorController.duplicates = 1;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.startJobs()
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('startJobs');
        expect(ERROR.packName).toEqual('adp.MasterQueue');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ startJobs ] if the queued command is invalid.', (done) => {
    global.adp.config.workerInstance = true;
    adp.behaviorController.next = {
      command: 'wrong.mock.command',
      params: [0],
    };
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.startJobs()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ startJobs ] if the queued command is invalid and [ this.model.done ] crashes.', (done) => {
    global.adp.config.workerInstance = true;
    adp.behaviorController.next = {
      command: 'wrong.mock.command',
      params: [0],
    };
    adp.behaviorController.done = 2;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.startJobs()
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('startJobs');
        expect(ERROR.packName).toEqual('adp.MasterQueue');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ startJobs ] if the queued command ( There is no parameters ) is invalid and [ this.model.done ] crashes.', (done) => {
    global.adp.config.workerInstance = true;
    adp.behaviorController.next = {
      command: 'wrong.mock.command',
      params: undefined,
    };
    adp.behaviorController.done = 2;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.startJobs()
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('startJobs');
        expect(ERROR.packName).toEqual('adp.MasterQueue');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ startJobs ] if the queued command is not in memory.', (done) => {
    global.adp.config.workerInstance = true;
    adp.mock.command = undefined;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.startJobs()
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        expect(ERROR.origin).toEqual('startJobs');
        expect(ERROR.packName).toEqual('adp.MasterQueue');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ startJobs ] if [ this.model.done ] crashes.', (done) => {
    global.adp.config.workerInstance = true;
    adp.behaviorController.done = 2;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.startJobs()
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('startJobs');
        expect(ERROR.packName).toEqual('adp.MasterQueue');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ status ] in a successful case.', (done) => {
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.status('MOCKID')
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ status ] if [ this.model.status ] crashes.', (done) => {
    adp.behaviorController.status = 1;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.status('MOCKID')
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('status');
        expect(ERROR.packName).toEqual('adp.MasterQueue');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ obtainObjectiveLink ] in a successful case.', (done) => {
    try {
      adp.queue = new adp.masterQueue.MasterQueue();
      const result = adp.queue.obtainObjectiveLink('UniqueMockStringObjectiveID_20220222');

      expect(result).toEqual('https://mockLink/queue/V2.0_VW5pcXVlTW9ja1N0cmluZ09iamVjdGl2ZUlEXzIwMjIwMjIy');
      done();
    } catch (error) {
      done.fail();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ obtainObjectiveLink ] crashes because a wrong parameter.', (done) => {
    try {
      adp.queue = new adp.masterQueue.MasterQueue();
      const result = adp.queue.obtainObjectiveLink({});

      expect(result).toBeNull();
      done();
    } catch (error) {
      done.fail();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ currentStatus ] in a successful case.', (done) => {
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.currentStatus('MOCKID')
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ currentStatus ] if [ this.model.currentStatus ] crashes.', (done) => {
    adp.behaviorController.currentStatus = 1;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.currentStatus('MOCKID')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ queueStatusCodeToString ] in a successful case.', (done) => {
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.queueStatusCodeToString('MockString')
      .then((result) => {
        expect(result).toEqual('mockResult');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ queueStatusCodeToString ] if crashes.', (done) => {
    adp.behaviorController.queueStatusCodeToString = 1;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.queueStatusCodeToString('MockString')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ groupHeader ] in a successful case.', (done) => {
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.groupHeader('MockString')
      .then((result) => {
        expect(result).toEqual('mockResult');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ groupHeader ] if crashes.', (done) => {
    adp.behaviorController.groupHeader = 1;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.groupHeader('MockString')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ setPayload ] in a successful case.', (done) => {
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.setPayload('Objective', { object: true })
      .then((result) => {
        expect(result).toEqual('mockResult');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ setPayload ] if crashes.', (done) => {
    adp.behaviorController.setPayload = 1;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.setPayload('Objective', { object: true })
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ getPayload ] in a successful case.', (done) => {
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.getPayload('Objective')
      .then((result) => {
        expect(result).toEqual('mockResult');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ getPayload ] if crashes.', (done) => {
    adp.behaviorController.getPayload = 1;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.getPayload('Objective')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ groupResult ] in a successful case.', (done) => {
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.groupResult('Objective')
      .then((result) => {
        expect(result).toEqual('mockResult');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ groupResult ] if crashes.', (done) => {
    adp.behaviorController.groupResult = 1;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.groupResult('Objective')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ addJobs ] in a successful case.', (done) => {
    adp.queue = new adp.masterQueue.MasterQueue();
    const mission = 'mockMission';
    const target = 'mockTarget';
    const objective = 'mockObjective';
    const commandsArray = [{ commandsArray: true }, { commandsArray: true }];
    adp.queue.addJobs(mission, target, objective, commandsArray)
      .then((result) => {
        expect(result).toEqual({ status: true, queue: 'mockQueueID', queueStatusLink: 'https://mockLink/queue/V2.0_bW9ja09iamVjdGl2ZQ==' });
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ addJobs ] if [ this.model.addMany ] returns an invalid result.', (done) => {
    adp.behaviorController.addMany = 0;
    adp.queue = new adp.masterQueue.MasterQueue();
    const mission = 'mockMission';
    const target = 'mockTarget';
    const objective = 'mockObjective';
    const commandsArray = [{ commandsArray: true }, { commandsArray: true }];
    adp.queue.addJobs(mission, target, objective, commandsArray)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('addJobs');
        expect(ERROR.packName).toEqual('adp.MasterQueue');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ addJobs ] if [ this.model.addMany ] crashes.', (done) => {
    adp.behaviorController.addMany = 2;
    adp.queue = new adp.masterQueue.MasterQueue();
    const mission = 'mockMission';
    const target = 'mockTarget';
    const objective = 'mockObjective';
    const commandsArray = [{ commandsArray: true }, { commandsArray: true }];
    adp.queue.addJobs(mission, target, objective, commandsArray)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('addJobs');
        expect(ERROR.packName).toEqual('adp.MasterQueue');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ groupStatus ] in a successful case.', (done) => {
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.groupStatus('MockID')
      .then((result) => {
        expect(result).toEqual('mockResult');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ groupStatus ] if [ this.model.currentStatus ] crashes.', (done) => {
    adp.behaviorController.currentStatus = 1;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.groupStatus('MockID')
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toEqual('Error on [ this.model.currentStatus ]');
        expect(ERROR.origin).toEqual('groupStatus');
        expect(ERROR.packName).toEqual('adp.MasterQueue');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ groupStatus ] if [ this.model.getPayload ] crashes.', (done) => {
    adp.behaviorController.getPayload = 1;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.groupStatus('MockID')
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toEqual('Error on [ this.model.getPayload ]');
        expect(ERROR.origin).toEqual('groupStatus');
        expect(ERROR.packName).toEqual('adp.MasterQueue');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ groupStatus ] if [ this.model.getPayload ] returns undefined.', (done) => {
    adp.behaviorController.getPayload = 2;
    adp.behaviorController.groupHeader = 2;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.groupStatus('MockID')
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ groupStatus ] if [ this.model.getPayload ] returns status 1.', (done) => {
    adp.behaviorController.getPayload = 3;
    adp.behaviorController.groupHeader = 2;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.groupStatus('MockID')
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ groupStatus ] if [ this.model.getPayload ] returns status 200.', (done) => {
    adp.behaviorController.getPayload = 4;
    adp.behaviorController.groupHeader = 2;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.groupStatus('MockID')
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ groupStatus ] if [ this.model.groupHeader ] crashes.', (done) => {
    adp.behaviorController.getPayload = 2;
    adp.behaviorController.groupHeader = 1;
    adp.queue = new adp.masterQueue.MasterQueue();
    adp.queue.groupStatus('MockID')
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('groupStatus');
        expect(ERROR.packName).toEqual('adp.MasterQueue');
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ obtainObjectiveFromV2ID ] in a successful case.', (done) => {
    adp.queue = new adp.masterQueue.MasterQueue();
    const result = adp.queue.obtainObjectiveFromV2ID('V2.0_ZG9jdW1lbnQtcmVmcmVzaC1vbGQtdmVyc2lvbnMtbm90LXVwZGF0ZWRfXzE2NDU2OTYwNzQwNTg=');

    expect(result).toEqual('document-refresh-old-versions-not-updated__1645696074058');
    done();
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ obtainObjectiveFromV2ID ] in a unsuccessful case.', (done) => {
    adp.queue = new adp.masterQueue.MasterQueue();
    const result = adp.queue.obtainObjectiveFromV2ID({});

    expect(result).toBeNull();
    done();
  });
  // =========================================================================================== //
});
