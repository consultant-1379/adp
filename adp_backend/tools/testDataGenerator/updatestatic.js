// ============================================================================================= //
/*
* updatestatic.js
* ===============
* Author: Armando Dias (zdiaarm)
*
* Gets the content of adp database and update the file
* tools/testDataGenerator/templateDataBase/adp.json
* This avoid the "copy and paste" manual process
* when a Migration Script is disabled.
*
* Before the use, please read all the documentation in:
* https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP/Backend+Migration+Script
*
* This script should be used through the command: npm run updateStaticTestData
*
*/
// ============================================================================================= //
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// ============================================================================================= //
/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
require('./loader');
const jsonFormatter = require('json-string-formatter');
adp.dynamicSort = require('./../../src/library/dynamicSort');
// ============================================================================================= //
global.packageJson = require('../../package.json'); // eslint-disable-line global-require
// ============================================================================================= //
adp.echoFirstLine();
global.version = global.packageJson.version;
adp.echoLog(`Starting Application [ ${global.version} ]`, null, 200, 'Update Static Test Data');
// ============================================================================================= //
const packName = 'updateStatic';
// ============================================================================================= //
const action = async () => {
// --------------------------------------------------------------------------------------------- //
  const startTime = new Date();
  await adp.timeStepStart();
  await adp.setup.loadFromFile();
  await adp.db.start();
  const selector = {
    selector: {
      deleted: { $exists: false },
    },
    limit: 9999999,
    skip: 0,
    execution_stats: true,
  };
  const regExpMockArtifactoryLink = new RegExp(/notify\/mockartifactory\/local\/dynamic/gim);

  adp.db.find('dataBase', selector)
    .then(async (RESULT) => {
      if (Array.isArray(RESULT.docs) && RESULT.docs.length > 0) {
        const registers = { item: RESULT.docs };
        registers.item.forEach((ITEM) => {
          const thisItem = ITEM;
          delete thisItem._rev;
          if (thisItem.repo_urls !== undefined) {
            if (thisItem.repo_urls.development !== undefined) {
              if (thisItem.repo_urls.development.match(regExpMockArtifactoryLink) !== null) {
                thisItem.repo_urls.development = '|||MOCK-ARTIFACTORY-LINK|||dynamic/';
              }
            }
            if (thisItem.repo_urls.release !== undefined) {
              if (thisItem.repo_urls.release.match(regExpMockArtifactoryLink) !== null) {
                thisItem.repo_urls.release = '|||MOCK-ARTIFACTORY-LINK|||dynamic/';
              }
            }
          }
        });
        registers.item = registers.item.sort(adp.dynamicSort('-type', 'name'));
        const mainString = jsonFormatter.format(JSON.stringify(registers), '  ');
        const filePath = `${__dirname}/templateDataBase/adp.json`;
        if (global.fs.existsSync(filePath)) {
          global.fs.unlinkSync(filePath);
        }
        const fd = global.fs.openSync(filePath, 'a');
        global.fs.appendFileSync(fd, mainString, 'utf8');
        const endTime = (new Date()).getTime() - startTime.getTime();
        adp.echoLog(`The adp.json was successfully updated in ${endTime}ms!`, null, 200, packName);
      } else {
        adp.echoLog('Invalid response from CouchDB. Can`t proceed.', null, 500, packName);
      }
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ adp.db.find ]';
      const errorOBJ = {
        database: 'dataBase',
        query: selector,
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
    });
// --------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
action();
// ============================================================================================= //
