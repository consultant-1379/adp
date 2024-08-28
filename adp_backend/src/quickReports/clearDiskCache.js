const errorLog = require('../library/errorLog');

// ============================================================================================= //
/**
* [ global.adp.quickReports.clearDiskCache ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise((RESOLVE) => {
  const { fs } = global;
  const packName = 'adp.quickReports.clearDiskCache';
  const path = `${global.adp.path}/static/quickReports/`;
  if (fs.existsSync(path)) {
    const folder = fs.readdirSync(path);
    folder.forEach((fileName) => {
      if (fs.existsSync(`${path}${fileName}`)) {
        const status = fs.statSync(`${path}${fileName}`);
        const { birthtimeMs } = status;
        const nowMS = (new Date()).getTime();
        const moreThanOneHour = ((((nowMS - birthtimeMs) / 1000) / 60) / 60);
        if (moreThanOneHour >= 1) {
          try {
            fs.unlinkSync(`${path}${fileName}`);
            adp.echoLog(`File "${fileName}" deleted in "${path}"`, null, 200, packName);
          } catch (error) {
            errorLog(
              error.code === 'ENOENT' ? 404 : 500,
              `Failure to unlink file: ${path}${fileName}`,
              { error, path, fileName },
              'main',
              packName,
            );
          }
        }
      }
    });
  }
  RESOLVE();
});
// ============================================================================================= //
