// ============================================================================================= //
/**
* [ global.adp.echoFirstLine ]
* Generates the first line on console and/or log text file.
* Important: [ global.adp.echoDebugConsoleMode ] must be true or this feature will be OFF.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
/* eslint-disable no-console */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => {
  // ------------------------------------------------------------------------------------------- //
  if (adp.echoDebugConsoleMode) {
    const ret = `${('-').repeat(100)}`;
    console.log(global.chalk.blue(ret));
    if (adp.config.saveConsoleLogInFile) {
      adp.echoLogSaveDiskLog(ret);
    }
  }
  // ------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
