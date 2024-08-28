// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
// HTTP/HTTPS Scripts
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.httpControls = {};
adp.httpControls.httpServerService = null;
adp.httpControls.httpsServerService = null;
adp.httpControls.options = require('../httpControls/options');
adp.httpControls.getRegularPort = require('../httpControls/getRegularPort');
adp.httpControls.getSecurityPort = require('../httpControls/getSecurityPort');
adp.httpControls.deliveryFile = require('../httpControls/deliveryFile');
adp.httpControls.redirectServer = require('../httpControls/redirectServer');
adp.httpControls.httpsServer = require('../httpControls/httpsServer');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.echoLog(`[+${adp.timeStepNext()}] HTTP/HTTPS Scripts loaded...`);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
