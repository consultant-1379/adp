const urljoin = require('url-join');
const { PortalPrivateAPI } = require('./apiClients');
const login = require('../endpoints/login.js');

const portal = new PortalPrivateAPI();


describe('Testing user progress logic for the tutorial with no autorization', () => {
  it('Testing a unsuccessful case of /userprogress endpoint post without login information', async (done) => {
    const responsePost = await portal.userProgressPost('tutorialID');

    expect(responsePost.code).toBe(401);
    done();
  });

  it('Testing a unsuccessful case /userprogress endpoint delete  without login information', async (done) => {
    const responseDelete = await portal.userProgressDelete('tutorialID');

    expect(responseDelete.code).toBe(401);
    done();
  });
});


describe('Testing user progress logic for the tutorial', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });


  it('Testing a successful case of /userprogress endpoint with Tutorial ID for lesson from get request', async (done) => {
    const tutorialId = await portal.tutorialsMenuGetLessontId();
    const responsePost = await portal.userProgressPost(tutorialId);

    expect(responsePost.code).toBe(200);
    expect(responsePost.body.data.lesson_completed).toBeGreaterThan(0);
    done();
  });

  it('Testing unsuccessful case of /userprogress endpoint with empty string for the ID', async (done) => {
    const responsePost = await portal.userProgressPost('');

    expect(responsePost.code).toBe(400);
    done();
  });

  it('Testing unsuccessful case of /userprogress endpoint with undefined for the ID', async (done) => {
    const responsePost = await portal.userProgressPost('notExistingId');

    expect(responsePost.code).toBe(404);
    done();
  });


  it('Testing a successful case of  deletion lesson progress for the user ', async (done) => {
    const tutorialId = await portal.tutorialsMenuGetLessontId();
    const responseDelete = await portal.userProgressPost(tutorialId);

    expect(responseDelete.code).toBe(200);
    expect(responseDelete.body.data.wid).toEqual(tutorialId);

    done();
  });

  it('Testing a unsuccessful case of deletion information for the /userprogress endpoint as ID does not exist ', async (done) => {
    const responseDelete = await portal.userProgressDelete('notExistingId');

    expect(responseDelete.code).toBe(404);

    done();
  });


  it('Testing a unsuccessful case of deletion information for the /userprogress endpoint as ID is empty string', async (done) => {
    const responseDelete = await portal.userProgressDelete('');

    expect(responseDelete.code).toBe(400);
    done();
  });
});

describe('Testing user progress for test user', () => {
  beforeAll(async (done) => {
    await portal.loginTest();
    await portal.clearCache('wordpress');

    done();
  });

  it('Should check if user progress status is not read for the tutorial', async (done) => {
    const tutorialIdSecond = await portal.tutorialsMenuGetLessontIdfromTitle('E2E TESTS Tutorial second');
    const userProgressGet = await portal.tutorialsMenuGet();
    const userprogressMenu = userProgressGet.body.data.menu;
    const progress = userprogressMenu.filter(obj => obj.object_id === tutorialIdSecond);

    const progressStatus = progress[0].user_progress_status;

    expect(progressStatus).toBe('not-read');

    done();
  });

  it('Should check if user progress status become read after post request to the userprogress e2e tutorial second', async (done) => {
    const tutorialIdSecond = await portal.tutorialsMenuGetLessontIdfromTitle('E2E TESTS Tutorial second');
    await portal.userProgressPost(tutorialIdSecond);
    const userProgressGet = await portal.tutorialsMenuGet();
    const userprogressMenu = userProgressGet.body.data.menu;
    const progress = userprogressMenu.filter(obj => obj.object_id === tutorialIdSecond);

    const progressStatus = progress[0].user_progress_status;

    expect(progressStatus).toBe('read');

    done();
  });


  it('Should check if user progress status is read-again for the e2e tests tutorial', async (done) => {
    const tutorialId = await portal.tutorialsMenuGetLessontIdfromTitle('E2E TESTS Tutorial');
    const userProgressGet = await portal.tutorialsMenuGet();
    const userprogressMenu = userProgressGet.body.data.menu;
    const progress = userprogressMenu.filter(obj => obj.object_id === tutorialId);

    const progressDateContent = progress[0].date_content;
    const progressStatus = progress[0].user_progress_status;

    expect(progressDateContent).not.toBe('');
    expect(progressStatus).toBe('read-again');

    done();
  });


  it('Should check if user progress status is read-again for the main tutorial Do not remove – UITEST tutorial', async (done) => {
    const tutorialIdMain = await portal.tutorialsMenuGetLessontIdfromTitle('Do not remove – UITEST tutorial');
    const userProgressGet = await portal.tutorialsMenuGet();
    const userprogressMenu = userProgressGet.body.data.menu;
    const progress = userprogressMenu.filter(obj => obj.object_id === tutorialIdMain);

    const progressDateContent = progress[0].date_content;
    const progressStatus = progress[0].user_progress_status;

    expect(progressDateContent).not.toBe('');
    expect(progressStatus).toBe('read-again');

    done();
  });

  afterAll(async (done) => {
    const tutorialIdSecond = await portal.tutorialsMenuGetLessontIdfromTitle('E2E TESTS Tutorial second');
    await portal.userProgressDelete(tutorialIdSecond);
    done();
  });
});

describe('Testing case when user does not have access to tutorials', () => {
  beforeAll(async () => {
    await portal.login(login.optionsTestUserEpesuse);
  });

  it('Should not get items from tutorial menu', async (done) => {
    const userProgressGet = await portal.tutorialsMenuGet();
    const userprogressMenu = userProgressGet
      && userProgressGet.body
      && userProgressGet.body.data
      && userProgressGet.body.data.menu
      ? userProgressGet.body.data.menu
      : ['mockError'];

    const debug = portal.answer({
      url: urljoin(portal.baseUrl, 'tutorialsmenu'),
      response: userProgressGet.body,
    });

    expect(userprogressMenu.length)
      .withContext(`The length of userProgressGet.body.data.menu should be zero: ${debug}`)
      .toEqual(0);

    done();
  });
});
