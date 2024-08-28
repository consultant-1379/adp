// ============================================================================================= //
/*
* index.js
* ========
* Author: Armando Dias (zdiaarm)
*
* Reset all the database using the content of tools/testDataGenerator/templateDataBase
* Used for automated tests and local enviromments
*
* Before the use, please read all the documentation in:
* https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP/Backend+Migration+Script
*
* This script should be used through the command: npm run testDataGenerator
*
*/
// ============================================================================================= //
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// ============================================================================================= //
const startTimer = new Date();
require('./loader');
// ============================================================================================= //
global.packageJson = require('../../package.json');
// ============================================================================================= //
adp.echoFirstLine();
adp.timeStepStart();
global.version = global.packageJson.version;
adp.echoLog(`Starting Application [ ${global.version} ]`, null, 200, 'Test Data Generator');
adp.echoDivider();
adp.setup.loadFromFile();
adp.insertExtra = false;
let quantMS = 0;
let quantUSER = 0;
const myArguments = process.argv;
if (Array.isArray(myArguments)) {
  if ((`${myArguments[2]}`).toUpperCase() === 'EXTRA') {
    adp.insertExtra = true;
  } else {
    try {
      quantMS = Number(myArguments[2]);
    } catch (e) {
      quantMS = 0;
    }
    try {
      quantUSER = Number(myArguments[3]);
    } catch (e) {
      quantUSER = 0;
    }
  }
}

adp.action(quantMS, quantUSER)
  .then((SUCCESS) => {
    adp.echoLog('Success in [ adp.action ]', { success: SUCCESS }, 200, 'Test Data Generator');
    const timer = (new Date()).getTime() - startTimer.getTime();
    const timerText = `All process finished in ${timer}ms`;
    adp.echoLog(timerText, null, 200, 'Test Data Generator', false);
    process.exit();
  })
  .catch((ERROR) => {
    const errorText = 'Error in [ adp.action ]';
    const errorOBJ = {
      quantMS,
      quantUSER,
      error: ERROR,
    };
    adp.echoLog(errorText, errorOBJ, 500, 'Test Data Generator');
  });
// ============================================================================================= //
