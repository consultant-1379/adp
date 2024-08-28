// ============================================================================================= //
/**
* [ global.adp.echoLogSaveDiskLog ]
* Save the log message into disk. Separates into year/month/day/hour/minute.
* Important: [ global.adp.echoDebugConsoleMode ] must be true or this feature will be OFF.
* Be careful with write permissions on the right folder.
* @param {str} TXT with a message to save into physical file.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (TXT) => {
  // ------------------------------------------------------------------------------------------- //
  if (global.adp.echoDebugConsoleMode) {
    const breakLine = global.os.EOL;
    const dateOBJ = global.adp.dateLogSystemFormat();
    let path = `${global.adp.path}`;

    const checkFolder = (ADDFOLDER) => {
      path = `${path}/${ADDFOLDER}`;
      if (!(global.fs.existsSync(path))) {
        global.fs.mkdirSync(path, 0o744);
      }
    };

    checkFolder('logs');
    checkFolder(dateOBJ.y);
    checkFolder(dateOBJ.m);
    checkFolder(dateOBJ.d);

    path = `${path}/${dateOBJ.fileName}.txt`;
    let fd;
    try {
      if (!(global.fs.existsSync(path))) {
        global.fs.writeFileSync(path, `${TXT}${breakLine}`, 'utf8');
      } else {
        fd = global.fs.openSync(path, 'a');
        global.fs.appendFileSync(fd, `${TXT}${breakLine}`, 'utf8');
      }
    } catch (err) {
      console.log(`ERROR on echoSaveDiskLog - ${err}`); // eslint-disable-line no-console
    } finally {
      if (fd !== undefined) global.fs.closeSync(fd);
    }
  }
  // ------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
