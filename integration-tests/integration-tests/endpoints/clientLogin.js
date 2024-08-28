const urljoin = require('url-join');
const config = require('../test.config.js');

let authToken = null;
const url = urljoin(config.baseUrl, 'clientDocs', 'login');

const optionsTest = {
  url,
  json: true,
  body: config.testUser,
  strictSSL: false,
};

const optionsAdmin = {
  url: urljoin(config.baseUrl, 'clientDocs/login'),
  json: true,
  body: config.testUserAdminClient,
  strictSSL: false,
};

const optionsTestOne = {
  url,
  json: true,
  body: config.testUserOne,
  strictSSL: false,
};

const optionsTestUserEtasase = {
  url,
  json: true,
  body: config.testUserEtasase,
  strictSSL: false,
};

const optionsTestUserEtesase = {
  url,
  json: true,
  body: config.testUserEtesase,
  strictSSL: false,
};

const optionsTestUserEtarase = {
  url,
  json: true,
  body: config.testUserEtarase,
  strictSSL: false,
};

const optionsTestUserEtapase = {
  url,
  json: true,
  body: config.testUserEtapase,
  strictSSL: false,
};

const optionsTestUserEpesuse = {
  url,
  json: true,
  body: config.testUserEpesuse,
  strictSSL: false,
};

const optionsTestUserDmapuse = {
  url,
  json: true,
  body: config.testUserDmapuse,
  strictSSL: false,
};

const optionsTestUserEtesuse2 = {
  url,
  json: true,
  body: config.testUserEtesuse2,
  strictSSL: false,
};

function callback(error, response, body) {
  if (!error && response.statusCode === 200) {
    authToken = body.data.token;
    console.log(body)
    return authToken;
  }
  return '';
}
module.exports.authToken = authToken;
module.exports.optionsAdmin = optionsAdmin;
module.exports.optionsTest = optionsTest;
module.exports.optionsTestOne = optionsTestOne;
module.exports.optionsTestUserEtasase = optionsTestUserEtasase;
module.exports.optionsTestUserEtarase = optionsTestUserEtarase;
module.exports.optionsTestUserEtapase = optionsTestUserEtapase;
module.exports.optionsTestUserEpesuse = optionsTestUserEpesuse;
module.exports.optionsTestUserEtesuse2 = optionsTestUserEtesuse2;
module.exports.optionsTestUserDmapuse = optionsTestUserDmapuse;
module.exports.optionsTestUserEtesase = optionsTestUserEtesase;
module.exports.callback = callback;
