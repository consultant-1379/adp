/**
 * [ adp.quickReports.ExternalContributorsList ]
 * One-time External Contributors List Report
 * @author Armando Dias [ zdiaarm ]
 */
/* eslint-disable camelcase */

class ExternalContributorsList extends adp.models.Gitstatus {
  constructor() {
    super();
    this.format = 'xlsx';
    this.formats = ['xlsx'];
    this.packName = 'adp.quickReports.ExternalContributorsList';
  }

  /**
   * Fetch the newest 'gerritContributorsStatistics' log from adpLog
   * @returns {promise} The field 'externalContributorsByAsset'
   * @author Armando Dias [ zdiaarm ]
   */
  fetchCommitsFromAsset(ASSETID) {
    return new Promise((RESOLVE, REJECT) => {
      super.getCommitsByAssetForPeriod(ASSETID, '2020-01-01')
        .then((COMMITS) => {
          if (Array.isArray(COMMITS.docs) && COMMITS.docs.length > 0) {
            let users = [];
            const signums = COMMITS.docs.map(reg => reg.signum)
              .filter((v, i, a) => a.indexOf(v) === i);
            signums.forEach((user) => {
              const userRegistors = COMMITS.docs.filter(reg => reg.signum === user);
              users.push(userRegistors.reduce((accVal, curVal) => ({
                commits: accVal.commits + curVal.commits,
                deletions: accVal.deletions + curVal.deletions,
                insertions: accVal.insertions + curVal.insertions,
                name: curVal.name,
                email: curVal.email,
                signum: curVal.signum,
              })));
            });
            users = users.sort(global.adp.dynamicSort('-insertions'));
            RESOLVE(users);
          } else {
            RESOLVE(null);
          }
        })
        .catch((ERROR) => {
          const errorText = 'Error in [ super.getCommitsByAssetForPeriod() ] at [ fetchCommitsFromAsset ]';
          const errorObj = { level: 1, error: ERROR };
          adp.echoLog(errorText, errorObj, 500, this.packName, false);
          REJECT(errorObj);
        });
    });
  }


  /**
   * Generate the one-time report about External Contributors
   * @returns {promise} The report
   * @author Armando Dias [ zdiaarm ]
   */
  get() {
    // ----------------------------------------------------------------------------------------- //
    const cacheErrorMessage = () => {
      const errorText = 'No cache object found. This script doesn`t have authorisation to recreate the cache.';
      adp.echoLog(errorText, null, 500, this.packName, false);
      return errorText;
    };
    // ----------------------------------------------------------------------------------------- //
    return new Promise((RESOLVE, REJECT) => {
      if (adp.masterCache.cache === undefined) {
        REJECT(cacheErrorMessage());
        return;
      }
      if (adp.masterCache.cache.ALLASSETS === undefined) {
        REJECT(cacheErrorMessage());
        return;
      }
      let allAssetsIndex = -1;
      const allAssets = [];
      const allAssetsFromCache = adp.masterCache.cache.ALLASSETS;
      const fileName = `ExternalContributorsOneTimeReport_${adp.dateFormat(new Date(), true)}`;
      const sheetSlugs = ['index'];
      const xlsxHeaders = {};
      const xlsxData = {};
      const listOptions = JSON.parse(adp.masterCache.cache.LISTOPTIONS['Q0FDSEU='].cache.data);
      const listOptionsServiceCategoryItems = listOptions.find(ITEM => ITEM.id === 2).items;
      Object.keys(allAssetsFromCache).forEach((ID) => {
        const { name, slug, service_category } = allAssetsFromCache[ID].cache.data;
        const sheetName = slug.replace(/-/gim, '').substring(0, 29);
        const serviceCategory = listOptionsServiceCategoryItems
          .find(ITEM => ITEM.id === service_category).name;
        allAssets.push({
          id: global.Base64.decode(ID),
          name,
          slug,
          service_category: serviceCategory,
          sheetName,
        });
      });
      const prepareIndexPage = () => {
        xlsxHeaders.index = {
          asset: 'Asset Name',
          category: 'Service Category',
        };
        xlsxData.index = [];
      };
      const prepareThisAsset = () => {
        allAssetsIndex += 1;
        if (allAssets[allAssetsIndex] === undefined) {
          xlsxData.index = xlsxData.index.sort(adp.dynamicSort('category', 'asset'));
          const xlsxGen = new global.adp.quickReports.XlsxGenerator(
            fileName, sheetSlugs, xlsxHeaders, xlsxData,
          );
          RESOLVE(xlsxGen.createWorkbook());
          return;
        }
        const asset = allAssets[allAssetsIndex];
        this.fetchCommitsFromAsset(asset.id)
          .then((EUSERS) => {
            if (EUSERS !== null) {
              // Index Page :: Begin
              xlsxData.index.push({
                asset: `=HYPERLINK("#${asset.sheetName}!A1", "${asset.name}")`,
                category: asset.service_category,
              });
              // Index Page :: End
              sheetSlugs.push(asset.sheetName);
              xlsxHeaders[asset.sheetName] = {
                asset: `=HYPERLINK("#index!A1", "${asset.name}")`,
                signum: 'Signum',
                name: 'Name',
                email: 'Email',
                commits: 'Commits',
                insertions: 'Insertions',
                deletions: 'Deletions',
              };
              EUSERS.forEach((EUSER) => {
                const {
                  signum,
                  name,
                  email,
                  commits,
                  insertions,
                  deletions,
                } = EUSER;
                if (xlsxData[asset.sheetName] === undefined) {
                  xlsxData[asset.sheetName] = [];
                }
                xlsxData[asset.sheetName].push({
                  signum,
                  name,
                  email,
                  commits,
                  insertions,
                  deletions,
                });
              });
            }
            return prepareThisAsset();
          })
          .catch((ERROR) => {
            if (ERROR.level !== 1) {
              const errorText = 'Error in [ super.getCommitsByAssetForPeriod() ] at [ fetchCommitsFromAsset ]';
              const errorObj = { level: 1, error: ERROR };
              adp.echoLog(errorText, errorObj, 500, this.packName, false);
            }
            return prepareThisAsset();
          });
      };
      prepareIndexPage();
      prepareThisAsset();
    });
  }
}

module.exports = ExternalContributorsList;
