/**
* [ adp.models.PrimeDDTable ]
* primeDDTable Database Model
* @author Tirth [zpiptir]
*/
adp.docs.list.push(__filename);

class PrimeDDTable {
  constructor() {
    this.dbMongoCollection = 'primeDDTable';
  }

  /**
   * Get all documents form Collection primeDDTable
   * @returns {promise} response of the request
   * @author Tirth [zpiptir]
   */
  getAll() {
    const mongoQuery = {};
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }
}

module.exports = PrimeDDTable;
