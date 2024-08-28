/**
* [ adp.models.EchoLog ]
* EchoLog Database Model
* @author Armando Dias [zdiaarm]
*/
adp.docs.list.push(__filename);


class Adp {
  constructor() {
    this.dbMongoCollection = 'echoLog';
  }


  /**
   * Creates a echoLog entry into database,
   * if necessary creates an Index to delete
   * automatically the entry after three months.
   * @param {object} OBJ JSON Object with details
   * @author Armando Dias [zdiaarm]
   */
  async createOne(OBJ) {
    if (!adp.models.EchoLogCheckIndex) {
      adp.models.EchoLogCheckIndex = 'checked';
      await adp.mongoDatabase.collection(this.dbMongoCollection).createIndex(
        { echoLogExpireAt: 1 },
        { expireAfterSeconds: 0 },
      );
    }
    const obj = OBJ;
    const now = new Date();
    obj.echoLogExpireAt = new Date(now.setMonth(now.getMonth() + 3));
    return adp.db.create(this.dbMongoCollection, obj);
  }
}


module.exports = Adp;
