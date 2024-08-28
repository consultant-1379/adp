/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */
const request = require('request');
const config = require('../test.config.js');

class ApiQueue {
  /**
  * Just a debug for queue multiple requests, if necessary.
  * @param {string} STR String to print on console.
  * @param {string} OBJ Object to print on console ( Optional )
  * The variable global.extraMessagesOnTerminal is declared on the test.config.js.
  */
  queueDebug(STR, OBJ = null) {
    if (global.extraMessagesOnTerminal === true) {
      if (OBJ) {
        // eslint-disable-next-line no-console
        console.log(STR, OBJ);
        return;
      }
      // eslint-disable-next-line no-console
      console.log(STR);
    }
  }

  /**
  * Resolve multiple queues, waiting for the "done" status of all.
  * @param {object} OBJ Object with the queues.
  * @returns {Promise} the final result, after the last queue finished the request.
  */
  multipleQueue(OBJ) {
    const timer = (new Date()).getTime();
    let index = 0;
    const queueList = [];
    const queueResp = [];
    const fieldStartName = 'queueStatusLink';
    Object.keys(OBJ).forEach(async (ATTRIBUTE) => {
      if (ATTRIBUTE.substring(0, fieldStartName.length) === fieldStartName) {
        queueList.push(OBJ[ATTRIBUTE]);
      }
    });
    const theAction = async () => {
      if (queueList[index]) {
        const result = await this.queue(queueList[index], OBJ);
        result.queue = queueList[index];
        queueResp.push(result);
        index += 1;
        return theAction();
      }
      return true;
    };
    return new Promise(async (RES) => {
      await theAction();
      const originalObject = OBJ;
      originalObject.queueResults = queueResp;
      this.queueDebug(`Queue :: Multiple Queue solved in ${(new Date()).getTime() - timer}ms`);
      RES(originalObject);
    });
  }

  /**
  * Resolve the queue, waiting for the "done" status.
  * @param {string} url the url to check the result of the queue.
  * @param {object} fullBody the full body of the last request.
  * @returns {Promise} the final result, after the queue finished the request.
  */
  queue(url, fullBody) {
    let messageSkip = 4;
    if (fullBody && fullBody.code === 400 && fullBody.message) {
      this.queueDebug(`Queue :: Starting :: ${url}`);
      return fullBody;
    }
    this.queueDebug(`Queue :: Starting :: ${url}`);
    let rerunMilliseconds = 0;
    let unknowTries = 30;
    let invalidRetry = 1;
    return new Promise((RES, REJ) => {
      const action = () => {
        rerunMilliseconds = (rerunMilliseconds + 100) < 5100
          ? rerunMilliseconds += 100
          : 3000;
        request.get({
          url,
          json: true,
          strictSSL: false,
        },
        (error, response, body) => {
          if (body === undefined && unknowTries > 0) {
            unknowTries -= 1;
            setTimeout(() => action(), rerunMilliseconds);
          } else {
            let status = 'CRASH';
            if (body && body.job) {
              status = body.job.status;
            } else if (body) {
              status = body.status;
            }
            let theStatus = '';
            if (status === 1 || status >= 200) {
              theStatus = ` - ${body.currentStatus}`;
            }
            if (status === 0 && body.percentage === '100.00') {
              status = 200;
            }
            let result;
            let statusCode;
            let message = '';
            switch (status) {
              case 0:
                if (messageSkip <= 0) {
                  message = `Queue [ status: ${status}${theStatus} ] :: [ ${rerunMilliseconds}ms ] - Still waiting... `;
                  messageSkip = 4;
                  this.queueDebug(message);
                }
                messageSkip -= 1;
                setTimeout(() => action(), rerunMilliseconds);
                break;
              case 1:
                message = `Queue [ status: ${status}${theStatus} ] :: [ ${rerunMilliseconds}ms ] - Running... `;
                this.queueDebug(message);
                setTimeout(() => action(), rerunMilliseconds);
                break;
              case 'CRASH':
                message = `Queue [ status: ${status}${theStatus} ] :: CRASHED`;
                this.queueDebug(message, body);
                REJ(body);
                break;
              default:
                if (body && body.status === 200 && body.message === 'Status 1: Running...' && invalidRetry > 0) {
                  invalidRetry -= 1;
                  this.queueDebug(`Queue [ Invalid status, retrying once ] :: [ ${rerunMilliseconds}ms ] - Running... `);
                  rerunMilliseconds = 500;
                  setTimeout(() => action(), rerunMilliseconds);
                } else {
                  statusCode = status >= 0
                    ? status
                    : '???';
                  this.queueDebug(`Queue [ status: ${status}${theStatus} ] :: [ Got ${statusCode} code! ] - Queued Job Done!`);
                  result = body;
                  RES(result);
                }
                break;
            }
          }
        });
      };
      return action();
    });
  }

  isFree() {
    this.previousMessage = '';
    let skipMessage = 1;
    return new Promise((RESOLVE) => {
      const url = `${config.baseUrl}queueisfree/`;
      const action = () => {
        request.get({
          url,
          json: true,
          strictSSL: false,
        },
        (error, response, body) => {
          const jobs = body;
          if (jobs === 0) {
            const msg = '      [ jobs ] :: No jobs in the queue, can proceed...';
            if (msg !== this.previousMessage && skipMessage <= 0) {
              this.queueDebug(msg);
              this.previousMessage = msg;
              skipMessage = 1;
            }
            setTimeout(() => RESOLVE(jobs), 1000);
          } else {
            const msg = `      [ jobs ] :: ${jobs} jobs in the queue, waiting...`;
            if (msg !== this.previousMessage && skipMessage <= 0) {
              this.queueDebug(msg);
              this.previousMessage = msg;
              skipMessage = 1;
            }
            setTimeout(() => action(), 250);
          }
        });
      };
      action();
    });
  }
}

module.exports = {
  ApiQueue,
};
