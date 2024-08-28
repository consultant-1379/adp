const asciidocContr = require('../../controllers/asciidoctor/asciidoctor.controller');
const { log } = require('../../lib/echolog/echo.lib');
/**
 * All view functions for asciidoctor operations.
 */
const pack = 'asciidoctor.view';

/**
 * get: convert ascii text to html.
 * @param {string} ascii document text to be converted to html
 * @param {object} settings any coversion settings for asciidoctor
 * @returns {object} {string} obj.html version of the given ascii
 * {object} obj.logs asciidoctor logs
 * @author Cein
 */
const asciiToHtml = (req, res) => {
  log('Processing ascii to html', null, 200, pack);
  const { ascii, settings } = req.body;
  return asciidocContr.getHtml(ascii, settings)
    .then(asciiResp => res.json(asciiResp))
    .catch((error) => {
      log(error.message, error.data, error.code, pack);
      res.status(error.code);
      return res.send(error);
    });
};

module.exports = {
  asciiToHtml,
};
