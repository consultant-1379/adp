/**
 * [ adp.asciidoctorService.AsciidoctorController ]
 * Asciidoctor service controllers listed.
 */
adp.docs.list.push(__filename);

class AsciidoctorController {
  constructor() {
    const asciidoctorServiceUrl = adp.config.asciidoctorService;

    this.package = 'adp.asciidoctorService.AsciidoctorController';
    this.asciidoctorServiceUrl = asciidoctorServiceUrl;
    this.requestheader = {
      url: asciidoctorServiceUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  /**
  * Converts ascii to html
  * @param {string} ascii ascii text
  * @param {object} [settings={}] the ascii doctor conversion settings
  * @returns {promise<object>} obj.html {string} the converted html
  * obj.logs {array} list of any logs from asciidoctor
  * @author Cein
  */
  asciiToHtml(ascii, settings = {}) {
    const startedAt = new Date();
    let duration;
    return new Promise((resolve, reject) => {
      if (typeof ascii !== 'string' || typeof settings !== 'object' || settings === null) {
        const error = { message: 'Given parameters are of the incorrect type', code: 400, data: { ascii, settings } };
        adp.echoLog(error.message, error.data, error.code, this.package);
        reject(error);
      } else {
        const header = { ...this.requestheader };
        header.url = `${header.url}asciiToHtml`;
        header.json = { ascii, settings };

        global.request.post(header, (reqError, resp, body) => {
          if (reqError) {
            duration = new Date() - startedAt;
            const error = { message: `Failed to complete the asciidoctor service request. Duration: ${duration} ms`, code: 500, data: { error: reqError, ascii, settings } };
            adp.echoLog(error.message, error.data, error.code, this.package);
            reject(error);
          } else if (resp.statusCode === 200) {
            adp.echoLog(`Document translated in ${duration} ms.`, null, 200, this.package);
            resolve(body);
          } else {
            duration = new Date() - startedAt;
            const error = { message: `Asciidoctor service response failure to convert ascii to html. Duration: ${duration} ms`, code: resp.statusCode, data: { body, ascii, settings } };
            adp.echoLog(error.message, error.data, error.code, this.package);
            reject(error);
          }
        });
      }
    });
  }
}

module.exports = AsciidoctorController;
