/**
* [ adp.models.MicroserviceElasticsearchDocumentationSyncReport ]
* MicroserviceElasticsearchDocumentationSyncReport Database Model
* @author Tirth Pipalia [zpiptir]
*/
adp.docs.list.push(__filename);

class MicroserviceElasticsearchDocumentationSyncReport {
  constructor() {
    this.dbMongoCollection = 'microserviceElasticsearchDocumentationSyncReport';
  }

  /**
 * Creates a log entry into database
 * @param {object} OBJ JSON Object with details
 * @author Tirth Pipalia [zpiptir]
 */
  async createOne(OBJ) {
    if (!adp.models.SyncReportCheckIndex) {
      adp.models.SyncReportCheckIndex = 'checked';
      await adp.mongoDatabase.collection(this.dbMongoCollection).createIndex(
        { syncReportsExpiresAt: 1 },
        { syncReportsExpiresAt: 0 },
      );
    }
    const obj = OBJ;
    const now = new Date();
    obj.syncReportsExpiresAt = new Date(now.setMonth(now.getMonth() + 1));
    return adp.db.create(this.dbMongoCollection, obj);
  }
}

module.exports = MicroserviceElasticsearchDocumentationSyncReport;
