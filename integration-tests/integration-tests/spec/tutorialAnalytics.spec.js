const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();

describe('Testing tutorialAnalytics endpoint', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('Should mark all lessons as read for "Do not remove – UITEST tutorial" and check /tutorialAnalytics endpoint value', async (done) => {
    const tutorialId = await portal.tutorialsMenuGetLessontIdfromTitle('E2E TESTS Tutorial');
    const tutorialId3 = await portal.tutorialsMenuGetLessontIdfromTitle('E2E TESTS Tutorial 3');
    const tutorialIdSecond = await portal.tutorialsMenuGetLessontIdfromTitle('E2E TESTS Tutorial second');

    await portal.userProgressPost(tutorialId);
    await portal.userProgressPost(tutorialId3);
    await portal.userProgressPost(tutorialIdSecond);

    const tutorialIdMain = await portal.tutorialsMenuGetLessontIdfromTitle('Do not remove – UITEST tutorial');

    const userProgressGet = await portal.tutorialsMenuGet();
    const userprogressMenu = userProgressGet.body.data.menu;
    const progress = userprogressMenu.filter(obj => obj.object_id === tutorialIdMain);
    const progressStatus = progress[0].user_progress_status;

    const analytics = await portal.tutorialAnalytics();
    const bodyAnalytics = analytics.body;

    const tutorialValueAfter = await PortalPrivateAPI.checkTutorialAnalytics(bodyAnalytics, 'Do not remove – UITEST tutorial');

    expect(progressStatus).toBe('read');
    expect(tutorialValueAfter).toBe('1');
    expect(analytics.code).toBe(200);

    done();
  });


  it('Should mark lesson as not-read for "Do not remove – UITEST tutorial" and check /tutorialAnalytics endpoint value', async (done) => {
    const tutorialId = await portal.tutorialsMenuGetLessontIdfromTitle('E2E TESTS Tutorial');
    const tutorialId3 = await portal.tutorialsMenuGetLessontIdfromTitle('E2E TESTS Tutorial 3');
    const tutorialIdSecond = await portal.tutorialsMenuGetLessontIdfromTitle('E2E TESTS Tutorial second');

    await portal.userProgressDelete(tutorialId3);
    await portal.userProgressDelete(tutorialId);
    await portal.userProgressDelete(tutorialIdSecond);

    const tutorialIdMain = await portal.tutorialsMenuGetLessontIdfromTitle('Do not remove – UITEST tutorial');
    const userProgressGet = await portal.tutorialsMenuGet();
    const userprogressMenu = userProgressGet.body.data.menu;
    const progress = userprogressMenu.filter(obj => obj.object_id === tutorialIdMain);
    const progressStatus = progress[0].user_progress_status;

    const analytics = await portal.tutorialAnalytics();
    const bodyAnalytics = analytics.body;

    const tutorialValueAfter = await PortalPrivateAPI.checkTutorialAnalytics(bodyAnalytics, 'Do not remove – UITEST tutorial');

    expect(progressStatus).toBe('not-read');
    expect(tutorialValueAfter).toBe('0');
    expect(analytics.code).toBe(200);

    done();
  });
});
