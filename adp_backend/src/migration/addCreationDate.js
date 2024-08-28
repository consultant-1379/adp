/**
* [ global.adp.migration.addCreationDate ]
* Add creation date to Microservices( ADPPRG-99061 )
* And also convert date_modified field value to ISO date format.
* @author Githu Jeeva Savy [zjeegit]
*/

module.exports = MS => new Promise((RESOLVE, REJECT) => {
  const updatedMS = MS;
  updatedMS.date_modified = new Date(updatedMS.date_modified);
  const adpLogModel = new adp.models.AdpLog();
  adpLogModel.getNewAssetById(MS._id).then((result) => {
    if (result.resultsReturned !== 0) {
      updatedMS.date_created = new Date(result.docs[0].datetime);
      RESOLVE(updatedMS);
    } else {
      updatedMS.date_created = new Date('2019-03-01T12:00:00.000Z');
      RESOLVE(updatedMS);
    }
  }).catch((error) => {
    const errorObj = {
      message: 'Failed to add creation date',
      code: 500,
      data: {
        MS, error, origin: 'migration.addCreationDate',
      },
    };
    REJECT(errorObj);
  });
});
