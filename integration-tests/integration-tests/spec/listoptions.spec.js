const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();


describe('Testing listoptionsClen endpoint', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('Should check if listoptionsClean enpoint returning data for appropriate group', async (done) => {
    const groups = [];
    const listoptionsData = await portal.listoptionsClean(groups);
    const jsonReturn = listoptionsData.body;

    let groupFound = false;
    jsonReturn.data.forEach((group) => {
      if (group._id === '49bfab89e2ab4b291d84b4dd7c058f1f' && group.slug === 'service_category') {
        groupFound = true;
      }
    });

    expect(groupFound).toBeTruthy();
    expect(listoptionsData.code).toBe(200);
    done();
  });

  it('Should check if listoptionsClean enpoint returning data for appropriate group with items', async (done) => {
    const groups = ['49bfab89e2ab4b291d84b4dd7c058f1f', '49bfab89e2ab4b291d84b4dd7c059ff0'];
    const listoptionsData = await portal.listoptionsClean(groups);
    const jsonReturn = listoptionsData.body;

    let count;
    jsonReturn.data.forEach((group) => {
      if (group._id === '49bfab89e2ab4b291d84b4dd7c058f1f' && group.slug === 'service_category') {
        count = group.items.length;
      }
    });


    expect(count).toEqual(5);
    expect(listoptionsData.code).toBe(200);
    done();
  });

  it('Should check if listoptionsClean enpoint returning data for appropriate group when specifying group ID', async (done) => {
    const groups = ['49bfab89e2ab4b291d84b4dd7c058f1f'];
    const listoptionsData = await portal.listoptionsClean(groups);

    expect(listoptionsData.body.data.length).toEqual(1);
    expect(listoptionsData.code).toBe(200);
    done();
  });
});
