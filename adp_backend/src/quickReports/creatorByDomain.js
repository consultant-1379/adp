// ============================================================================================= //
/**
* [ adp.quickReports.creatorByDomain ]
* Generate a Quick Report of Creators by Domain
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //

// ============================================================================================= //
// Private Constants
const packName = 'adp.quickReports.creatorByDomain';
// Global
let allNew = null;
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ getAllMicroservicesFromDataBase ]
* @return Resolves if successful, reject if gets an error.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const getAllMicroservicesFromDataBaseByDomain = DOMAIN => new Promise((RESOLVE, REJECT) => {
  const dbModel = new adp.models.Adp();
  dbModel.getAllAssetsByDomain(DOMAIN)
    .then((MS) => {
      const fromDB = MS.docs;
      RESOLVE(fromDB);
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ dbModel.getAllAssetsByDomain ] at [ getAllMicroservicesFromDataBaseByDomain ]';
      const errorOBJ = {
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      REJECT(ERROR);
    });
});
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ getLogs ]
* @return Resolves if successful, reject if gets an error.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const getLogs = () => new Promise((RESOLVE, REJECT) => {
  const dbModelLog = new adp.models.AdpLog();
  dbModelLog.getAllNew()
    .then((MS) => {
      const fromDB = MS.docs;
      RESOLVE(fromDB);
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ dbModelLog.getAllNew ] at [ getLogs ]';
      const errorOBJ = {
        database: 'dataBaseLog',
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      REJECT(ERROR);
    });
});
// ============================================================================================= //


// ============================================================================================= //
/**
* [ global.adp.quickReports.creatorByDomain ]
* Generate a Quick Report of Creators by Domain
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
module.exports = DOMAIN => new Promise((RESOLVE, REJECT) => {
  getLogs()
    .then((ALLNEW) => {
      allNew = ALLNEW;
      getAllMicroservicesFromDataBaseByDomain(parseInt(DOMAIN, 10))
        .then((ASSETS) => {
          let index = -1;
          let csv = '';
          csv = `${csv}Microservice Name,`;
          csv = `${csv}Signum's Creator,`;
          csv = `${csv}Date/Time,`;
          csv = `${csv}\n`;
          const build = () => {
            index += 1;
            if (ASSETS[index] === undefined) {
              RESOLVE(`${csv}\n`);
              return `${csv}\n`;
            }
            const obj = ASSETS[index];
            let log = allNew.filter(ITEM => ITEM.new._id === obj._id);
            if (log.length === 1) {
              log = log[0];
            } else {
              log = {};
            }
            csv = `${csv}${obj.name},`;
            return global.adp.masterCache.get('ALLUSERS', null, log.signum)
              .then((USER) => {
                const userOBJ = USER.value.docs[0];
                csv = `${csv}[ ${log.signum} ] ${userOBJ.name} [ ${userOBJ.email} ],`;
                csv = `${csv}${adp.dateFormat(log.datetime)},`;
                csv = `${csv}\n`;
                return build();
              })
              .catch(() => {
                if (log.signum === undefined) {
                  csv = `${csv}-,`;
                  csv = `${csv}-,`;
                } else {
                  csv = `${csv}${log.signum},`;
                  csv = `${csv}${log.datetime},`;
                }
                csv = `${csv}\n`;
                return build();
              });
          };
          build();
        })
        .catch((ERROR) => {
          const errorText = 'Error in [ getAllMicroservicesFromDataBaseByDomain ]';
          const errorOBJ = {
            domain: DOMAIN,
          };
          adp.echoLog(errorText, errorOBJ, 500, packName, true);
          REJECT(ERROR);
        });
    })
    .catch((ERROR) => {
      const errorText = 'Error on [getLogs]';
      adp.echoLog(errorText, { error: ERROR }, 500, packName, true);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
