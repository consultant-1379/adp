// ============================================================================================= //
/**
* [ adp.swaggerSetup.options ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => {
  const apiPath = `${global.adp.path}/routes/endpoints/*/*.js`;
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'ADP Portal API',
        description: 'This is the API Documentation for the ADP Portal Backend',
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
  global.swagger = global.swaggerJsdoc(options);
  const msg = `Swagger API Documentation can be found in [ ${adp.config.siteAddress}/api-docs/ ]`;
  adp.echoLog(msg, null, 400, 'adp.swaggerSetup.options', false);
};
// ============================================================================================= //
