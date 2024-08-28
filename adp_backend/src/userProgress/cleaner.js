// ============================================================================================= //
/**
* [ global.adp.userProgress.cleaner ]
* Returns a new object with allowed items.
* @param {String} WID The Wordpress ID of the target lesson, to display its chapter.
* @param {JSON} MENU The menu to be cleaned.
* @return A JSON Menu, but only with important items.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
module.exports = (WID, MENU) => {
  const menu = global.adp.clone(MENU);
  let chapterID = null;
  const allowed = ['ID', 'user_progress_status'];
  let chapter = {};
  const lessons = menu.filter(ITEM => (`${ITEM.object_id}` === `${WID}`));
  if (Array.isArray(lessons) && lessons.length > 0) {
    const lesson = lessons[0];
    chapterID = lesson.menu_item_parent;
    const chapters = menu.filter(ITEM => (`${ITEM.ID}` === `${chapterID}`));
    if (Array.isArray(chapters) && chapters.length > 0) {
      chapter = chapters[0];
      Object.keys(chapter).forEach((KEY) => {
        if (!allowed.includes(KEY)) {
          delete chapter[KEY];
        }
      });
    }
  }
  return chapter;
};
// ============================================================================================= //
