// ============================================================================================= //
/**
* [ global.adp.playground.cmd ]
* @author Armando Schiavon Dias [escharm]\Githu Jeeva Savy [zjeegit]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
class Playground {
  // eslint-disable-next-line class-methods-use-this
  _getPlaygroundURL(url, USER, STEP) {
    return new Promise((RESOLVE, REJECT) => {
      global.request.post(url, {
        json: {
          cmd: '',
        },
      }, (error, res, body) => {
        if (error) {
          const errorOBJ = {
            code: 500,
            message: error,
          };
          REJECT(errorOBJ);
          return;
        }
        let success;
        let errorText = null;
        let errorOBJ = null;
        switch (res.statusCode) {
          case 200:
            success = {
              code: 200,
              data: body.message,
            };
            RESOLVE(success);
            break;
          case 301:
          case 307:
          case 308:
            RESOLVE(global.adp.playground.cmd(USER, STEP, res.headers.location));
            break;
          default:
            REJECT(res.statusCode);
            errorText = 'Unexpected behavior from Playground Server';
            errorOBJ = {
              statusCode: res.statusCode,
              body,
            };
            adp.echoLog(errorText, errorOBJ, res.statusCode, 'global.adp.playground.cmd', true);
            break;
        }
      });
    });
  }
}

module.exports = (USER, STEP, LINK = null, STATUS = null) => new Promise((RESOLVE, REJECT) => {
  const playgroundObject = new Playground();
  const packName = 'global.adp.playground.cmd';
  let url = '';
  if (LINK === undefined || LINK === null) {
    url = `${global.adp.config.playgroundAddress}/${USER}`;
  } else {
    url = `https://playground-server.${LINK}/playground/${USER}`;
  }
  if (STEP !== null) {
    url = `${url}/${STEP}`;
  }

  if (STATUS !== 'refresh') {
    playgroundObject._getPlaygroundURL(url, USER, STEP)
      .then((response) => {
        RESOLVE(response);
      }).catch((error) => {
        const errorText = 'Unexpected Behavior from Playground Server';
        const errorOBJ = {
          statusCode: error,
          message: errorText,
        };
        adp.echoLog(errorText, errorOBJ, error, packName, true);
        REJECT(error);
      });
  }
  // Refresh request for Playground
  if (STATUS === 'refresh') {
    global.request.delete(url, {
      json: {
        cmd: '',
      },
    }, (deletionError, deleteRes) => {
      if (deletionError) {
        const errorOBJ = {
          code: 500,
          message: deletionError,
        };
        REJECT(errorOBJ);
      }
      if (deleteRes && deleteRes.statusCode === 200) {
        playgroundObject._getPlaygroundURL(url, USER, STEP)
          .then((response) => {
            RESOLVE(response);
          }).catch((error) => {
            const errorText = 'Unexpected Behavior from Playground Server on Refresh';
            const errorOBJ = {
              statusCode: error,
              message: errorText,
            };
            adp.echoLog(errorText, errorOBJ, error, packName, true);
            REJECT(error);
          });
      }
    });
  }
});
// ============================================================================================= //
