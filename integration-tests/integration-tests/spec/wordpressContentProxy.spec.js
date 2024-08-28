// ============================================================================================= //
/**
     * Tests to validate the responses from wordpress proxy endpoint /wpcontent
     * @author Akshay Mungekar
*/

const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();

describe('Testing wordpress contents for ADP portal from the proxy endppoint', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });


  // Case 1
  it('Should verify the proxy endpoint using a parameter-based request through URL with 3 mandatory parameters', async (done) => {
    const articleslug = 'what_is_adp';
    const articletype = 'page';
    const parentslugarray = '["overview"]';

    const responseWordpressContent = await portal
      .getWordpressContentParameters(undefined, articleslug, articletype, parentslugarray);
    const responseWordpressContentFiltered = responseWordpressContent.body.slugResults
      .filter(slugResults => slugResults.post_title === 'What is ADP?' && slugResults.post_name === 'what_is_adp'
      && slugResults.post_type === 'page');

    expect(responseWordpressContent.code).toBe(200);
    expect(responseWordpressContentFiltered).not.toEqual([]);
    expect(responseWordpressContentFiltered.length).not.toBe(0);
    done();
  });

  // Case 2
  it('Should verify the proxy endpoint using a parameter-based request through URL by skipping mandatory parameters', async (done) => {
    const articleslug = 'what_is_adp';
    const parentslugarray = '["overview"]';

    const responseWordpressContent = await portal
      .getWordpressContentSkipParameters(undefined, articleslug, parentslugarray);

    const responseWordpressContentFiltered = responseWordpressContent.body.data
      .filter(slugResults => slugResults.post_title === 'What is ADP?'
      && slugResults.post_name === 'what_is_adp' && slugResults.post_type === 'page');

    expect(responseWordpressContent.code).toBe(400);
    expect(responseWordpressContentFiltered).toEqual([]);
    expect(responseWordpressContentFiltered.length).toBe(0);
    done();
  });

  // Case 3
  it('Should verify the proxy endpoint using a parameter-based request through URL by providing incorrect parameters', async (done) => {
    const articleslug = 'what_is_adp';
    const articletype = 'tutorial';
    const parentslugarray = '["overview"]';

    const responseWordpressContent = await portal
      .getWordpressContentParameters(undefined, articleslug, articletype, parentslugarray);

    const responseWordpressContentFiltered = responseWordpressContent.body.data
      .filter(slugResults => slugResults.post_title === 'What is ADP?'
      && slugResults.post_name === 'what_is_adp' && slugResults.post_type === 'page');

    expect(responseWordpressContent.code).toBe(404);
    expect(responseWordpressContentFiltered).toEqual([]);
    expect(responseWordpressContentFiltered.length).toBe(0);
    done();
  });

  // Case 4
  it('Should verify the proxy endpoint using a parameter-based request through URL by providing empty parameters', async (done) => {
    const articleslug = '';
    const articletype = '';
    const parentslugarray = '';

    const responseWordpressContent = await portal
      .getWordpressContentParameters(undefined, articleslug, articletype, parentslugarray);

    const responseWordpressContentFiltered = responseWordpressContent.body.data
      .filter(slugResults => slugResults.post_title === 'What is ADP?'
      && slugResults.post_name === 'what_is_adp' && slugResults.post_type === 'page');

    expect(responseWordpressContent.code).toBe(400);
    expect(responseWordpressContentFiltered).toEqual([]);
    expect(responseWordpressContentFiltered.length).toBe(0);
    done();
  });

  // Case 5 - Verifying valid content with different combinations from wordpress content
  it('Should verify the proxy endpoint using a parameter-based request through URL with 3 mandatory parameters - under Working in ADP Framework', async (done) => {
    const articleslug = 'general-directives';
    const articletype = 'page';
    const parentslugarray = '["create-a-microservice"]';

    const responseWordpressContent = await portal
      .getWordpressContentParameters(undefined, articleslug, articletype, parentslugarray);
    const responseWordpressContentFiltered = responseWordpressContent.body.slugResults
      .filter(slugResults => slugResults.post_title === 'General Directives' && slugResults.post_name === 'general-directives'
      && slugResults.post_type === 'page');

    expect(responseWordpressContent.code).toBe(200);
    expect(responseWordpressContentFiltered).not.toEqual([]);
    expect(responseWordpressContentFiltered.length).not.toBe(0);
    done();
  });

  it('Should verify the proxy endpoint using a parameter-based request through URL with 3 mandatory parameters - under Community', async (done) => {
    const articleslug = 'meettheteam';
    const articletype = 'page';
    const parentslugarray = '["community"]';

    const responseWordpressContent = await portal
      .getWordpressContentParameters(undefined, articleslug, articletype, parentslugarray);
    const responseWordpressContentFiltered = responseWordpressContent.body.slugResults
      .filter(slugResults => slugResults.post_title === 'ADP Meet the team' && slugResults.post_name === 'meettheteam'
      && slugResults.post_type === 'page');

    expect(responseWordpressContent.code).toBe(200);
    expect(responseWordpressContentFiltered).not.toEqual([]);
    expect(responseWordpressContentFiltered.length).not.toBe(0);
    done();
  });

  it('Should verify the proxy endpoint using a parameter-based request through URL with 3 mandatory parameters - under Products', async (done) => {
    const articleslug = 'adp-generic-services';
    const articletype = 'page';
    const parentslugarray = '["products"]';

    const responseWordpressContent = await portal
      .getWordpressContentParameters(undefined, articleslug, articletype, parentslugarray);
    const responseWordpressContentFiltered = responseWordpressContent.body.slugResults
      .filter(slugResults => slugResults.post_title === 'ADP Generic Services' && slugResults.post_name === 'adp-generic-services'
      && slugResults.post_type === 'page');

    expect(responseWordpressContent.code).toBe(200);
    expect(responseWordpressContentFiltered).not.toEqual([]);
    expect(responseWordpressContentFiltered.length).not.toBe(0);
    done();
  });

  it('Should verify the if post_content for article contains location_ids for particular h1', async (done) => {
    const articleslug = 'adp_architecture';
    const articletype = 'page';
    const parentslugarray = '["discover"]';

    const responseWordpressContent = await portal
      .getWordpressContentParameters(undefined, articleslug, articletype, parentslugarray);
    const responseWordpressPostContent = responseWordpressContent.body.slugResults[0].post_content;

    expect(responseWordpressPostContent.indexOf('comment-h1-application'))
      .withContext('Should contain comment-h1-application class')
      .toBeGreaterThan(-1);

    expect(responseWordpressPostContent.indexOf('comment-h1-further-details'))
      .withContext('comment-h1-further-detailss')
      .toBeGreaterThan(-1);

    expect(responseWordpressContent.code).toBe(200);
    expect(responseWordpressPostContent).not.toEqual([]);
    expect(responseWordpressPostContent.length).not.toBe(0);
    done();
  });

  it('Should verify if article had location_id field with appropriate value', async (done) => {
    const articleslug = 'adp_architecture';
    const articletype = 'page';
    const parentslugarray = '["discover"]';

    const responseWordpressContent = await portal
      .getWordpressContentParameters(undefined, articleslug, articletype, parentslugarray);
    const responseWordpressPostContent = responseWordpressContent.body.slugResults[0].location_id;

    expect(responseWordpressContent.code).toBe(200);
    expect(responseWordpressPostContent).toEqual('article_3570');
    done();
  });

  it('Should verify the if post_content for tutorial contains location_ids for particular h1', async (done) => {
    const articleslug = 'overview-my-first-adp-service';
    const parentslugarray = '["discover"]';

    const responseWordpressContent = await portal
      .getWordpressTutorialContentParameters(articleslug, parentslugarray);
    const responseWordpressPostContent = responseWordpressContent.body.slugResults[0].post_content;

    expect(responseWordpressPostContent.indexOf('comment-h4-introduction'))
      .withContext('Should contain comment-h4-introduction class')
      .toBeGreaterThan(-1);

    expect(responseWordpressPostContent.indexOf('comment-h4-i-have-bullet-points-too'))
      .withContext('Should contain comment-h4-i-have-bullet-points-too')
      .toBeGreaterThan(-1);

    expect(responseWordpressContent.code).toBe(200);
    expect(responseWordpressPostContent).not.toEqual([]);
    expect(responseWordpressPostContent.length).not.toBe(0);
    done();
  });

  it('Should verify if tutorial had location_id field', async (done) => {
    const articleslug = 'overview-my-first-adp-service';
    const parentslugarray = '["discover"]';

    const responseWordpressContent = await portal
      .getWordpressTutorialContentParameters(articleslug, parentslugarray);
    const responseWordpressPostContent = responseWordpressContent.body.slugResults[0].location_id;

    expect(responseWordpressContent.code).toBe(200);
    expect(responseWordpressPostContent).toEqual('tutorial_8971');
    done();
  });
});

// ============================================================================================= //
