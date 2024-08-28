// ============================================================================================= //
/**
* [ global.adp.masterCache.CacheObjectClass ]
* Class to be used as <b>Template</b> of the Cache Object.
* @param {String} OBJ A String with the name of the Object.
* Per example: "LISTOPTIONS", "TAGS", "ALLASSETS", etc.
* @param {String} ID A String with the name of the Item inside of the Object.
* Per example: The database ID from a Microservice, the signum of a user, the parameters of
* a search. Anything unique for that result.
* @param {Integer} MS A Number in miliseconds to indicate how many time this cache can be
* considered valid.
* Documentation: https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP/Backend+Cache+System
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
class CacheObjectClass {
  // ------------------------------------------------------------------------------------------ //
  constructor(OBJ, ID, MS) {
    this.resolve = null;
    this.reject = null;
    this.cache = {
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // status:
      // The current status of this cache object.
      // Value is one of these strings:
      // CACHING.IN.PROGRESS: Request should wait for the result without trigger the process.
      // CACHED: "data" is available for reading.
      // FAIL: Was not possible to save the cache data.
      status: 'CACHING.IN.PROGRESS',
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // data: The return of the procedure cached.
      data: null,
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // serverStatus: In case of endpoints, the server status of the content cached is saved here.
      serverStatus: null,
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // contentType: In case of endpoints, the content type of the cache is saved here.
      contentType: null,
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // wait: If is a promise, should wait. If solved, can read "data" value.
      wait: new Promise((RESOLVE, REJECT) => {
        this.resolve = RESOLVE;
        this.reject = REJECT;
      }),
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // info: Group of information about this cache.
      info: {
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        // obj: The Object Group ID of this cache object.
        obj: OBJ,
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        // id: The ID inside of the Group for this cache object. Base64 string.
        id: ID,
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        // pid: Plain ID (not base64), the ID inside of the Group for this cache object.
        pid: Buffer.from(ID, 'base64').toString('ascii'),
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        // ts: TimeStamp of the moment when "data" is updated.
        ts: null,
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        // ms: How many milliseconds this cache is considered valid.
        ms: MS,
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      },
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    };
  }

  // ------------------------------------------------------------------------------------------ //

  /**
  * Just returns if the cache is still in progress
  * @return {Boolean} Return true if the cache is in progress. Otherwise, returns false.
  * @author Armando Dias [zdiaarm]
  */
  isInProgress() {
    if (this.cache.status === 'CACHING.IN.PROGRESS') {
      return true;
    }
    return false;
  }

  // ------------------------------------------------------------------------------------------ //

  /**
  * Just returns if the cache is not valid anymore
  * @return {Boolean} Returns true if the cache is expired. Otherwise, returns false.
  * @author Armando Dias [zdiaarm]
  */
  isExpired() {
    const timer = this.cache.info.ts + this.cache.info.ms;
    const now = (new Date()).getTime();
    if (now > timer) {
      return true;
    }
    return false;
  }

  // ------------------------------------------------------------------------------------------ //

  /**
  * Set status of the instance of the Class.
  * @param {String} STATUS String with the new status. The possible values are:
  * CACHING.IN.PROGRESS: Request should wait for the result without trigger the process.
  * CACHED: "data" is available for reading.
  * FAIL: Was not possible to save the cache data.
  * @return {Boolean} Returns true after a successful change. Otherwise, false.
  * @author Armando Dias [zdiaarm]
  */
  setStatus(STATUS) {
    switch (`${STATUS.trim().toUpperCase()}`) {
      case 'CACHING.IN.PROGRESS':
        this.cache.status = 'CACHING.IN.PROGRESS';
        break;
      case 'CACHED':
        this.cache.status = 'CACHED';
        break;
      case 'FAIL':
        this.cache.status = 'FAIL';
        break;
      default:
        return false;
    }
    return true;
  }

  // ------------------------------------------------------------------------------------------ //

  /**
  * Returns the "wait" promise for check if is Resolved, Rejected or in progress.
  * @return {Promise} Returns the "wait" promise.
  * @author Armando Dias [zdiaarm]
  */
  getWait() {
    return this.cache.wait;
  }

  // ------------------------------------------------------------------------------------------ //

  /**
  * Changes the status to "Cached" and Resolve the "wait" promise.
  * @author Armando Dias [zdiaarm]
  */
  resolveThisWait() {
    this.setStatus('CACHED');
    this.resolve();
  }

  // ------------------------------------------------------------------------------------------ //

  /**
  * Changes the status to "Fail" and Reject the "wait" promise.
  * @author Armando Dias [zdiaarm]
  */
  rejectThisWait() {
    this.setStatus('FAIL');
    this.reject();
  }

  // ------------------------------------------------------------------------------------------ //

  /**
  * Save the value of the cache, set the timestamp and prepare it to be used.
  * @param {Any} VALUE Value to be cached.
  * @return {Promise} Returns true after set everything. False if fails.
  * @author Armando Dias [zdiaarm]
  */
  setData(VALUE) {
    try {
      this.cache.data = VALUE;
      this.cache.info.ts = (new Date()).getTime();
      this.resolveThisWait();
      return true;
    } catch (ERROR) {
      return false;
    }
  }

  // ------------------------------------------------------------------------------------------ //

  /**
  * Retrieve the cached content.
  * @return {Any} Returns the value of the cache.
  * @author Armando Dias [zdiaarm]
  */
  getData() {
    return this.cache.data;
  }

  // ------------------------------------------------------------------------------------------ //

  /**
  * Set the Server Status.
  * @param {Number} CODE The code of Server Status to be saved.
  * @author Armando Dias [zdiaarm]
  */
  setServerStatus(CODE) {
    this.cache.serverStatus = CODE;
  }

  // ------------------------------------------------------------------------------------------ //

  /**
  * Retrieve the Server Status.
  * @return {Number} Returns the code of server status.
  * @author Armando Dias [zdiaarm]
  */
  getServerStatus() {
    if (typeof this.cache.serverStatus === 'number') {
      return this.cache.serverStatus;
    }
    return 500;
  }

  // ------------------------------------------------------------------------------------------ //

  /**
  * Set the Content Type.
  * @param {String} STR String with the Content Type to be saved.
  * @author Armando Dias [zdiaarm]
  */
  setContentType(STR) {
    this.cache.contentType = STR;
  }

  // ------------------------------------------------------------------------------------------ //

  /**
  * Retrieve the Content Type.
  * @return {string} Returns the content type. Usually used in endpoints.
  * @author Armando Dias [zdiaarm]
  */
  getContentType() {
    if (typeof this.cache.contentType === 'string') {
      return this.cache.contentType;
    }
    return 'application/json';
  }

  // ------------------------------------------------------------------------------------------ //
}
// ============================================================================================= //
module.exports = CacheObjectClass;
// ============================================================================================= //
