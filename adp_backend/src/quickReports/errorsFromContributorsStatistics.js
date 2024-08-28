// ============================================================================================= //
/**
* [ adp.quickReports.errorsFromContributorsStatistics ]
* Generate a CSV Report of last adplog of Contributors Statistics errors.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable no-use-before-define */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //


// ============================================================================================= //
// Private Constants
const packName = 'global.adp.quickReports.errorsFromContributorsStatistics';
const regExpCommaDetector = new RegExp(/,+/gim);
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ replaceCommas ]
* @param STR Original String.
* @return String without commas.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const replaceCommas = (STR) => {
  if (STR !== undefined && STR !== null) {
    return STR.replace(regExpCommaDetector, '-');
  }
  return undefined;
};
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ validString ]
* @param STR Value to be validated.
* @return String with the value or empty string if null/undefined.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const validString = (STR) => {
  if (STR === null || STR === undefined || STR === 'undefined') {
    return ' ';
  }
  return (`${replaceCommas(STR)}`).trim();
};
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ processIt ]
* @param LOG The log full object.
* @return The CSV file with errors.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const processIt = (LOG) => {
  let csv = 'Microservice,Git URL,Gerrit API URL, Error Description, Date';
  LOG.errors.forEach((ITEM) => {
    csv = `${csv}\r\n`;
    csv = `${csv}${validString(ITEM.asset_slug)},`;
    csv = `${csv}${validString(ITEM.asset_giturl)},`;
    csv = `${csv}${validString(ITEM.api_url)},`;
    csv = `${csv}${validString(ITEM.desc)},`;
    csv = `${csv}${validString(adp.dateFormat(ITEM.log_date))}`;
  });
  return csv;
};
// ============================================================================================= //


// ============================================================================================= //
/**
* [ adp.quickReports.errorsFromContributorsStatistics ]
* Generate a CSV Report of all team members of each Microservice
* @return Resolves if successful, reject if gets an error.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
module.exports = () => new Promise((RESOLVE, REJECT) => {
  const dbModelLog = new adp.models.AdpLog();
  dbModelLog.getAllContributorsStatistics()
    .then((LOGS) => {
      if (Array.isArray(LOGS.docs)) {
        const logs = LOGS.docs.sort(adp.dynamicSort('-end'));
        const csv = processIt(logs[0]);
        const filename = `errorsFromContributorsStatistics_${adp.dateLogSystemFormat().fileName}.csv`;
        adp.document.checkThisPath('quickReports')
          .then((FULLPATH) => {
            const path = `${FULLPATH}/${filename}`;
            global.fs.writeFileSync(path, csv, 'utf8');
            RESOLVE(path);
          })
          .catch((ERROR) => {
            const errorText = 'Error in [ adp.document.checkThisPath ]';
            const errorOBJ = {
              parameter: 'quickReports',
            };
            adp.echoLog(errorText, errorOBJ, 500, packName, true);
            REJECT(ERROR);
          });
      }
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ dbModelLog.getAllContributorsStatistics ]';
      const errorOBJ = {
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
