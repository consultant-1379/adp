// ============================================================================================= //
/**
* [ global.adp.userProgress.save ]
* Save a progress entry for a specific user.
*/
// ============================================================================================= //
/* eslint-disable no-underscore-dangle */
// ============================================================================================= //


// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //


// ============================================================================================= //
const packName = 'global.adp.userProgress.save';
const echo = adp.echoLog;
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ checkWID ]
* Check if the WID is valid for the current Tutorials Menu.
* @param {String} WID The Wordpress unique page ID.
* @return Resolves if successful (sending the date_content as result), reject if gets an error.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const checkWID = (WID, ALTERNATIVE = false) => new Promise((RESOLVE, REJECT) => {
  let menu;
  if (ALTERNATIVE) {
    if (adp && adp.tutorialsMenu && adp.tutorialsMenu.menuEssentialsAlternative) {
      menu = global.adp.clone(adp.tutorialsMenu.menuEssentialsAlternative);
    } else {
      menu = [];
    }
  } else {
    menu = global.adp.clone(adp.tutorialsMenu.menuEssentials);
  }
  let foundIt = false;
  let dateContent = null;
  menu.forEach((ITEM) => {
    if (`${ITEM.object_id}` === `${WID}`) {
      dateContent = `${ITEM.date_content}`;
      foundIt = true;
    }
  });
  if (foundIt) {
    RESOLVE(dateContent);
  } else {
    REJECT();
  }
});
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ saveUserProgress ]
* Save the progress of the user. If exists, update it.
* @param {String} SIGNUM The User ID.
* @param {JSON} CONTENT The content retrieved by [ retrieveContentFromDB ].
* @param {Number} STEP Number to identify the level of recursive function call.
* @return Resolves if successful, reject if gets an error.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const saveUserProgress = (SIGNUM, WID, DATECONTENT = '', STEP = 0) => new Promise((RESOLVE, REJECT) => {
  const dbModel = new adp.models.Userprogress();
  dbModel.getTheProgressFromThisUserAndThisPage(SIGNUM, WID)
    .then((RESULTOFFIND) => {
      if (Array.isArray(RESULTOFFIND.docs) && (RESULTOFFIND.docs.length > 0)) {
        const progress = RESULTOFFIND.docs[0];
        if (STEP === 1) {
          RESOLVE(progress);
        } else {
          const dateProgress = (new Date());
          const updateProgress = {
            _id: progress._id,
            signum: SIGNUM,
            wid: WID,
            date_content: DATECONTENT,
            date_progress: dateProgress,
            type: 'progress',
          };
          dbModel.updateOne(updateProgress)
            .then((RESULTOFUPDATE) => {
              if (RESULTOFUPDATE.ok === true && STEP === 0) {
                RESOLVE(saveUserProgress(SIGNUM, WID, DATECONTENT, 1));
              } else {
                const errorText = 'Unknown Error calling [ dbModel.updateOne ] in [ saveUserProgress ]';
                const errorOBJ = {
                  database: 'dataBaseUserProgress',
                  parameter: updateProgress,
                  databaseAnswer: RESULTOFUPDATE,
                };
                echo(errorText, errorOBJ, 500, packName, true);
                const error = 'Not able to update a register...';
                REJECT(error);
              }
            })
            .catch((ERROR) => {
              const errorText = 'Error calling [ dbModel.updateOne ] in [ saveUserProgress ]';
              const errorOBJ = {
                database: 'dataBaseUserProgress',
                parameter: updateProgress,
                error: ERROR,
              };
              echo(errorText, errorOBJ, 500, packName, true);
              REJECT(ERROR);
            });
        }
      } else {
        const dateProgress = (new Date());
        const newProgress = {
          signum: SIGNUM,
          wid: WID,
          date_content: DATECONTENT,
          date_progress: dateProgress,
          type: 'progress',
        };
        dbModel.createOne(newProgress)
          .then((RESULTOFUPDATE) => {
            if (RESULTOFUPDATE.ok === true) {
              RESOLVE(saveUserProgress(SIGNUM, WID, DATECONTENT, 1));
            } else {
              const errorText = 'Unknown Error calling [ dbModel.createOne ] in [ saveUserProgress ]';
              const errorOBJ = {
                database: 'dataBaseUserProgress',
                parameter: newProgress,
                databaseAnswer: RESULTOFUPDATE,
              };
              echo(errorText, errorOBJ, 500, packName, true);
              const error = 'Not able to create a register...';
              REJECT(error);
            }
          })
          .catch((ERROR) => {
            const errorText = 'Error calling [ dbModel.createOne ] in [ saveUserProgress ]';
            const errorOBJ = {
              database: 'dataBaseUserProgress',
              parameter: newProgress,
              error: ERROR,
            };
            echo(errorText, errorOBJ, 500, packName, true);
            REJECT(ERROR);
          });
      }
    })
    .catch((ERROR) => {
      const errorText = 'Error calling [ dbModel.getTheProgressFromThisUserAndThisPage ] in [ saveUserProgress ]:';
      const errorOBJ = {
        signum: SIGNUM,
        wid: WID,
        error: ERROR,
      };
      echo(errorText, errorOBJ, 500, packName, true);
      REJECT(ERROR);
    });
});
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ saveThis ]
* Save a progress entry for a specific user.
* @param {String} SIGNUM The user ID.
* @param {String} WID a string with Wordpress ID of the page.
* @param {Object} RBAC Object from [ adp.middleware.rbac ].
* @return Resolves if successful, reject if gets an error.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const saveThis = (SIGNUM, WID, RBAC, ALTERNATIVE = false) => new Promise((RESOLVE, REJECT) => {
  checkWID(WID, ALTERNATIVE)
    .then((DATECONTENT) => {
      saveUserProgress(SIGNUM, WID, DATECONTENT)
        .then((SAVED) => {
          const cacheObject = 'TUTORIALSPROGRESS';
          const cacheSubObjectID = null;
          const cacheObjectID = SIGNUM;
          global.adp.masterCache.clear(cacheObject, cacheSubObjectID, cacheObjectID);

          const saved = SAVED;
          delete saved._id;
          delete saved._rev;
          delete saved.type;

          global.adp.tutorialsMenu.get.getTutorialsMenu(SIGNUM, RBAC, ALTERNATIVE)
            .then((FULLMENUOBJ) => {
              saved.progress = FULLMENUOBJ.progress;
              saved.chapter_completed = FULLMENUOBJ.chapter_completed;
              saved.chapter_total = FULLMENUOBJ.chapter_total;
              saved.chapter_percentage = FULLMENUOBJ.chapter_percentage;
              saved.lesson_completed = FULLMENUOBJ.lesson_completed;
              saved.lesson_total = FULLMENUOBJ.lesson_total;
              saved.lesson_percentage = FULLMENUOBJ.lesson_percentage;
              saved.chapter_object = global.adp.userProgress.cleaner(WID, FULLMENUOBJ.menu);
              RESOLVE(saved);
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
          const errorText = 'Error calling [ saveUserProgress ] in [ saveThis ]';
          const errorOBJ = {
            signum: SIGNUM,
            wid: WID,
            dateContent: DATECONTENT,
            error: ERROR,
          };
          echo(errorText, errorOBJ, 500, packName, true);
          REJECT(ERROR);
        });
    })
    .catch((ERROR) => {
      const errorText = 'Error calling [ checkWID ] in [ saveThis ]';
      const errorOBJ = {
        signum: SIGNUM,
        wid: WID,
        error: ERROR,
      };
      echo(errorText, errorOBJ, 404, packName);
      const errorObj = { code: 404, msg: `Not Found: WID '${WID}' was not found in the Tutorials Menu.` };
      REJECT(errorObj);
    });
});
// ============================================================================================= //


// ============================================================================================= //
/**
* [ global.adp.userProgress.save ]
* Save a progress entry for a specific user.
* @param {String} SIGNUM The user ID.
* @param {String} WID a string with Wordpress ID of the page.
* @param {Object} RBAC Object from [ adp.middleware.rbac ].
* @return Resolves if successful, reject if gets an error.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
module.exports = (SIGNUM, WID, RBAC, ALTERNATIVE = false) => new Promise((RESOLVE, REJECT) => {
  global.adp.tutorialsMenu.get.getTutorialsMenu(SIGNUM, RBAC, ALTERNATIVE)
    .then(() => {
      saveThis(SIGNUM, WID, RBAC, ALTERNATIVE)
        .then((RESULT) => {
          RESOLVE(RESULT);
        })
        .catch((ERROR) => {
          REJECT(ERROR);
        });
    })
    .catch((ERROR) => {
      const errorText = 'Error calling [ adp.tutorialsMenu.get ]';
      const errorOBJ = {
        signum: SIGNUM,
        wid: WID,
        error: ERROR,
      };
      echo(errorText, errorOBJ, 500, packName, true);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
