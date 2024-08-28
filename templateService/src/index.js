const express = require('express');
const routes = require('./routes');
const { log } = require('./lib/echolog/echo.lib');
const { getVersion, getInformation } = require('./controllers/serviceInfo/serviceInfo.controller');

const app = express();
const port = process.env.PORT || 9000;
const version = getVersion();
const { name } = getInformation();

app.use(express.json({ limit: '50mb' }));
routes(app);

app.listen(port, () => {
  log(`${name}:${version} listening on port ${port}`);
});
