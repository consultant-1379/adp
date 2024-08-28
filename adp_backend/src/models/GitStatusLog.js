/**
* [ adp.models.GitStatusLog ]
* GitStatusLog Database Model
* @author Armando Dias [zdiaarm]
*/
adp.docs.list.push(__filename);


class Adp {
  constructor() {
    this.dbMongoCollection = 'gitstatuslog';
  }


  /**
   * Creates a log entry into database
   * @param {object} OBJ JSON Object with details
   * @author Armando Dias [zdiaarm]
   */
  createOne(OBJ) {
    return adp.db.create(this.dbMongoCollection, OBJ);
  }
}


module.exports = Adp;
