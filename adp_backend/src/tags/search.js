// ============================================================================================= //
/**
* [ global.adp.tags.search ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (P1, P2) => new Promise(async (RESOLVE) => {
  await global.adp.tags.reload()
    .catch((ERROR) => {
      const errorText = 'Error on [ adp.tags.reload ]';
      const errorObject = { error: ERROR };
      adp.echoLog(errorText, errorObject, 500, 'adp.tags.search', true);
    });
  let res = [];
  let p1 = P1;
  let p2 = P2;
  let isGroupOnp1 = false;
  if (typeof p1 === 'string') {
    isGroupOnp1 = (p1.toLowerCase().trim() === 'group') || (p1.toLowerCase().trim() === 'groups');
  }
  let isGroupOnp2 = false;
  if (typeof p2 === 'string') {
    isGroupOnp2 = (p2.toLowerCase().trim() === 'group') || (p2.toLowerCase().trim() === 'groups');
  }
  if (isGroupOnp1 && !isGroupOnp2) {
    await global.adp.tags.codeToTag(P2, 'GROUP')
      .then((NAME) => { p2 = NAME; });
  } else if (!isGroupOnp1 && !isGroupOnp2) {
    await global.adp.tags.codeToTag(P1, 'TAG')
      .then((NAME) => { p1 = NAME; });
    await global.adp.tags.codeToTag(P2, 'TAG')
      .then((NAME) => { p2 = NAME; });
  }
  if ((isGroupOnp1 && !isGroupOnp2) || (isGroupOnp1 && isGroupOnp2)) {
    if (p2 !== null && p2 !== undefined) {
      const arrayConversion = p2.split(',');
      if (Array.isArray(arrayConversion)) {
        if (arrayConversion.length === 1) {
          // - - - Group Request, with one (Partial) name :: BEGIN - - - - - - - - - - - - - - - //
          res = [];
          global.adp.tags.groups.forEach((groupItem) => {
            const p2toCheck = p2.toLowerCase().trim();
            const itemName = groupItem.name.toLowerCase().trim();
            const itemPartialName = itemName.substr(0, p2toCheck.length);
            if ((p2toCheck === itemName) || (p2toCheck === itemPartialName)) {
              const groupObj = {
                group: groupItem.group,
                name: groupItem.name,
                tags: groupItem.tags,
              };
              res.push(groupObj);
            }
          });
          res = res.sort(global.adp.dynamicSort('name'));
          // - - - Group Request, with one (Partial) name :: END - - - - - - - - - - - - - - - - //
        } else {
          // - - - Group Request, with names in an Array :: BEGIN - - - - - - - - - - - - - - - -//
          res = [];
          arrayConversion.forEach((name) => {
            const nameToCheck = name.toLowerCase().trim();
            global.adp.tags.groups.forEach((groupItem) => {
              const itemName = groupItem.name.toLowerCase().trim();
              const itemPartialName = itemName.substr(0, nameToCheck.length);
              if ((nameToCheck === itemName) || (nameToCheck === itemPartialName)) {
                const groupObj = {
                  group: groupItem.group,
                  name: groupItem.name,
                  tags: groupItem.tags,
                };
                res.push(groupObj);
              }
            });
          });
          res = res.sort(global.adp.dynamicSort('name'));
          // - - - Group Request, with names in an Array :: END - - - - - - - - - - - - - - - - -//
        }
      }
    }
  } else if (!isGroupOnp1 && isGroupOnp2) {
    // - - - Group Request, no parameters, returns all groups with all tags :: BEGIN - - - - - //
    res = [];
    global.adp.tags.groups.forEach((groupItem) => {
      const groupObj = {
        group: groupItem.group,
        name: groupItem.name,
        tags: groupItem.tags,
      };
      res.push(groupObj);
    });
    res = res.sort(global.adp.dynamicSort('name'));
    // - - - Group Request, no parameters, returns all groups with all tags :: END - - - - - - //
  } else if (!isGroupOnp1 && !isGroupOnp2) {
    if (p2 !== null && p2 !== undefined) {
      const arrayConversion = p2.split(',');
      if (Array.isArray(arrayConversion)) {
        if (arrayConversion.length === 1) {
          // - - - Tag Request, with one (Partial) name :: BEGIN - - - - - - - - - - - - - - - - //
          res = [];
          global.adp.tags.items.forEach((item) => {
            const p2toCheck = p2.toLowerCase().trim();
            const itemName = item.tag.toLowerCase().trim();
            const itemPartialName = itemName.substr(0, p2toCheck.length);
            if ((p2toCheck === itemName) || (p2toCheck === itemPartialName)) {
              const obj = {
                id: item.id,
                label: item.tag,
              };
              res.push(obj);
            }
          });
          res = res.sort(global.adp.dynamicSort('tag'));
          // - - - Tag Request, with one (Partial) name :: END - - - - - - - - - - - - - - - - - //
        } else {
          // - - - Tag Request, with names in an Array :: BEGIN - - - - - - - - - - - - - - - - -//
          res = [];
          arrayConversion.forEach((name) => {
            const nameToCheck = name.toLowerCase().trim();
            global.adp.tags.items.forEach((item) => {
              const itemName = item.tag.toLowerCase().trim();
              const itemPartialName = itemName.substr(0, nameToCheck.length);
              if ((nameToCheck === itemName) || (nameToCheck === itemPartialName)) {
                const obj = {
                  id: item.id,
                  label: item.tag,
                };
                res.push(obj);
              }
            });
          });
          res = res.sort(global.adp.dynamicSort('tag'));
          // - - - Tag Request, with names in an Array :: END - - - - - - - - - - - - - - - - - -//
        }
      }
    } else {
      // - - - Tag Request, no parameters, returns all :: BEGIN - - - - - - - - - - - - - - - - -//
      res = [];
      global.adp.tags.items.forEach((item) => {
        const obj = {
          id: item.id,
          label: item.tag,
        };
        res.push(obj);
      });
      res = res.sort(global.adp.dynamicSort('tag'));
      // - - - Tag Request, no parameters, returns all :: END - - - - - - - - - - - - - - - - - -//
    }
  }
  const result = {};
  if (res.length === 0) {
    result.code = 200;
    result.msg = '200 - Nothing was found. Please, try to change or remove parameters!';
  } else {
    result.code = 200;
    result.msg = '200 - Ok, search was successful!';
  }
  result.cache = `Updated in ${global.adp.dateFormat(global.adp.tags.updated)}`;
  result.data = res;
  RESOLVE(result);
});
// ============================================================================================= //
