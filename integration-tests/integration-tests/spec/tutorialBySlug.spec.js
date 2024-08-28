const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();

describe('Testing tutorialbySlug endpoint', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('Should check title for tutorial  first level "Do not remove – UITEST tutorial"', async (done) => {
    const tutorialTitle = await portal.tutorialGetTitleFromSlug('do-not-remove-uitest-tutorial');
   

    expect(tutorialTitle.code).toBe(200);
    expect(tutorialTitle.body.data).toEqual("Do not remove – UITEST tutorial");

    done();
  });


  it('Should check title for tutorial second level "E2E TESTS Tutorial', async (done) => {
    const tutorialTitle = await portal.tutorialGetTitleFromSlug('e2e-tests-tutorial');
   

    expect(tutorialTitle.code).toBe(200);
    expect(tutorialTitle.body.data).toEqual("E2E TESTS Tutorial");

    done();
  });

  it('Should 404 in case no such tutorial was found', async (done) => {
    const tutorialTitle = await portal.tutorialGetTitleFromSlug('not-existing-tutorial');
   

    expect(tutorialTitle.code).toBe(400);

    done();
  });
});
