// ============================================================================================= //
/*
* same.js
* ========
* Author: Armando Dias (zdiaarm)
*
* Find registers with the same ID
*
*/
/* eslint-disable no-underscore-dangle */
// ============================================================================================= //
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// ============================================================================================= //
/* eslint-disable prefer-destructuring */
require('./loader');
// ============================================================================================= //
global.packageJson = require('../../package.json'); // eslint-disable-line global-require
// ============================================================================================= //
const packName = 'Same App';
adp.timeStepStart();
adp.echoFirstLine();
global.version = global.packageJson.version;
adp.echoLog(`Starting Application [ ${global.version} ]`, null, 200, packName);


const checkThis = (DB) => {
  const { collection } = DB;
  const fileName = `${collection}.json`;
  const filePath = `${__dirname}/templateDataBase/${collection}.json`;
  const fileExists = global.fs.existsSync(filePath);
  if (!fileExists) {
    adp.echoLog(`File "${collection}.json" not found.`, { filePath }, 404, packName);
  } else {
    adp.echoLog('Processing file...', null, 200, fileName);
    const theIDs = [];
    let quant = 1;
    const content = JSON.parse(global.fs.readFileSync(filePath, 'utf-8'));
    Object.keys(content).forEach((KEY) => {
      const targetContent = content[KEY];
      if (Array.isArray(targetContent)) {
        targetContent.forEach((ITEM) => {
          if (theIDs.includes(ITEM._id)) {
            adp.echoLog(`Same ID [ ${ITEM._id} ]`, null, 500, fileName);
            quant += 1;
          } else {
            theIDs.push(ITEM._id);
          }
        });
      }
      if (quant > 1) {
        adp.echoLog(`On ${fileName} there is ${quant} registers with the same ID! This will cause an error on database!`, null, 500, fileName, false);
      } else {
        adp.echoLog('There is no registers using the same ID!', null, 500, fileName, false);
      }
    });
  }
};


adp.setup.loadFromFile();
adp.echoDivider();
adp.config.database.forEach((EACHDB) => {
  checkThis(EACHDB);
});
adp.echoDivider();
adp.echoLog('DONE!', null, 200, packName);
adp.echoDivider();
// ============================================================================================= //
