// ============================================================================================= //
/**
* [ global.adp.userProgress.delete ]
* Delete a specific progress entry for a specific user.
*/
// ============================================================================================= //
/* eslint-disable no-underscore-dangle */
// ============================================================================================= //


// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //


// ============================================================================================= //
const packName = 'global.adp.userProgress.delete';
const echo = adp.echoLog;
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ findAndDelete ]
* Verify if the register exists and delete it.
* @param {JSON} DBSELECTOR The User ID.
* @return Resolves if successful, reject if gets an error.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const findAndDelete = (SIGNUM, WID) => new Promise((RESOLVE, REJECT) => {
  const dbModel = new adp.models.Userprogress();
  dbModel.getBySignumAndWordpressID(SIGNUM, WID)
    .then((RESULTOFFIND) => {
      if (Array.isArray(RESULTOFFIND.docs) && (RESULTOFFIND.docs.length === 1)) {
        const thisID = RESULTOFFIND.docs[0]._id;
        const thisREV = RESULTOFFIND.docs[0]._rev;
        dbModel.deleteOne(thisID, thisREV)
          .then((RESULTOFDESTROY) => {
            if (RESULTOFDESTROY.ok === true) {
              RESOLVE('Successful deleted!');
            } else {
              const errorText = 'Unknown Error calling [ dbModel.deleteOne ] on [findAndDelete]';
              echo(errorText, { databaseAnswer: RESULTOFDESTROY }, 500, packName, true);
              const error = {
                code: 500,
                msg: 'Internal Server Error',
                data: 'Not able to delete a register...',
              };
              REJECT(error);
            }
          })
          .catch((ERROR) => {
            const errorText = 'Error calling [ dbModel.deleteOne ] on [ findAndDelete ]';
            const errorOBJ = {
              database: 'dataBaseUserProgress',
              id: thisID,
              rev: thisREV,
              error: ERROR,
            };
            echo(errorText, errorOBJ, 500, packName, true);
            const error = {
              code: 500,
              msg: 'Internal Server Error',
              data: 'Crash when tried to delete a register...',
            };
            REJECT(error);
          });
      } else {
        const errorText = 'Unknown Error calling [ dbModel.getBySignumAndWordpressID ] on [ findAndDelete ]';
        const errorOBJ = {
          database: 'dataBaseUserProgress',
          query: { signum: SIGNUM, wid: WID },
          databaseAnswer: RESULTOFFIND,
        };
        echo(errorText, errorOBJ, 500, packName, true);
        const error = {
          code: 404,
          msg: 'Not found',
          data: 'Not able to find the register to delete...',
        };
        REJECT(error);
      }
    })
    .catch((ERROR) => {
      const errorText = 'Error calling [ dbModel.getBySignumAndWordpressID ] on [ findAndDelete ]';
      const errorOBJ = {
        database: 'dataBaseUserProgress',
        query: { signum: SIGNUM, wid: WID },
        error: ERROR,
      };
      echo(errorText, errorOBJ, 500, packName, true);
      const error = {
        code: 500,
        msg: 'Internal Server Error',
        data: 'Not able to retrieve a valid response from database...',
      };
      REJECT(error);
    });
});
// ============================================================================================= //


// ============================================================================================= //
/**
* [ global.adp.userProgress.delete ]
* Delete a specific progress entry for a specific user.
* @param {String} SIGNUM The user ID.
* @param {String} WID a string with the Wordpress ID of the page (object_id).
* @param {Object} RBAC Object from [ adp.middleware.rbac ].
* @return Resolves if successful, reject if gets an error.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const deleteRecord = (SIGNUM, WID, RBAC, ALTERNATIVE = false) => new Promise((RESOLVE, REJECT) => {
  findAndDelete(SIGNUM, WID)
    .then(() => {
      const cacheObject = 'TUTORIALSPROGRESS';
      const cacheSubObjectID = null;
      const cacheObjectID = SIGNUM;
      global.adp.masterCache.clear(cacheObject, cacheSubObjectID, cacheObjectID);
      global.adp.tutorialsMenu.get.getTutorialsMenu(SIGNUM, RBAC, ALTERNATIVE)
        .then((FULLMENUOBJ) => {
          const finalResult = {
            signum: SIGNUM,
            wid: WID,
            progress: FULLMENUOBJ.progress,
            chapter_completed: FULLMENUOBJ.chapter_completed,
            chapter_total: FULLMENUOBJ.chapter_total,
            chapter_percentage: FULLMENUOBJ.chapter_percentage,
            lesson_completed: FULLMENUOBJ.lesson_completed,
            lesson_total: FULLMENUOBJ.lesson_total,
            lesson_percentage: FULLMENUOBJ.lesson_percentage,
            chapter_object: global.adp.userProgress.cleaner(WID, FULLMENUOBJ.menu, ALTERNATIVE),
          };
          RESOLVE(finalResult);
        })
        .catch((ERROR) => {
          const errorText = 'Error calling [ adp.tutorialsMenu.get ] in [ saveThis ]';
          const errorOBJ = {
            signum: SIGNUM,
            error: ERROR,
          };
          echo(errorText, errorOBJ, 500, packName, true);
          REJECT(ERROR);
        });
    })
    .catch((ERROR) => {
      REJECT(ERROR);
    });
});
// ============================================================================================= //
module.exports = {
  deleteRecord,
  findAndDelete,
};
