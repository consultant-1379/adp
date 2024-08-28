// ============================================================================================= //
/**
* [ global.adp.tags.count ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (P1, P2) => new Promise(async (RESOLVE) => {
  let tagCounter = 0;
  let realP2 = P2;
  if (typeof P1 === 'string') {
    if ((P1.toLowerCase().trim() === 'group') || (P1.toLowerCase().trim() === 'groups')) {
      let p2 = [];
      if (P2.indexOf(',') >= 0) {
        p2 = P2.split(',');
      } else {
        p2[0] = P2;
      }
      let tagsExpand = '';
      global.adp.tags.groups.forEach((g) => {
        p2.forEach((V2) => {
          if (parseInt(g.group, 10) === parseInt(V2, 10)) {
            g.tags.forEach((item) => {
              if (tagsExpand === '') {
                tagsExpand = item.id;
              } else {
                tagsExpand = `${tagsExpand},${item.id}`;
              }
            });
          }
        });
      });
      realP2 = tagsExpand;
    }
  }
  const tags = await global.adp.tags.search(null, realP2);

  const canSend = () => {
    tagCounter += 1;
    if (tagCounter >= tags.data.length) {
      const res = tags;
      const result = {};
      if (res.length === 0) {
        result.code = 404;
        result.msg = '404 - Nothing was found. Please, try to change or remove parameters!';
      } else {
        result.code = 200;
        result.msg = '200 - Ok, count was successful!';
      }
      result.cache = `Updated in ${global.adp.dateFormat(global.adp.tags.updated)}`;
      result.data = res.data;
      RESOLVE(result);
      global.adp.tags.reload()
        .then(() => {})
        .catch(() => {});
    }
  };

  if (Array.isArray(tags.data)) {
    const items = tags.data;
    items.forEach((I) => {
      const i = I;
      const b1 = (i.id !== null && i.id !== undefined);
      const b2 = (i.tag !== null && i.tag !== undefined);
      if (b1 && b2) {
        const ID = i.id;
        const JSONSelector = {
          selector: {
            type: { $eq: 'microservice' },
            deleted: { $exists: false },
            tags: { $in: [ID, `${ID}`] },
          },
          limit: 9999999,
          skip: 0,
          execution_stats: true,
        };
        const DB = 'dataBase';
        global.adp[DB].find(JSONSelector)
          .then((OBJ) => {
            i.quant = OBJ.execution_stats.results_returned;
            canSend();
          })
          .catch((ERROR) => {
            const errorText = 'Error in [ global.adp[DB].find ]';
            const errorOBJ = {
              database: 'dataBase',
              query: JSONSelector,
              error: ERROR,
            };
            const packName = 'global.adp.tags.count';
            adp.echoLog(errorText, errorOBJ, 500, packName, true);
          });
      }
    });
  }
});
// ============================================================================================= //
