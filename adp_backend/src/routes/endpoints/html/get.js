// ============================================================================================= //
/**
* [ global.adp.endpoints.html.get ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const packName = 'global.adp.endpoints.html.get';
  const urlRequestPath = REQ.route.path;
  const regExpGetExtension = new RegExp(/([a-zA-Z0-0])+$/gim);
  const map = {
    png: 'image/png',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    git: 'image/gif',
    svg: 'image/svg+xml',
    html: 'text/html',
    htm: 'text/html',
  };
  const res = global.adp.setHeaders(RES);
  if (global.adp.config.siteAddress === null || global.adp.config.siteAddress === undefined) {
    let protocol = 'https';
    if (!REQ.secure) {
      protocol = 'http';
    }
    global.adp.config.siteAddress = `${protocol}://${REQ.headers.host}`;
    adp.echoLog(`adp.config.siteAddress is "${global.adp.config.siteAddress}"`, null, 200, packName);
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const folderName = REQ.params.folder;
  const fileName = REQ.params.filename;
  const extension = fileName.match(regExpGetExtension)[0];
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  global.adp.document.deliveryStaticFile(folderName, fileName, extension)
    .then((FILEOBJ) => {
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      res.statusCode = 200;
      const fileDetails = FILEOBJ.stats;
      if (urlRequestPath.substr(0, 14) === '/html/preview/') {
        res.setHeader('Content-Length', fileDetails.size);
        res.setHeader('Content-Type', map[extension] || 'text/plain');
        res.end(FILEOBJ.binary);
      } else {
        const answer = new global.adp.Answers();
        answer.setCode(200);
        answer.setMessage('200 OK');
        answer.setTime((new Date().getTime()) - timer.getTime());
        answer.setSize(fileDetails.size);
        answer.setCache('true');
        answer.setData(FILEOBJ.binary);
        res.end(answer.getAnswer());
      }
      const endTime = new Date();
      adp.echoLog(`File "${fileName}" was sent in ${endTime.getTime() - timer.getTime()}ms`, null, 200, packName);
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    })
    .catch((ERROR) => {
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      const errorOBJ = {
        parameter: REQ.params.filename,
        folderName,
        fileName,
        extension,
        error: ERROR,
      };
      if (ERROR === 404) {
        res.statusCode = 404;
        res.end('File not found!');
        const errorText = 'Error in [ adp.document.deliveryStaticFile ]: Image not found.';
        adp.echoLog(errorText, errorOBJ, 404, packName, true);
      } else {
        res.statusCode = 500;
        res.end('Internal Server Error!');
        const errorText = 'Error in [ adp.document.deliveryStaticFile ]';
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
      }
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
};
// ============================================================================================= //
