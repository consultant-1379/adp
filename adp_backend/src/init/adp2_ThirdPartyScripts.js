// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
// Third Party Scripts
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
global.http = require('http');
global.https = require('https');
global.url = require('url');
global.querystring = require('querystring');
global.path = require('path');
global.ldapjs = require('ldapjs');
global.passport = require('passport');
global.passportJWT = require('passport-jwt');
global.passportLdap = require('passport-ldapauth');
global.bodyParser = require('body-parser');
global.jsonwebtoken = require('jsonwebtoken');
global.jsonFormatter = require('json-string-formatter');
global.JWTStrategyHandler = require('../access/JWTStrategyHandler');
global.JWTIntegrationStrategyHandler = require('../access/JWTIntegrationStrategyHandler');
global.expressClass = require('express');
global.base64 = require('js-base64').Base64;
global.XMLSerializer = require('xmlserializer');
global.FastXmlParser = require('fast-xml-parser');
global.parse5 = require('parse5');
global.raml2html = require('raml2html');
global.cheerio = require('cheerio');
global.xlsx = require('xlsx');
global.joi = require('joi');
global.compression = require('compression');
global.swaggerJsdoc = require('swagger-jsdoc');
global.swaggerUi = require('swagger-ui-express');
global.swaggerJsdocClient = require('swagger-jsdoc');
global.swaggerUiClient = require('swagger-ui-express');
global.sanitizeHtml = require('sanitize-html');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
global.express = global.expressClass();
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
global.sizeof = require('object-sizeof');
global.Jsonschema = require('jsonschema').Validator;
global.download = require('image-downloader');
global.base64IMG = require('base64-img');
global.mssql = require('mssql');
global.jsyaml = require('js-yaml');
global.unzipper = require('unzipper');
global.mime = require('mime-types');
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
adp.echoLog(`[+${adp.timeStepNext()}] Third Party Scripts loaded...`);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
