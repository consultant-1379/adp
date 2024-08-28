// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
// DB Scripts
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.db = {};
adp.dbConnection = null;
adp.dbSetup = {};
adp.db.Mongo = require('../db/Mongo');
adp.db.start = require('../db/start');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.db.crud = {};
adp.db.checkID = require('./../db/checkID');
adp.db.checkIDForArrays = require('./../db/checkIDForArrays');
adp.db.create = require('../db/create');
adp.db.createMany = require('../db/createMany');
adp.db.read = require('../db/read');
adp.db.update = require('../db/update');
adp.db.destroy = require('../db/destroy');
adp.db.destroyMany = require('../db/destroyMany');
adp.db.bulk = require('../db/bulk');
adp.db.aggregate = require('../db/aggregate');
adp.db.find = require('../db/find');
adp.db.updateMany = require('../db/updateMany');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.echoLog(`[+${adp.timeStepNext()}] DB Scripts loaded...`);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
