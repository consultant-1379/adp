const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();


describe('Testing fetchUsersBySignum endpoint', () => {
  beforeAll(async () => {
    await portal.login();
  });

  it('Should return data for etesuse user and check code and length', async () => {
    const userSignum = ['etesuse'];
    const responsePreviewPost = await portal.fetchUsersBySignum(userSignum);
    const usersResponce = responsePreviewPost.body.data;

    expect(usersResponce.length).toBe(1);
    expect(responsePreviewPost.code).toBe(200);
  });

  it('Should return data for several users and check code and length', async () => {
    const userSignum = ['etesuse', 'esupuse', 'etarase'];
    const responsePreviewPost = await portal.fetchUsersBySignum(userSignum);
    const usersResponce = responsePreviewPost.body.data;
    const includesUser1 = usersResponce.some(obj => obj.signum.includes('etesuse'));
    const includesUser2 = usersResponce.some(obj => obj.signum.includes('esupuse'));
    const includesUser3 = usersResponce.some(obj => obj.signum.includes('etarase'));

    expect(includesUser1).toBe(true);
    expect(includesUser2).toBe(true);
    expect(includesUser3).toBe(true);

    expect(usersResponce.length).toBe(3);
    expect(responsePreviewPost.code).toBe(200);
  });

  it('Should return 400 when try to send boolean instead of string as user signum', async () => {
    const userSignum = [true];
    const responsePreviewPost = await portal.fetchUsersBySignum(userSignum);

    expect(responsePreviewPost.code).toBe(400);
  });

  it('Should return empty array when signum is not found', async () => {
    const userSignum = ['testSignum'];
    const responsePreviewPost = await portal.fetchUsersBySignum(userSignum);
    const usersResponce = responsePreviewPost.body.data;

    expect(usersResponce.length).toBe(0);
    expect(responsePreviewPost.code).toBe(200);
  });

  it('Should return 400 when try to send null value instead of string as user signum', async () => {
    const userSignum = [];
    const responsePreviewPost = await portal.fetchUsersBySignum(userSignum);

    expect(responsePreviewPost.code).toBe(400);
  });

  it('Should return data only for the valid signums and ignore the incorrect signum values', async () => {
    const userSignum = ['invalidSignum1', 'esupuse', 'etesuse', 'invalidSignum2'];
    const responsePreviewPost = await portal.fetchUsersBySignum(userSignum);
    const usersResponce = responsePreviewPost.body.data;

    const includesUser1 = usersResponce.some(obj => obj.signum.includes('invalidSignum1'));
    const includesUser2 = usersResponce.some(obj => obj.signum.includes('esupuse'));
    const includesUser3 = usersResponce.some(obj => obj.signum.includes('etesuse'));
    const includesUser4 = usersResponce.some(obj => obj.signum.includes('invalidSignum2'));

    expect(includesUser1).toBe(false);
    expect(includesUser2).toBe(true);
    expect(includesUser3).toBe(true);
    expect(includesUser4).toBe(false);

    expect(usersResponce.length).toBe(2);
    expect(responsePreviewPost.code).toBe(200);
  })

   it('Should return 200 and data for valid signums', async () => {
    const userSignum = ['etesuse', 'esupuse',''];
    const responsePreviewPost = await portal.fetchUsersBySignum(userSignum);
    const usersResponce = responsePreviewPost.body.data;
    
    expect(usersResponce.length).toBe(2);
    expect(responsePreviewPost.code).toBe(200);
  })

  it('Should return data for single signum only if duplicate signums are passed', async () => {
    const userSignum = ['esupuse', 'esupuse'];
    const responsePreviewPost = await portal.fetchUsersBySignum(userSignum);
    const usersResponce = responsePreviewPost.body.data;

    const includesUser1 = usersResponce.some(obj => obj.signum.includes('esupuse'));
    const includesUser2 = usersResponce.some(obj => obj.signum.includes('esupuse'));

    expect(includesUser1).toBe(true);
    expect(includesUser2).toBe(true);
    expect(usersResponce.length).toBe(1);
    expect(responsePreviewPost.code).toBe(200);
  })

  it('Should return 200 and empty array for data value when only empty string is passed', async () =>{
    const userSignum = [''];
    const responsePreviewPost = await portal.fetchUsersBySignum(userSignum);
    const usersResponce = responsePreviewPost.body.data;

    expect(usersResponce.length).toBe(0);
    expect(responsePreviewPost.code).toBe(200);    
  })

});
