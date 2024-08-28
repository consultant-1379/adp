const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();

describe('Testing Innersource API  to check unnersource user history', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('[Innersource User History] Should check latest snapshot for innersourceUserHistory for etesase user with several snapshots', async (done) => {
    const responseUserhistory = await portal.innersourceUserHistoryGet('etesase', 'latest');

    const innersourceSnapshot = responseUserhistory.body.data.some(snapshot => snapshot.signum === 'etesase' && snapshot.organisation === 'BDGS RDPS CD');

    expect(innersourceSnapshot).toBeTruthy();
    expect(responseUserhistory.code).toBe(200);
    done();
  });

  it('[Innersource User History] Should check latest snapshot for innersourceUserHistory for eterase user, organisation should be BDGS SA OSS PDU OSS', async (done) => {
    const responseUserhistory = await portal.innersourceUserHistoryGet('eterase', 'latest');

    const innersourceSnapshot = responseUserhistory.body.data.some(snapshot => snapshot.signum === 'eterase' && snapshot.organisation === 'BDGS SA OSS PDU OSS');

    expect(innersourceSnapshot).toBeTruthy();
    expect(responseUserhistory.code).toBe(200);
    done();
  });

  it('[Innersource User History] Should check latest snapshot for innersourceUserHistory for esupuse user, organisation should be BDGS SA PC PDG', async (done) => {
    const responseUserhistory = await portal.innersourceUserHistoryGet('esupuse', 'latest');

    const innersourceSnapshot = responseUserhistory.body.data.some(snapshot => snapshot.signum === 'esupuse' && snapshot.organisation === 'BDGS SA PC PDG');

    expect(innersourceSnapshot).toBeTruthy();
    expect(responseUserhistory.code).toBe(200);
    done();
  });

  it('[Innersource User History] Should check snapshot for a particular date for innersourceUserHistory for etesase user with several snapshots, organisation should be BDGS SA PC PDU UDM', async (done) => {
    const responseUserhistory = await portal.innersourceUserHistoryGet('etesase', '2021-01-15');

    const innersourceSnapshot = responseUserhistory.body.data.some(snapshot => snapshot.signum === 'etesase' && snapshot.organisation === 'BDGS SA PC PDU UDM');

    expect(innersourceSnapshot).toBeTruthy();
    expect(responseUserhistory.code).toBe(200);
    done();
  });

  it('[Innersource User History] Should check latest snapshot for innersourceUserHistory for etesuse2 user, organisation should be BDGS RAN1', async (done) => {
    const responseUserhistory = await portal.innersourceUserHistoryGet('etesuse2', 'latest');

    const innersourceSnapshot = responseUserhistory.body.data.some(snapshot => snapshot.signum === 'etesuse2' && snapshot.organisation === 'BDGS RAN1');

    expect(innersourceSnapshot).toBeTruthy();
    expect(responseUserhistory.code).toBe(200);
    done();
  });

  it('[Innersource User History] Should check latest snapshot for innersourceUserHistory for epesuse user, organisation should be BNEW DNEW CDS', async (done) => {
    const responseUserhistory = await portal.innersourceUserHistoryGet('epesuse', 'latest');

    const innersourceSnapshot = responseUserhistory.body.data.some(snapshot => snapshot.signum === 'epesuse' && snapshot.organisation === 'BNEW DNEW CDS');

    expect(innersourceSnapshot).toBeTruthy();
    expect(responseUserhistory.code).toBe(200);
    done();
  });

  it('[Innersource User History] Should check latest snapshot for innersourceUserHistory for etasase user, organisation should be BNEW GSU', async (done) => {
    const responseUserhistory = await portal.innersourceUserHistoryGet('etasase', 'latest');

    const innersourceSnapshot = responseUserhistory.body.data.some(snapshot => snapshot.signum === 'etasase' && snapshot.organisation === 'BNEW GSU');

    expect(innersourceSnapshot).toBeTruthy();
    expect(responseUserhistory.code).toBe(200);
    done();
  });

  it('[Innersource User History] Should check latest snapshot for innersourceUserHistory for etarase user, organisation should be RAN0 RAN1', async (done) => {
    const responseUserhistory = await portal.innersourceUserHistoryGet('etarase', 'latest');

    const innersourceSnapshot = responseUserhistory.body.data.some(snapshot => snapshot.signum === 'etarase' && snapshot.organisation === 'RAN0 RAN1');

    expect(innersourceSnapshot).toBeTruthy();
    expect(responseUserhistory.code).toBe(200);
    done();
  });

  it('[Innersource User History] Should check latest snapshot for innersourceUserHistory for etesuse user, department is not avaliable', async (done) => {
    const responseUserhistory = await portal.innersourceUserHistoryGet('etesuse', 'latest');

    const innersourceSnapshot = responseUserhistory.body.data.filter(snapshot => snapshot.signum === 'etesuse');
    const snapshotOrganization = (innersourceSnapshot[0].organisation !== undefined);

    expect(snapshotOrganization).toBeFalsy();
    expect(innersourceSnapshot).toBeTruthy();
    expect(responseUserhistory.code).toBe(200);
    done();
  });

  it('[Innersource User History] Should check responce in case when incorrect date parameter passed', async (done) => {
    const responseUserhistory = await portal.innersourceUserHistoryGet('etesase', 'invalid');

    expect(responseUserhistory.code).toBe(400);
    done();
  });

  it('[Innersource User History] Should check responce in case when signum is not provided', async (done) => {
    const responseUserhistory = await portal.innersourceUserHistoryGet('', '');

    expect(responseUserhistory.code).toBe(400);
    done();
  });

  it('[Innersource User History] Should check responce in case when there is no snapshot for a specific date', async (done) => {
    const responseUserhistory = await portal.innersourceUserHistoryGet('etesase', '2021-01-17');
    const innersourceSnapshot = responseUserhistory.body.data;

    expect(innersourceSnapshot.length).toBe(0);
    expect(responseUserhistory.code).toBe(200);
    done();
  });
});
