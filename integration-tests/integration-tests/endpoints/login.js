const urljoin = require('url-join');
const config = require('../test.config.js');

let authToken = null;

const optionsTest = {
  url: urljoin(config.baseUrl, 'login'),
  json: true,
  body: config.testUser,
  strictSSL: false,
};

const optionsAdmin = {
  url: urljoin(config.baseUrl, 'login'),
  json: true,
  body: config.testUserAdmin,
  strictSSL: false,
};

const optionsTestOne = {
  url: urljoin(config.baseUrl, 'login'),
  json: true,
  body: config.testUserOne,
  strictSSL: false,
};

const optionsTestUserEtasase = {
  url: urljoin(config.baseUrl, 'login'),
  json: true,
  body: config.testUserEtasase,
  strictSSL: false,
};

const optionsTestUserEtesase = {
  url: urljoin(config.baseUrl, 'login'),
  json: true,
  body: config.testUserEtesase,
  strictSSL: false,
};

const optionsTestUserEtarase = {
  url: urljoin(config.baseUrl, 'login'),
  json: true,
  body: config.testUserEtarase,
  strictSSL: false,
};

const optionsTestUserEtapase = {
  url: urljoin(config.baseUrl, 'login'),
  json: true,
  body: config.testUserEtapase,
  strictSSL: false,
};

const optionsTestUserEpesuse = {
  url: urljoin(config.baseUrl, 'login'),
  json: true,
  body: config.testUserEpesuse,
  strictSSL: false,
};

const optionsTestUserDmapuse = {
  url: urljoin(config.baseUrl, 'login'),
  json: true,
  body: config.testUserDmapuse,
  strictSSL: false,
};

const optionsTestUserEtesuse2 = {
  url: urljoin(config.baseUrl, 'login'),
  json: true,
  body: config.testUserEtesuse2,
  strictSSL: false,
};

function callback(error, response, body) {
  if (!error && response.statusCode === 200) {
    authToken = body.data.token;
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
