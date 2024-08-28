/* eslint-disable no-param-reassign */
const packName = 'global.adp.quickReports.innersourceData';

/**
 * This method is returning error response in standard form
 * @param {string} msg Error message for response
 * @param {number} code Error code for response
 * @returns Error response Object
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const rejectResp = (msg, code) => ({
  msg,
  code,
});

/**
 * This function is used to fetch innersource data for
 * given dates parameters
 * @returns Promise with response users
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
function fetchUsersFromDateToDate(fromDate, toDate) {
  return new Promise((RES, REJ) => {
    const regexDate = /\d{4}-\d{2}-\d{2}/;
    if (!(fromDate && toDate)) {
      return REJ(rejectResp('From Date and To Date should be provided', 400));
    }
    if (!fromDate.match(regexDate) || !toDate.match(regexDate)) {
      return REJ(rejectResp('Date should be in YYYY-MM-DD format only', 400));
    }
    const gitstatusModel = new global.adp.models.Gitstatus();
    return gitstatusModel.getDataForDates(fromDate, toDate).then((commitsData) => {
      let commitsForServices = [];
      const assetIds = commitsData.docs.map(
        reg => reg.asset_id,
      ).filter((v, i, a) => a.indexOf(v) === i);
      assetIds.forEach((assetId) => {
        const users = [];
        const commitsDataForAsset = commitsData.docs.filter(reg => reg.asset_id === assetId);
        const signums = commitsDataForAsset.map(
          reg => reg.signum,
        ).filter((v, i, a) => a.indexOf(v) === i);
        signums.forEach((user) => {
          const userRegistors = commitsDataForAsset.filter(reg => reg.signum === user);
          userRegistors.map(x => delete x.asset_id);
          users.push(userRegistors.reduce((accVal, curVal) => ({
            commits: accVal.commits + curVal.commits,
            deletions: accVal.deletions + curVal.deletions,
            insertions: accVal.insertions + curVal.insertions,
            name: curVal.name,
            email: curVal.email,
            signum: curVal.signum,
            organisation: curVal.organisation || '',
            asset_name: curVal.asset_name,
          })));
        });
        commitsForServices = commitsForServices.concat(users.sort(global.adp.dynamicSort('-insertions')));
      });
      const headersObject = {
        asset_name: 'Service Name',
        name: 'Author',
        email: 'Email',
        signum: 'Signum',
        organisation: 'Organisation',
        commits: 'Commits',
        insertions: 'Additions',
        deletions: 'Deletions',
      };
      const xlsxHeaders = {
        sheet1: headersObject,
      };
      const xlsxData = {
        sheet1: commitsForServices,
      };
      const xlsxGen = new global.adp.quickReports.XlsxGenerator(
        'InnersourceData', [{ name: 'sheet1', slug: 'sheet1' }], xlsxHeaders, xlsxData,
      );
      return RES(xlsxGen.createWorkbook());
    })
      .catch((ERROR) => {
        adp.echoLog('Error Fetching contributors from DB', ERROR, 500, packName, true);
        return REJ(rejectResp('Error while accessing Database', 500));
      });
  });
}

module.exports = {
  fetchUsersFromDateToDate,
};
