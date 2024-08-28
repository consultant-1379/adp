// ============================================================================================= //
/**
* [ global.adp.microservice.CRUDLog ]
* Save a log with changes, focusing the CRUD of Microservices.
* @param {JSON} NEWOBJ JSON Object with the newest version of the register.
* @param {JSON} OLDOBJ JSON Object with the previous version of the register.
* Can be empty {} Object.
* @param {String} ACTION Should be "new", "update" or "delete".
* @param {JSON} USR with two fields { signum and role } provided by the endpoint.
* <b>Example:</b><br/>
* const user = REQ.user.docs[0];<br/>
* const USR = {<br/>
* &nbsp;&nbsp;signum: user.signum,<br/>
* &nbsp;&nbsp;role: user.role,<br/>
* };<br/>
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = async (NEWOBJ, OLDOBJ, ACTION, USR) => {
  const dbModelAdplog = new adp.models.AdpLog();
  // =========================================================================================== //
  const analyseIt = (ARRAY, KEY, NEW, OLD, EXCEPTION1, EXCEPTION2) => {
    if (Array.isArray(NEW)) {
      if (Array.isArray(OLD)) {
        if (NEW.length !== OLD.length) {
          const obj = {
            fieldname: `${KEY}`,
            from: OLD,
            to: NEW,
          };
          ARRAY.push(obj);
        } else {
          NEW.forEach((item, index) => {
            analyseIt(ARRAY, index, NEW[index], OLD[index], NEW, OLD);
          });
        }
      }
    } else if (typeof NEW === 'object') {
      Object.keys(NEW).forEach((skey) => {
        analyseIt(ARRAY, skey, NEW[skey], OLD[skey], NEW, OLD);
      });
    } else if (NEW !== OLD) {
      let obj = {};
      const boolean1 = (EXCEPTION1 !== null) && (EXCEPTION1 !== undefined);
      const boolean2 = (EXCEPTION2 !== null) && (EXCEPTION2 !== undefined);
      if (boolean1 && boolean2) {
        obj = {
          fieldname: KEY,
          from: EXCEPTION2,
          to: EXCEPTION1,
        };
      } else {
        obj = {
          fieldname: KEY,
          from: OLD,
          to: NEW,
        };
      }
      ARRAY.push(obj);
    }
  };
  // =========================================================================================== //
  const newOBJ = NEWOBJ;
  let oldObj = OLDOBJ;
  let thisSignum = '';
  if (USR.signum !== undefined && USR.signum !== null) {
    thisSignum = USR.signum.trim().toLowerCase();
  }
  const log = {
    type: (newOBJ && newOBJ.type === 'assembly') ? 'assembly' : 'microservice',
    datetime: new Date(),
    signum: thisSignum,
    role: USR.role,
    desc: ACTION,
  };
  if (ACTION === 'update') {
    const changesArray = [];
    Object.keys(newOBJ).forEach((key) => {
      analyseIt(changesArray, key, newOBJ[key], oldObj[key]);
    });
    log.changes = changesArray;
  } else if (ACTION === 'delete') {
    log.changes = {
      fieldname: 'deleted',
      from: 'null',
      to: true,
    };
    oldObj = global.adp.clone(NEWOBJ);
    newOBJ.deleted = true;
  }
  log.new = newOBJ;
  delete oldObj._rev; // eslint-disable-line no-underscore-dangle
  log.old = oldObj;
  return dbModelAdplog.createOne(log)
    .then((expect) => {
      if (expect.ok === true) {
        return true;
      }
      return false;
    })
    .catch(() => false);
};
// ============================================================================================= //
