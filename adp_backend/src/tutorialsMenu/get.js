// ============================================================================================= //
/**
* [ global.adp.tutorialsMenu.get ]
* Retrieve the tutorial menu from wordpress.
*/
// ============================================================================================= //


// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //

// ============================================================================================= //
/**
* Private Constants
* These constants are global inside of this module.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const packName = 'global.adp.tutorialsMenu.get';
const echo = adp.echoLog;
// ============================================================================================= //


// ============================================================================================= //
/**
* Private Variables
* These variables are global inside of this module.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
let wordpressLink = null;
let wordpressRequestTimeOutInSeconds = null;
let wordpressCacheTimeOutInSeconds = null;
let userProgressTimeOutInSeconds = null;
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ fetchWordPressConfig ]
* Just bring the configuration from outside to private global variables.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const fetchWordPressConfig = () => {
  if (wordpressLink === null) {
    wordpressLink = global.adp.config
      .wordpress.tutorials.link;
    wordpressRequestTimeOutInSeconds = global.adp.config
      .wordpress.tutorials.requestTimeOutInSeconds;
    wordpressCacheTimeOutInSeconds = global.adp.config
      .wordpress.tutorials.cacheTimeOutInSeconds;
    userProgressTimeOutInSeconds = global.adp.masterCacheTimeOut
      .userProgressTutorials;
  }
};
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ retrieveTutorialsMenuFromRemote ]
* Request Tutorials Menu from Wordpress Server.
* Returns a Promise. Resolves if successful, reject if fails.
* @return {JSON} Object with some null attributes to be filled and the menu from Wordpress.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const retrieveTutorialsMenuFromRemote = () => new Promise((RESOLVE, REJECT) => {
  fetchWordPressConfig();
  const setupObj = {
    followRedirect: false,
    followAllRedirects: false,
    encoding: null,
    url: wordpressLink,
    timeout: (wordpressRequestTimeOutInSeconds * 1000),
  };
  global.request(setupObj, (ERROR, RESPONSE) => {
    if (ERROR !== null && ERROR !== undefined) {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || 'Error got when it was trying to request Tutorials from Wordpress';
      const errorObject = {
        error: ERROR,
        response: RESPONSE,
        setupObj,
      };
      REJECT(errorLog(errorCode, errorMessage, errorObject, 'retrieveTutorialsMenuFromRemote', packName));
    } else {
      const parsed = JSON.parse(RESPONSE.body.toString());
      try {
        const prepareObjOrder = {
          chapter_completed: null,
          chapter_total: null,
          chapter_percentage: null,
          lesson_completed: null,
          lesson_total: null,
          lesson_percentage: null,
          menu: parsed
            && Array.isArray(parsed.menus)
            && parsed.menus.length > 0
            ? parsed.menus[0].items : RESPONSE.body,
        };

        const cacheObject = 'WORDPRESS';
        const cacheSubObjectID = 'TUTORIALSMENU';
        const cacheObjectID = 'RAWMENUOBJECT';
        const cacheHolderInMilliseconds = wordpressCacheTimeOutInSeconds * 1000;
        global.adp.masterCache.set(
          cacheObject,
          cacheSubObjectID,
          cacheObjectID,
          global.adp.clone(prepareObjOrder),
          cacheHolderInMilliseconds,
        );
        RESOLVE(prepareObjOrder);
      } catch (ERRORONPREPARE) {
        const errorCode = ERRORONPREPARE.code || 500;
        const errorMessage = ERRORONPREPARE.message || 'Error got when it was trying to prepare Tutorials Object from Wordpress';
        const errorObject = {
          error: ERRORONPREPARE,
          response: RESPONSE,
          setupObj,
        };
        REJECT(errorLog(errorCode, errorMessage, errorObject, 'retrieveTutorialsMenuFromRemote', packName));
      }
    }
  });
});
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ onlyTheEssentials ]
* Creates a new menu array from the full menu array, but
* only with essentials fields for save/delete of /userProgress.
* This function does not change the original menu.
* @param {JSON} MENUOBJ The complete menu object, to be reduced.
* @return {JSON} New menu Object reduced to essentials fields.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const onlyTheEssentials = (MENUOBJ, MODE) => {
  let essentials;
  if (MODE === 'OPTMIZEDMENU') {
    essentials = [
      'ID',
      'menu_item_parent',
      'parent_slug',
      'object_id',
      'object',
      'url',
      'title',
      'date_content',
      'portal_url',
      'menu_item_parent',
      'type',
    ];
  } else {
    essentials = [
      'ID',
      'menu_item_parent',
      'parent_slug',
      'object_id',
      'url',
      'title',
      'date_content',
    ];
  }
  const menuEssentials = [];
  MENUOBJ.menu.forEach((MENUITEM) => {
    const item = {};
    Object.keys(MENUITEM).forEach((KEY) => {
      if (essentials.includes(KEY) === true) {
        item[KEY] = MENUITEM[KEY];
      }
    });
    menuEssentials.push(item);
  });
  return menuEssentials;
};
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ userProgressConversion ]
* Organize the user progress for the tutorialCards.
* @param {JSON} OBJ Menu Object after optmization.
* @return {JSON} Menu with the User Progress.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const userProgressConversion = (OBJ) => {
  const obj = OBJ;
  // Prepare "all" Path Progress Object
  if (obj && !obj.progress) {
    obj.progress = {};
  }
  obj.progress.path = {};
  obj.progress.tutorial = {};
  obj.progress.path.all = {
    chapter_completed: 0,
    chapter_total: 0,
    chapter_percentage: 0,
    lesson_completed: 0,
    lesson_total: 0,
    lesson_percentage: 0,
  };
  // Prepare "Dynamic" Path Objects
  const pathIDs = [];
  Object.keys(obj.paths).forEach((LEVEL) => {
    pathIDs.push(`${LEVEL}`);
    obj.progress.path[`${LEVEL}`] = {
      path_url: obj.paths[LEVEL],
      chapter_completed: 0,
      chapter_total: 0,
      chapter_percentage: 0,
      lesson_completed: 0,
      lesson_total: 0,
      lesson_percentage: 0,
    };
  });
  // Prepare "Dynamic" Tutorial Objects
  const tutorialsIDs = [];
  obj.menu.forEach((ITEM) => {
    if (pathIDs.includes(ITEM.menu_item_parent)) {
      tutorialsIDs.push(`${ITEM.ID}`);
      const path = obj
        && obj.progress
        && obj.progress.path
        && obj.progress.path[`${ITEM.menu_item_parent}`]
        ? obj.progress.path[`${ITEM.menu_item_parent}`].path_url
        : null;
      obj.progress.tutorial[ITEM.ID] = {
        path_id: `${ITEM.menu_item_parent}`,
        path_url: path,
        tutorial_url: ITEM.portal_url,
        lesson_completed: 0,
        lesson_total: 0,
        lesson_percentage: 0,
      };
      // Calculating Lessons inside of the Tutorial
      let lessonsQuant = 0;
      let lessonsComplete = 0;
      obj.menu.forEach((LESSON) => {
        if (LESSON.menu_item_parent === `${ITEM.ID}`) {
          lessonsComplete = (LESSON.user_progress_status === 'read') ? lessonsComplete + 1 : lessonsComplete;
          lessonsQuant += 1;
        }
      });
      obj.progress.tutorial[ITEM.ID].lesson_completed = lessonsComplete;
      obj.progress.tutorial[ITEM.ID].lesson_total = lessonsQuant;
      obj.progress.tutorial[ITEM.ID]
        .lesson_percentage = parseInt((((lessonsComplete * 100) / lessonsQuant).toFixed(0)), 10);
    }
  });
  // Spreading the calculations to the Paths
  Object.keys(obj.progress.tutorial).forEach((TUTORIALKEY) => {
    const theTutorial = obj.progress.tutorial[TUTORIALKEY];
    const thePath = obj.progress.path[theTutorial.path_id];

    thePath.chapter_completed += (theTutorial.lesson_percentage === 100) ? 1 : 0;
    if (theTutorial.lesson_total !== 0) {
      thePath.chapter_total += 1;
    }
    thePath.chapter_percentage = parseInt(((thePath
      .chapter_completed * 100) / thePath.chapter_total), 10);
    thePath.lesson_completed += theTutorial.lesson_completed;
    thePath.lesson_total += theTutorial.lesson_total;
    thePath.lesson_percentage = parseInt(((thePath
      .lesson_completed * 100) / thePath.lesson_total), 10);
  });
};
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ retrieveTutorialsMenu ]
* Check from where the tutorials menu should be retrieved
* ( from Wordpress Server or from Memory Cache ).
* Returns a Promise. Resolves if successful, reject if fails.
* @return {JSON} Object with the Tutorials Menu, not customized for the user at this point.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const retrieveTutorialsMenu = (ALTERNATIVE = false) => new Promise((RESOLVE, REJECT) => {
  const cacheObject = 'WORDPRESS';
  const cacheSubObjectID = 'TUTORIALSMENU';
  const cacheObjectID = ALTERNATIVE ? 'RAWMENUOBJECTALTERNATIVE' : 'RAWMENUOBJECT';
  global.adp.masterCache.get(
    cacheObject,
    cacheSubObjectID,
    cacheObjectID,
  )
    .then((CACHE) => {
      const cache = CACHE;
      cache.fromCache = true;
      RESOLVE(adp.clone(cache));
    })
    .catch(() => {
      if (ALTERNATIVE) {
        adp.wordpress.getMenus('tutorialscardmenu')
          .then((RESULT) => {
            const theAlternativeMenu = RESULT && RESULT.items ? RESULT.items : [];
            const alterNativeTutorialsMenu = {
              progress: {},
              menu: theAlternativeMenu,
              fromCache: false,
            };
            global.adp.tutorialsMenu.menuEssentialsAlternative = theAlternativeMenu;
            const cacheHolderInMilliseconds = wordpressCacheTimeOutInSeconds * 1000;
            global.adp.masterCache.set(
              cacheObject,
              cacheSubObjectID,
              cacheObjectID,
              adp.clone(alterNativeTutorialsMenu),
              cacheHolderInMilliseconds,
            );
            RESOLVE(alterNativeTutorialsMenu);
          })
          .catch((ERROR) => {
            const errorCode = ERROR.code || 500;
            const errorMessage = ERROR.message || 'Error got when it was trying to retrieve Tutorials Menu from Remote';
            const errorObject = {
              error: ERROR,
            };
            REJECT(errorLog(errorCode, errorMessage, errorObject, 'retrieveTutorialsMenu', packName));
          });
      } else {
        retrieveTutorialsMenuFromRemote()
          .then((PUREMENU) => {
            const pureMenu = PUREMENU;
            pureMenu.fromCache = false;
            global.adp.tutorialsMenu.menuEssentials = onlyTheEssentials(pureMenu);
            RESOLVE(pureMenu);
          })
          .catch((ERROR) => {
            const errorCode = ERROR.code || 500;
            const errorMessage = ERROR.message || 'Error got when it was trying to retrieve Tutorials Menu from Remote';
            const errorObject = {
              error: ERROR,
            };
            REJECT(errorLog(errorCode, errorMessage, errorObject, 'retrieveTutorialsMenu', packName));
          });
      }
    });
});
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ calculateTheProgressPreparingChapters ]
* Organize the chapters and apply the progress.
* @param {JSON} MENUOBJ The menu, not customized.
* @param {JSON} USERPROGRESS The user progress.
* @return {JSON} Object with the chapters and the lessons status.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const calculateTheProgressPreparingChapters = (MENUOBJ, USERPROGRESS, ALTERNATIVE = false) => {
  const groups = [];
  const chapters = {};
  const menuObj = MENUOBJ;
  menuObj.paths = {};
  menuObj.menu.forEach((ITEM) => {
    if (ITEM.menu_item_parent === 0 || ITEM.menu_item_parent === '0') {
      if (ALTERNATIVE) {
        groups.push(`${ITEM.ID}`);
        if (!menuObj.paths[`${ITEM.ID}`]) {
          menuObj.paths[`${ITEM.ID}`] = `${ITEM.portal_url}`;
        }
      } else {
        chapters[`c${ITEM.ID}`] = {
          wid: ITEM.object_id,
          read: [],
          notRead: [],
          readAgain: [],
          total: [],
        };
      }
    } else if (ALTERNATIVE && groups.includes(`${ITEM.menu_item_parent}`)) {
      chapters[`c${ITEM.ID}`] = {
        wid: ITEM.object_id,
        read: [],
        notRead: [],
        readAgain: [],
        total: [],
      };
    }
  });
  MENUOBJ.menu.forEach((ITEM) => {
    const obj = chapters[`c${ITEM.menu_item_parent}`];
    if (obj !== undefined) {
      obj.total.push(`${ITEM.object_id}`);
      let isRead = false;
      USERPROGRESS.forEach((PROGRESSITEM) => {
        if (`${PROGRESSITEM.wid}` === `${ITEM.object_id}`) {
          // PDC = progress date content ( From userProgress Database )
          // IDC = item date content ( From Wordpress )
          const typePDC = typeof PROGRESSITEM.date_content;
          const typeIDC = typeof ITEM.date_content;
          let isUndefinedOrEmptyPDC = false;
          let isUndefinedOrEmptyIDC = false;
          if (typePDC === 'undefined') {
            isUndefinedOrEmptyPDC = true;
          } else if (typePDC === 'string') {
            if (PROGRESSITEM.date_content.trim() === '') {
              isUndefinedOrEmptyPDC = true;
            }
          }
          if (typeIDC === 'undefined') {
            isUndefinedOrEmptyIDC = true;
          } else if (typeIDC === 'string') {
            if (ITEM.date_content.trim() === '') {
              isUndefinedOrEmptyIDC = true;
            }
          }
          if (isUndefinedOrEmptyIDC) {
            obj.read.push(`${ITEM.object_id}`);
          } else {
            const bothAreUndefinedOrEmpty = isUndefinedOrEmptyPDC && isUndefinedOrEmptyIDC;
            const bothAreEqualAsString = `${PROGRESSITEM.date_content}` === `${ITEM.date_content}`;
            if (bothAreUndefinedOrEmpty || (!bothAreUndefinedOrEmpty && bothAreEqualAsString)) {
              obj.read.push(`${ITEM.object_id}`);
            } else {
              obj.readAgain.push(`${ITEM.object_id}`);
            }
          }
          isRead = true;
        }
      });
      if (!isRead) {
        obj.notRead.push(`${ITEM.object_id}`);
      }
    }
  });
  return chapters;
};
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ calculateTheProgressDealWithChapter ]
* Process one chapter at time. Keep in mind the ITEM of
* Tutorials Menu will be changed by this function.
* @param {JSON} CHAPTERTARGET The Chapter which this function have to process.
* @param {JSON} ITEM The item of the Tutorials Menu.
* @param {Number} READCHAPTERS How many chapters were marked as "read".
* @param {Number} TOTALCHAPTERS How many chapters we have in total.
* @return {JSON} Object with new values (Number) for readChapters and totalChapters.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const calculateTheProgressDealWithChapter = (
  CHAPTERTARGET,
  ITEM,
  READCHAPTERS,
  TOTALCHAPTERS,
) => {
  const chapterTarget = CHAPTERTARGET;
  const item = ITEM;
  let readChapters = READCHAPTERS;
  let totalChapters = TOTALCHAPTERS;
  if (chapterTarget.total.length > 0) {
    const isRead = (chapterTarget.read.length > 0)
      && (chapterTarget.notRead.length === 0)
      && (chapterTarget.readAgain.length === 0);
    if (isRead) {
      item.user_progress_status = 'read';
      readChapters += 1;
    } else {
      const isNotRead = (chapterTarget.notRead.length > 0)
      && (chapterTarget.readAgain.length === 0);
      if (isNotRead === true) {
        item.user_progress_status = 'not-read';
      } else {
        const isReadAgain = (chapterTarget.readAgain.length > 0);
        if (isReadAgain === true) {
          item.user_progress_status = 'read-again';
        }
      }
    }
    totalChapters += 1;
  } else {
    item.user_progress_status = 'not-read';
  }
  return { readChapters, totalChapters };
};
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ calculateTheProgressDealWithLesson ]
* Process one lesson at time. Keep in mind the ITEM of
* Tutorials Menu will be changed by this function.
* @param {JSON} CHAPTERFROMLESSONTARGET The Chapter of the Lesson inside of ITEM.
* @param {JSON} ITEM The item of the Tutorials Menu.
* @param {Number} READLESSONS How many lessons were marked as "read".
* @param {Number} TOTALLESSONS How many lessons we have in total.
* @return {JSON} Object with new values (Number) for readLessons and totalLessons.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const calculateTheProgressDealWithLesson = (
  CHAPTERFROMLESSONTARGET,
  ITEM,
  READLESSONS,
  TOTALLESSONS,
) => {
  const chapterFromLessonTarget = CHAPTERFROMLESSONTARGET;
  const item = ITEM;
  let readLessons = READLESSONS;
  let totalLessons = TOTALLESSONS;
  const isRead = chapterFromLessonTarget.read.includes(`${item.object_id}`);
  if (isRead === true) {
    readLessons += 1;
    item.user_progress_status = 'read';
  } else {
    const isNotRead = chapterFromLessonTarget.notRead.includes(`${item.object_id}`);
    if (isNotRead === true) {
      item.user_progress_status = 'not-read';
    } else {
      const isReadAgain = chapterFromLessonTarget.readAgain.includes(`${item.object_id}`);
      if (isReadAgain === true) {
        item.user_progress_status = 'read-again';
      }
    }
  }
  totalLessons += 1;
  return { readLessons, totalLessons };
};
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ calculateTheProgress ]
* Prepare the menu for the authenticated user.
* @param {JSON} MENUOBJ The menu, not customized.
* @param {JSON} USERPROGRESS The return from database with
* all "progress" instances from the logged in user.
* @return {JSON} Object with the Tutorials Menu, now customized for the user.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const calculateTheProgress = (MENUOBJ, USERPROGRESS, ALTERNATIVE = false) => {
  const fullMenuObject = MENUOBJ;
  const processTimeStart = (new Date()).getTime();
  const chapters = calculateTheProgressPreparingChapters(
    fullMenuObject,
    USERPROGRESS.docs,
    ALTERNATIVE,
  );
  let readChapters = 0;
  let totalChapters = 0;
  let readLessons = 0;
  let totalLessons = 0;
  const twoLevelsMenuOnly = [];
  fullMenuObject.menu.forEach((ITEM) => {
    const item = ITEM;
    const chapterTarget = chapters[`c${item.ID}`];
    if (chapterTarget !== undefined && chapterTarget !== null) {
      ({ readChapters, totalChapters } = calculateTheProgressDealWithChapter(
        chapterTarget,
        item,
        readChapters,
        totalChapters,
      ));
      twoLevelsMenuOnly.push(ITEM);
    } else {
      const chapterFromLessonTarget = chapters[`c${item.menu_item_parent}`];
      if (chapterFromLessonTarget !== undefined) {
        ({ readLessons, totalLessons } = calculateTheProgressDealWithLesson(
          chapterFromLessonTarget,
          item,
          readLessons,
          totalLessons,
        ));
        twoLevelsMenuOnly.push(ITEM);
      }
    }
  });
  fullMenuObject.menu = global.adp.clone(twoLevelsMenuOnly);
  const processTimeEnd = (new Date()).getTime();
  fullMenuObject.chapter_completed = readChapters;
  fullMenuObject.chapter_total = totalChapters;
  fullMenuObject.chapter_percentage = `${((readChapters * 100) / totalChapters).toFixed(2)}`;
  if (fullMenuObject.chapter_percentage === 'NaN') {
    fullMenuObject.chapter_percentage = '0.00';
  }
  fullMenuObject.lesson_completed = readLessons;
  fullMenuObject.lesson_total = totalLessons;
  fullMenuObject.lesson_percentage = `${((readLessons * 100) / totalLessons).toFixed(2)}`;
  if (fullMenuObject.lesson_percentage === 'NaN') {
    fullMenuObject.lesson_percentage = '0.00';
  }
  fullMenuObject.processTimerInMilliseconds = processTimeEnd - processTimeStart;
  return fullMenuObject;
};
// ============================================================================================= //


// ============================================================================================= //
/**
* Private [ adjustTutorialsMenuToThisUser ]
* Retrieve the user progress from database or from cache.
* @param {String} SIGNUM String with the signum of the logged in user.
* @param {JSON} MENU The menu object.
* @param {Object} RBAC Object from [ adp.middleware.rbac ].
* Returns a Promise. Resolves if successful, reject if fails.
* @return {JSON} Object with the menu and the user progress.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const adjustTutorialsMenuToThisUser = (
  SIGNUM,
  MENU,
  RBAC,
) => new Promise((RESOLVE, REJECT) => {
  const databaseTimeStart = (new Date()).getTime();
  const dbModel = new adp.models.Userprogress();
  const menuForRBAC = MENU;
  let userAllowedContentIDs = null;
  if (RBAC !== undefined
    && RBAC[SIGNUM]
    && RBAC[SIGNUM].admin === false
    && RBAC[SIGNUM].allowed
    && Array.isArray(RBAC[SIGNUM].allowed.contents)) {
    userAllowedContentIDs = RBAC[SIGNUM].allowed.contents;
    const clonedMenu = menuForRBAC.menu;
    menuForRBAC.menu = [];
    clonedMenu.forEach((ITEM) => {
      if (userAllowedContentIDs.includes(ITEM.object_id)) {
        menuForRBAC.menu.push(ITEM);
      }
    });
  }
  const fullMenuObject = menuForRBAC;
  const cacheObject = 'TUTORIALSPROGRESS';
  const cacheSubObjectID = null;
  const cacheObjectID = SIGNUM;
  const cacheHolderInMilliseconds = userProgressTimeOutInSeconds * 1000;
  global.adp.masterCache.get(
    cacheObject,
    cacheSubObjectID,
    cacheObjectID,
  )
    .then((CACHE) => {
      const cache = CACHE;
      const databaseTimeEnd = (new Date()).getTime();
      fullMenuObject.dataBaseTimerInMilliseconds = databaseTimeEnd - databaseTimeStart;
      fullMenuObject.progressFromCache = true;
      RESOLVE({ menu: fullMenuObject, progress: cache });
    })
    .catch(() => {
      dbModel.getAllProgressFromThisUser(SIGNUM, userAllowedContentIDs)
        .then((PROGRESSRESULT) => {
          if (Array.isArray(PROGRESSRESULT.docs)) {
            global.adp.masterCache.set(
              cacheObject,
              cacheSubObjectID,
              cacheObjectID,
              PROGRESSRESULT,
              cacheHolderInMilliseconds,
            );
            const userProgress = PROGRESSRESULT;
            const databaseTimeEnd = (new Date()).getTime();
            fullMenuObject.dataBaseTimerInMilliseconds = databaseTimeEnd - databaseTimeStart;
            fullMenuObject.progressFromCache = false;
            RESOLVE({ menu: fullMenuObject, progress: userProgress });
          } else {
            const errorCode = 500;
            const errorMessage = 'Error when it was trying to set the cache';
            const errorObject = {
              error: 'The [ PROGRESSRESULT.docs ] should be an array',
              signum: SIGNUM,
              databaseAnswer: PROGRESSRESULT,
            };
            REJECT(errorLog(errorCode, errorMessage, errorObject, 'adjustTutorialsMenuToThisUser', packName));
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error when it was trying to get all the progress from the user';
          const errorObject = {
            error: ERROR,
            signum: SIGNUM,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'adjustTutorialsMenuToThisUser', packName));
        });
    });
});
// ============================================================================================= //


// ============================================================================================= //
/**
* [ global.adp.tutorialsMenu.get ]
* Retrieve the tutorials menu from cache, database or from Wordpress.
* @param {String} SIGNUM String with the signum of the logged in user.
* @param {Object} RBAC Object from [ adp.middleware.rbac ].
* Returns a Promise. Resolves if successful, reject if fails.
* @return {JSON} Object with the tutorials menu customized for the logged in user,
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const getTutorialsMenu = (SIGNUM, RBAC, ALTERNATIVE = false) => new Promise((RESOLVE, REJECT) => {
  const startTime = (new Date()).getTime();
  fetchWordPressConfig();
  retrieveTutorialsMenu(ALTERNATIVE)
    .then((RESULT) => {
      const fullMenu = RESULT;
      fullMenu.menu = onlyTheEssentials(RESULT, 'OPTMIZEDMENU');
      const endTime = (new Date()).getTime();
      adjustTutorialsMenuToThisUser(SIGNUM, fullMenu, RBAC, ALTERNATIVE)
        .then((FINALRESULT) => {
          const resultToSend = calculateTheProgress(
            FINALRESULT.menu,
            FINALRESULT.progress,
            ALTERNATIVE,
          );
          let message = 'Menu from';
          if (resultToSend.fromCache) {
            message = `${message} Cache`;
          } else {
            message = `${message} Wordpress`;
          }
          if (resultToSend.progressFromCache !== true) {
            message = `${message} in ${endTime - startTime}ms,`;
            message = `${message} [${SIGNUM}] progress from database in ${resultToSend.dataBaseTimerInMilliseconds}ms and`;
            message = `${message} calculations in ${resultToSend.processTimerInMilliseconds}ms.`;
            echo(message, null, 200, packName);
          }
          delete resultToSend.dataBaseTimerInMilliseconds;
          delete resultToSend.processTimerInMilliseconds;
          delete resultToSend.progressFromCache;
          if (ALTERNATIVE) {
            userProgressConversion(resultToSend);
          }
          delete resultToSend.paths;
          RESOLVE(resultToSend);
          return resultToSend;
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error when it was trying to adjust the tutorials menu to the user';
          const errorObject = {
            error: ERROR,
            signum: SIGNUM,
            rbac: RBAC,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'getTutorialsMenu', packName));
        });
    })
    .catch((ERROR) => {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || 'Error when it was trying to retrieve tutorials menu';
      const errorObject = {
        error: ERROR,
        signum: SIGNUM,
        rbac: RBAC,
      };
      REJECT(errorLog(errorCode, errorMessage, errorObject, 'getTutorialsMenu', packName));
    });
});
// ============================================================================================= //
module.exports = {
  getTutorialsMenu,
  retrieveTutorialsMenuFromRemote,
  fetchWordPressConfig,
  userProgressConversion,
};
