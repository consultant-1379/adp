// ============================================================================================= //
/**
* [ adp.stopApplication ]
* Stop the Application. Function to be used on some specific tests.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
module.exports = () => {
  adp.echoLog('Application exit was requested...', null, 300);
  process.exit();
};
// ============================================================================================= //
