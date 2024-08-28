// ============================================================================================= //
/**
* [ global.adp.getServerStatusErrorMessage ]
* Convert text into slug
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
module.exports = (SERVERCODE) => {
  let message = 'Internal Server Error';
  switch (SERVERCODE) {
    case 400:
      message = 'Bad Request';
      break;
    case 401:
      message = 'Unauthorized';
      break;
    case 403:
      message = 'Forbidden';
      break;
    case 404:
      message = 'Not Found';
      break;
    case 405:
      message = 'Method Not Allowed';
      break;
    case 406:
      message = 'Not Acceptable';
      break;
    case 408:
      message = 'Request Timeout';
      break;
    case 501:
      message = 'Not Implemented';
      break;
    case 502:
      message = 'Bad Gateway';
      break;
    case 503:
      message = 'Service Unavailable';
      break;
    default:
      message = 'Internal Server Error';
      break;
  }
  return message;
};
// ============================================================================================= //
