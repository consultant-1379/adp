const packName = 'adp.tutorialAnalytics.get';

/**
 * This function is used to return the normalized Title.
 * It removes the superscript and subscript tags.
 * @param {string} title That needs to be normalized
 * @returns Normalized title
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const normalizeTitle = (title) => {
  let tutorialTitle = title.replace(/<sup>/g, ' ');
  tutorialTitle = tutorialTitle.replace(/<\/sup>/g, ' ');
  tutorialTitle = tutorialTitle.replace(/<sub>/g, ' ');
  tutorialTitle = tutorialTitle.replace(/<\/sub>/g, ' ');
  return tutorialTitle;
};

/**
 * This function is used to update the counter of tutorial count for a user
 * @param {object} counter Current counts for the tutorials
 * @param {object} MenuResp Tutorial menu for the user
 * @returns Counter of the tutorials completed for a user
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const updateCounter = (counter, MenuResp) => {
  const tempCounter = counter;
  const allTutorials = MenuResp.filter(menuObj => menuObj.menu_item_parent === '0');
  const completedTutorialsByUser = allTutorials.filter(menuObj => menuObj.user_progress_status && menuObj.user_progress_status === 'read');
  completedTutorialsByUser.forEach((tutObj) => {
    if (counter[tutObj.object_id]) {
      tempCounter[tutObj.object_id] += 1;
    } else {
      tempCounter[tutObj.object_id] = 1;
    }
  });
  const completedTutorialIdsByUser = completedTutorialsByUser.map(tutObj => tutObj.object_id);
  const incompletedTutorialsByUser = allTutorials.filter(
    menuObj => !completedTutorialIdsByUser.includes(menuObj.object_id),
  );
  incompletedTutorialsByUser.forEach((tutObj) => {
    if (!counter[tutObj.object_id]) {
      tempCounter[tutObj.object_id] = 0;
    }
  });
  return tempCounter;
};

/**
 * This function is used to remove the items that do not have children elements
 * @param {object} menuResponse Tutorials menu for a user
 * @return Processed menu
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const processMenu = (menuResponse) => {
  const processedMenu = [];
  menuResponse.menu.every((menuObj, index) => {
    if (index === menuResponse.menu.length - 1 && menuObj.menu_item_parent === '0') {
      return true;
    }
    if (index + 1 !== menuResponse.menu.length && menuResponse.menu[index + 1].menu_item_parent === '0') {
      return true;
    }
    processedMenu.push(menuObj);
    return true;
  });
  return processedMenu;
};

module.exports = () => new Promise((RES, REJ) => {
  const { TutorialRegistryClass } = global.adp.metrics.register;
  let counter = {};
  let allUsers = [];
  let DBRESULT = [];
  global.customRegisters.tutorialRegistry.resetMetrics();
  const dbModel = new adp.models.Userprogress();
  dbModel.getAllProgress().then((RESULT) => {
    if (Array.isArray(RESULT.docs)) {
      allUsers = [...new Set(RESULT.docs.map(userObj => userObj.signum))];
      DBRESULT = RESULT.docs;
      if (allUsers.length === 0) {
        RES();
        return;
      }

      const getTutorialsDataForSingleUser = (index) => {
        const cacheObject = 'TUTORIALSPROGRESS';
        const cacheSubObjectID = null;
        const userProgressTimeOutInSeconds = global.adp.masterCacheTimeOut
          .userProgressTutorials;
        const cacheHolderInMilliseconds = userProgressTimeOutInSeconds * 1000;
        const PROGRESSRESULT = {
          docs: DBRESULT.filter(USR => USR.signum === allUsers[index]),
        };
        global.adp.masterCache.set(
          cacheObject,
          cacheSubObjectID,
          allUsers[index],
          PROGRESSRESULT,
          cacheHolderInMilliseconds,
        );
        global.adp.tutorialsMenu.get.getTutorialsMenu(allUsers[index]).then((tutMenuForUser) => {
          const filteredMenu = processMenu(tutMenuForUser);
          counter = updateCounter(counter, filteredMenu);
          global.adp.masterCache.clear(cacheObject);
          const tempIndex = index + 1;
          if (tempIndex < allUsers.length) {
            getTutorialsDataForSingleUser(tempIndex);
          } else {
            Object.keys(counter).forEach((tutId) => {
              const name = normalizeTitle(tutMenuForUser.menu.find(
                menuObj => menuObj.object_id === tutId,
              ).title);
              TutorialRegistryClass.addTutorialMetricLabelByName(name, tutId, counter[tutId]);
            });
            RES();
          }
        });
      };
      getTutorialsDataForSingleUser(0);
    }
  })
    .catch((ERROR) => {
      const errorText = 'Error in [ dbModel.getAllProgress ]';
      const errorOBJ = {
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      REJ();
    });
});
