// ============================================================================================= //
/**
* [ adp.swaggerSetup.clientOptions ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => {
  const apiPath = `${global.adp.path}/routes/endpoints/clientDocs/*.js`;
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'ADP Portal API',
        description: 'This is the API Documentation for Fetching documents by specific version',
        version: `${global.version.substr(21, 16)}`,
      },
      produces: ['application/json'],
      schemes: ['https'],
      components: {
        securitySchemes: {
          jwtToken: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        responses: {
          Ok: {
            description: 'Ok - Successful',
          },
          BadRequest: {
            description: 'Bad Request.',
          },
          Unauthorized: {
            description: 'Unauthorized - Invalid or empty Token.',
          },
          Forbidden: {
            description: 'Forbidden - The Token not have enough permission.',
          },
          NotFound: {
            description: 'NotFound - No data found.',
          },
          InternalServerError: {
            description: 'Internal Server Error.',
          },
        },
      },
      security: [{
        jwtToken: [],
      }],
      servers: [
        { url: `${adp.config.siteAddress}` },
      ],
    },
    apis: [apiPath],
  };
  global.swaggerClient = global.swaggerJsdocClient(options);
  const msg = `Swagger API Documentationfor Client can be found in [ ${adp.config.siteAddress}/client-docs/ ]`;
  adp.echoLog(msg, null, 400, 'adp.swaggerSetup.clientOptions', false);
};
// ============================================================================================= //
