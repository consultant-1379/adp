// ============================================================================================= //
/**
* Unit test for [ adp.comments.IntrumentClass ]
* @author Armando Dias [ zdiaarm ]
*/
// ============================================================================================= //
describe('Testing behavior of [ adp.comments.IntrumentClass ] ', () => {
  // =========================================================================================== //
  beforeEach(() => {
    global.adp = {};
    global.cheerio = require('cheerio');
    adp.slugIt = require('./../library/slugIt');
    adp.comments = {};
    adp.comments.InstrumentClass = require('./InstrumentClass.js');
    adp.htmlModel = '<div><h1>My First Title</h1><p>My mock text comes here...</p><h2>My Second Title</h2><p>My mock text comes here...</p><h3>My Third Title</h3><p>My mock text comes here...</p><h4>My Fourth Title</h4><p>My mock text comes here...</p><h5>My Fifth Title</h5><p>My mock text comes here...</p><h6>My Sixth Title</h6><p>My mock text comes here...</p><h6>My Sixth Title</h6><p>Repeated Header before this mock text...</p><h6>My Sixth Title</h6><p>Another repeated Header before this mock text...</p></div>';
  });
  // =========================================================================================== //
  it('[ apply ] Successful Case of the main function.', async (done) => {
    const instrument = new adp.comments.InstrumentClass();
    const result = instrument.apply(adp.htmlModel);
    const registers = instrument.indexControl;

    expect(registers['comment-h1-my-first-title']).toEqual(0);
    expect(registers['comment-h2-my-second-title']).toEqual(0);
    expect(registers['comment-h3-my-third-title']).toEqual(0);
    expect(registers['comment-h4-my-fourth-title']).toEqual(0);
    expect(registers['comment-h5-my-fifth-title']).toEqual(0);
    expect(registers['comment-h6-my-sixth-title']).toEqual(2);
    expect(result).toEqual('<div><div id="comment-heading-comment-h1-my-first-title" class="comment-heading"><h1 class="comment-system comment-h1-my-first-title">My First Title</h1></div><div id="comment-div-comment-h1-my-first-title" class="comment-div"></div><div id="comment-action-div-comment-h1-my-first-title" class="comment-action-div"></div><p>My mock text comes here...</p><div id="comment-heading-comment-h2-my-second-title" class="comment-heading"><h2 class="comment-system comment-h2-my-second-title">My Second Title</h2></div><div id="comment-div-comment-h2-my-second-title" class="comment-div"></div><div id="comment-action-div-comment-h2-my-second-title" class="comment-action-div"></div><p>My mock text comes here...</p><div id="comment-heading-comment-h3-my-third-title" class="comment-heading"><h3 class="comment-system comment-h3-my-third-title">My Third Title</h3></div><div id="comment-div-comment-h3-my-third-title" class="comment-div"></div><div id="comment-action-div-comment-h3-my-third-title" class="comment-action-div"></div><p>My mock text comes here...</p><div id="comment-heading-comment-h4-my-fourth-title" class="comment-heading"><h4 class="comment-system comment-h4-my-fourth-title">My Fourth Title</h4></div><div id="comment-div-comment-h4-my-fourth-title" class="comment-div"></div><div id="comment-action-div-comment-h4-my-fourth-title" class="comment-action-div"></div><p>My mock text comes here...</p><div id="comment-heading-comment-h5-my-fifth-title" class="comment-heading"><h5 class="comment-system comment-h5-my-fifth-title">My Fifth Title</h5></div><div id="comment-div-comment-h5-my-fifth-title" class="comment-div"></div><div id="comment-action-div-comment-h5-my-fifth-title" class="comment-action-div"></div><p>My mock text comes here...</p><div id="comment-heading-comment-h6-my-sixth-title" class="comment-heading"><h6 class="comment-system comment-h6-my-sixth-title">My Sixth Title</h6></div><div id="comment-div-comment-h6-my-sixth-title" class="comment-div"></div><div id="comment-action-div-comment-h6-my-sixth-title" class="comment-action-div"></div><p>My mock text comes here...</p><div id="comment-heading-comment-h6-my-sixth-title-1" class="comment-heading"><h6 class="comment-system comment-h6-my-sixth-title-1">My Sixth Title</h6></div><div id="comment-div-comment-h6-my-sixth-title-1" class="comment-div"></div><div id="comment-action-div-comment-h6-my-sixth-title-1" class="comment-action-div"></div><p>Repeated Header before this mock text...</p><div id="comment-heading-comment-h6-my-sixth-title-2" class="comment-heading"><h6 class="comment-system comment-h6-my-sixth-title-2">My Sixth Title</h6></div><div id="comment-div-comment-h6-my-sixth-title-2" class="comment-div"></div><div id="comment-action-div-comment-h6-my-sixth-title-2" class="comment-action-div"></div><p>Another repeated Header before this mock text...</p></div>');
    done();
  });
  // =========================================================================================== //
  it('[ getLocationIDMS ] Testing successful case.', async (done) => {
    const instrument = new adp.comments.InstrumentClass();
    const mockMSID = '1234567890';
    const mockDOCCAT = 'Mock Category Name';
    const mockDOCVERSION = 'MockVersion';
    const mockDOCTITLE = 'The Mock Document Title';
    const locationID = instrument.getLocationIDMS(
      mockMSID,
      mockDOCCAT,
      mockDOCVERSION,
      mockDOCTITLE,
    );

    expect(locationID).toEqual('msdocumentation_1234567890_mockversion-mock-category-name-the-mock-document-title');
    done();
  });
  // =========================================================================================== //
  it('[ getLocationIDWP ] Testing successful case.', async (done) => {
    const instrument = new adp.comments.InstrumentClass();
    const articleLocationID = instrument.getLocationIDWP('page', '123');
    const tutorialLocationID = instrument.getLocationIDWP('tutorials', '456');

    expect(articleLocationID).toEqual('article_123');
    expect(tutorialLocationID).toEqual('tutorial_456');
    done();
  });
  // =========================================================================================== //
});
// ============================================================================================= //
