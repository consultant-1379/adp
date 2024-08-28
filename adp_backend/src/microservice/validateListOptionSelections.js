// ============================================================================================= //
/**
* [ global.adp.microservice.validateListOptionSelections ]
* Confirms that the giving ms values do not contain listoptions
* select-ids that are out of bounds to the related group.
* @param {JSON} MS JSON Object with the MicroService to be validated.
* @return {object} Returns an object with a boolean if the listoption values are valid
* and an array of any errors that are out of bounds.
* @author Cein [edaccei]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = MS => new Promise((resolve) => {
  const dbModelListoption = new adp.models.Listoption();
  const returnObj = {
    valid: true,
    errorList: [],
  };

  /**
   * Builds a object of the listoption group slug and the related list of select-ids for that group.
   * @param {arr} groupArr The list of listoption type group data
   * @param {arr} itemArr the list of listoption type item data
   * @returns {obj} object of group slug keys relating each slug to
   * an array of related item select-ids to those slugs.
   * @author Cein
   */
  function quickLookUpObj(groupArr, itemArr) {
    const groupItemIdCheckList = {};
    const idKeyLookupObj = {};
    groupArr.forEach((groupObj) => {
      if (groupObj.slug && groupObj['group-id']) {
        idKeyLookupObj[groupObj['group-id']] = groupObj.slug;
        groupItemIdCheckList[groupObj.slug] = [];
      }
    });

    itemArr.forEach((itemObj) => {
      const groupSlug = idKeyLookupObj[itemObj['group-id']];
      if (itemObj['group-id'] && typeof itemObj['select-id'] !== 'undefined' && groupSlug) {
        groupItemIdCheckList[groupSlug].push(itemObj['select-id']);
      }
    });

    return groupItemIdCheckList;
  }

  /**
   * Validates that the given listoption values of a microservice actually exist
   * @param {obj} groupItemIdCheckList object of group slug keys relating each slug to
   * an array of related item select-ids to those slugs.
   * @author Cein
   */
  function compareMSToCheckList(groupItemIdCheckList) {
    Object.keys(groupItemIdCheckList).forEach((groupSlug) => {
      const selectedIdToConfirm = MS[groupSlug];
      const findSelectId = groupItemIdCheckList[groupSlug].indexOf(selectedIdToConfirm);
      if (typeof selectedIdToConfirm !== 'undefined' && findSelectId === -1) {
        returnObj.valid = false;
        returnObj.errorList.push(`The list option group ${groupSlug} does not contain an item of id ${selectedIdToConfirm}`);
      }
    });
  }

  dbModelListoption.indexGroups().then((listOptionGroupResult) => {
    dbModelListoption.indexItems().then((listOptionItemResult) => {
      const checkList = quickLookUpObj(listOptionGroupResult.docs, listOptionItemResult.docs);
      compareMSToCheckList(checkList);
      return resolve(returnObj);
    }).catch(() => {
      returnObj.valid = false;
      returnObj.errorList.push('Failure to fetch Listoption Items');
      return resolve(returnObj);
    });
  }).catch(() => {
    returnObj.valid = false;
    returnObj.errorList.push('Failure to fetch Listoption Groups');
    return resolve(returnObj);
  });
});
