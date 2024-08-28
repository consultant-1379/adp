// ============================================================================================= //
/**
* Unit test for [ global.adp.permission.getUserFromRequestObject ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.permission.getUserFromRequestObject ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.permission = {};
    global.adp.permission.getUserFromRequestObject = require('./getUserFromRequestObject');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Can extract User/Role from a valid object...', (done) => {
    const USERREQUEST = {
      user: {
        docs: [{
          _id: 'eunittestuser',
          role: 'admin',
        }],
      },
    };
    global.adp.permission.getUserFromRequestObject(USERREQUEST)
      .then((expectReturn) => {
        expect(expectReturn.role).toBe('admin');
        done();
      }).catch((ERROR) => {
        expect(ERROR).toBe('admin');
        done();
      });
  });

  it('Can extract User/Role from a valid object, even if signum has extra spaces...', (done) => {
    const USERREQUEST = {
      user: {
        docs: [{
          _id: '  eunittestuser      ',
          role: 'admin',
        }],
      },
    };
    global.adp.permission.getUserFromRequestObject(USERREQUEST)
      .then((expectReturn) => {
        expect(expectReturn.signum).toBe('eunittestuser');
        done();
      }).catch((ERROR) => {
        expect(ERROR).toBe('admin');
        done();
      });
  });

  it('Should reject with code 404 if the userRequest object, object.user, object.user.doc, object.user.doc[] is not set', async (done) => {
    await global.adp.permission.getUserFromRequestObject()
      .then(() => done.fail())
      .catch((ERROR) => {
        expect(ERROR).toBe(404);
      });

    await global.adp.permission.getUserFromRequestObject({})
      .then(() => done.fail())
      .catch((ERROR) => {
        expect(ERROR).toBe(404);
      });

    await global.adp.permission.getUserFromRequestObject({ user: {} })
      .then(() => done.fail())
      .catch((ERROR) => {
        expect(ERROR).toBe(404);
      });

    await global.adp.permission.getUserFromRequestObject({ user: { docs: [] } })
      .then(() => done.fail())
      .catch((ERROR) => {
        expect(ERROR).toBe(404);
      });

    done();
  });

  it('Should reject with code 404 if the user id and role are empty strings', async (done) => {
    await global.adp.permission.getUserFromRequestObject({ user: { docs: [{ _id: '' }] } })
      .then(() => done.fail())
      .catch((ERROR) => {
        expect(ERROR).toBe(404);
      });

    await global.adp.permission.getUserFromRequestObject({ user: { docs: [{ _id: 'signum', role: '' }] } })
      .then(() => done.fail())
      .catch((ERROR) => {
        expect(ERROR).toBe(404);
      });

    done();
  });

  it('Can`t extract User/Role from an Empty object...', (done) => {
    const USERREQUEST = {
      user: {
        docs: [{}],
      },
    };
    global.adp.permission.getUserFromRequestObject(USERREQUEST)
      .then((expectReturn) => {
        expect(expectReturn).toBe('admin');
        done();
      }).catch((ERROR) => {
        expect(ERROR).toBe(404);
        done();
      });
  });

  it('Can`t extract User/Role if user is undefined...', (done) => {
    const USERREQUEST = {
      user: {
        docs: [{
          role: 'admin',
        }],
      },
    };
    global.adp.permission.getUserFromRequestObject(USERREQUEST)
      .then((expectReturn) => {
        expect(expectReturn).toBe('admin');
        done();
      }).catch((ERROR) => {
        expect(ERROR).toBe(404);
        done();
      });
  });

  it('Can`t extract User/Role if role is undefined...', (done) => {
    const USERREQUEST = {
      user: {
        docs: [{
          _id: 'eunittestuser',
        }],
      },
    };
    global.adp.permission.getUserFromRequestObject(USERREQUEST)
      .then((expectReturn) => {
        expect(expectReturn).toBe('admin');
        done();
      }).catch((ERROR) => {
        expect(ERROR).toBe(404);
        done();
      });
  });
});
// ============================================================================================= //
