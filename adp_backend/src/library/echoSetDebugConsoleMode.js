// ============================================================================================= //
/**
* [ global.adp.echoLogSetDebugConsoleMode ]
* Set if the APP have to display messages on console and/or save it on log files.
* @param {boolean} MODE true or false.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (MODE) => {
  // ------------------------------------------------------------------------------------------- //
  if (MODE === true) {
    global.adp.echoDebugConsoleMode = true;
  } else {
    global.adp.echoDebugConsoleMode = false;
  }
  // ------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
