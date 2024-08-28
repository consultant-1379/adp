// ============================================================================================= //
/**
* [ global.adp.httpControls.deliveryFile ]
* Delivery the static files ( not Node.JS executable scripts ).
* @param {str} PATHNAME String with the path of file.
* @param {obj} RES Connection Object to whom you have to answer.
* @return {promise} Answer the request and return a Promise when done.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (PATHNAME, RES) => new Promise((RESOLVE, REJECT) => {
  const res = RES;
  const packName = 'adp.httpControls.deliveryFile';
  let pathname = PATHNAME;
  if ((pathname.substring(0, 9) !== './static/') && (pathname.substring(0, 17) !== './storage/static/')) {
    res.statusCode = 403;
    adp.echoLog('Access denied "403"', pathname, 403, packName);
    const error = 'Forbidden';
    res.end(error);
    REJECT(error);
    return null;
  }
  const { ext } = global.path.parse(pathname);
  const map = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
  };
  global.fs.exists(pathname, (EXIST) => {
    if (!EXIST) {
      adp.echoLog('File not found "404"', pathname, 404, packName);
      res.statusCode = 404;
      const msg = 'File not found!';
      res.end(msg);
      return msg;
    }
    let cType = map[ext];
    if (global.fs.statSync(pathname).isDirectory()) {
      pathname += 'index.html';
      cType = map['.html'];
    }
    global.fs.readFile(pathname, (err, data) => {
      if (err) {
        adp.echoLog('File not found "404"', { pathname, err }, 404, packName);
        res.statusCode = 404;
        res.end(`Error getting the file: ${err}.`);
      } else {
        res.setHeader('Content-type', cType || 'text/plain');
        res.end(data);
      }
    });
    return true;
  });
  RESOLVE(true);
  return true;
});
// ============================================================================================= //
