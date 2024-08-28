// ============================================================================================= //
/**
* [ adp.comments.InstrumentClass ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable class-methods-use-this */
// ============================================================================================= //
class InstrumentClass {
  /**
   * Class contructor
   * Prepares the class.
   * @author Armando Dias [zdiaarm]
   */
  constructor() {
    this.packName = 'adp.comments.InstrumentClass';
    this.indexControl = {};
  }


  /**
   * [ Public ] apply
   * Apply location_page ids on text.
   * @param {string} HTML The Request Object.
   * @returns String where the headers
   *          contains location_page ids.
   * @author Armando Dias [zdiaarm]
   */
  apply(HTML) {
    let html = HTML;
    html = this._addLocationPageIDTag('h1', html);
    html = this._addLocationPageIDTag('h2', html);
    html = this._addLocationPageIDTag('h3', html);
    html = this._addLocationPageIDTag('h4', html);
    html = this._addLocationPageIDTag('h5', html);
    html = this._addLocationPageIDTag('h6', html);
    html = html.replace('<html><head></head><body>', '');
    html = html.replace('</body></html>', '');
    return html;
  }

  remove(HTML) {
    let html = HTML;
    html = this._removeStyle('style', html);
    html = html.replace('<html><head></head><body>', '');
    html = html.replace('</body></html>', '');
    return html;
  }

  /**
   * [ Public ] getLocationIDMS
   * Gets the location_id for Microservice Documents.
   * @param {string} MSID Microservice ID.
   * @param {string} DOCCAT The category's name of the document.
   * @param {string} DOCVERSION The version of the document.
   * @param {string} DOCTITLE The Title of the document.
   * @returns String with the location_id.
   * @author Armando Dias [zdiaarm]
   */
  getLocationIDMS(MSID, DOCCAT, DOCVERSION, DOCTITLE) {
    let id = 'msdocumentation';
    id = `${id}_${MSID}`;
    id = `${id}_${adp.slugIt(DOCVERSION)}`;
    id = `${id}-${adp.slugIt(DOCCAT)}`;
    id = `${id}-${adp.slugIt(DOCTITLE)}`;
    return id;
  }


  /**
   * [ Public ] getLocationIDWP
   * Gets the location_id for Wordpress content (Articles and Tutorials).
   * @param {string} TYPE The content's TYPE from Wordpress.
   * @param {string} ID The content's ID from Wordpress.
   * @returns String with the location_id.
   * @author Armando Dias [zdiaarm]
   */
  getLocationIDWP(TYPE, ID) {
    if (adp.slugIt(TYPE) === 'tutorials') return `tutorial_${ID}`;
    return `article_${ID}`;
  }


  /**
   * [ Private ] _addLocationPageIDTag
   * Uses the Cheerio 3PP to apply the comment system
   * IDs inside of the given tag css class.
   * @param {string} TAG The target tag.
   * @param {string} HTML The HTML to be changed.
   * @returns The updated HTML.
   * @author Armando Dias [zdiaarm]
   */
  _addLocationPageIDTag(TAG, HTML) {
    const htmlObj = global.cheerio.load(`${HTML}`);
    htmlObj(TAG).each((INDEX, OBJ) => {
      const headerText = adp.slugIt(htmlObj(OBJ).text());
      let id = `comment-${TAG}-${headerText}`;
      if (this.indexControl[id] !== undefined) {
        this.indexControl[id] += 1;
      } else {
        this.indexControl[id] = 0;
      }
      if (this.indexControl[id] > 0) {
        id = `${id}-${this.indexControl[id]}`;
      }
      htmlObj(OBJ).addClass(`comment-system ${id}`);
      htmlObj(OBJ).after(`<div id="comment-action-div-${id}" class="comment-action-div"></div>`);
      htmlObj(OBJ).after(`<div id="comment-div-${id}" class="comment-div"></div>`);
      htmlObj(OBJ).wrap(`<div id="comment-heading-${id}" class="comment-heading"></div>`);
    });
    return htmlObj.html();
  }

  _removeStyle(TAG, HTML) {
    const htmlObj = global.cheerio.load(`${HTML}`);
    htmlObj(TAG).each((INDEX, OBJ) => {
      htmlObj(OBJ).remove();
    });
    return htmlObj.html();
  }
}
// ============================================================================================= //
module.exports = InstrumentClass;
// ============================================================================================= //
