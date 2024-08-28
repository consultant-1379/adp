
const ReleaseSettingsController = require('../releaseSettings/ReleaseSettingsController');
const errorLog = require('../library/errorLog');

/**
 * [ global.adp.HeaderInterceptor ]
 * Interceptor for the response header
 * @param {object} res response object
 * @author Githu Jeeva Savy [zjeegit]
 */

global.adp.docs.list.push(__filename);

class HeaderInterceptor {
  constructor(res) {
    this.packname = 'adp.middleware.HeaderInterceptor';
    this.res = res;
    this.bannerkey = 'alertbanner';
  }

  /**
   * function to set the header with the latest alert banner Object
   * @returns {Object} response object
   * @author Githu Jeeva Savy
   */
  setBanner() {
    const releaseSettingsController = new ReleaseSettingsController();
    return releaseSettingsController.getReleaseSettingsCache(this.bannerkey)
      .then((releaseArray) => {
        if (Array.isArray(releaseArray) && releaseArray.length) {
          const bannerObject = releaseArray[0];
          this.res.setHeader('alertbanner', JSON.stringify(bannerObject));
        } else {
          const error = 'No Alert Banner Object Found';
          errorLog(
            500,
            error,
            { error, bannerkey: this.bannerkey, releaseArray },
            'setBanner',
            this.packname,
          );
        }
      }).catch((error) => {
        errorLog(
          error.code || 500,
          error.message || 'Failed to fetch the alert banner',
          { error, bannerkey: this.bannerkey },
          'setBanner',
          this.packname,
        );
      });
  }
}
module.exports = HeaderInterceptor;
