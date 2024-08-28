// ============================================================================================= //
/**
* Unit test for [ global.adp.tags.checkIt ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.tags.checkIt ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => {};
    global.adp.db = {};
    global.adp.tags = {};
    global.adp.tags.checkIt = require('./checkIt'); // eslint-disable-line global-require
    global.adp.tags.reload = async () => true;
    global.adp.tags.newTag = () => new Promise(RESOLVENEWTAG => RESOLVENEWTAG('N123'));

    global.adp.tags.items = [
      {
        id: '123',
        group: '1',
        tag: 'tagInMemory1',
        order: 1,
      },
      {
        id: '456',
        group: '1',
        tag: 'tagInMemory2',
        order: 2,
      },
      {
        id: '789',
        group: '1',
        tag: 'tagInMemory3',
        order: 3,
      },
    ];

    global.temp = {};
    global.temp.userobj = {
      signum: 'unitTestUser',
    };
    global.temp.tagsCanBeFoundInMemory = [
      { id: '123', label: 'tagInMemory1' },
      { id: '456', label: 'tagInMemory2' },
      { id: '789', label: 'tagInMemory3' },
    ];
    global.temp.tagsCanBeFoundInMemoryRESULT = ['123', '456', '789'];

    global.temp.withOneNewTag = [
      { id: '123', label: 'tagInMemory1' },
      { id: '456', label: 'tagInMemory2' },
      { id: '', label: 'New Tag' },
    ];
    global.temp.withOneNewTagRESULT = ['123', '456', 'N123'];

    global.temp.withEmptyTag = [
      { id: '', label: '             ' },
    ];

    global.temp.withNoAlphaNumericTag = [
      { id: '', label: 'InvalidTag漢字' },
    ];

    global.temp.tagsWithDuplicates = [
      { id: '123', label: 'tagInMemory1' },
      { id: '456', label: 'tagInMemory2' },
      { id: '123', label: 'tagInMemory1' },
      { id: '789', label: 'tagInMemory3' },
      { id: '789', label: 'tagInMemory3' },
      { id: '789', label: 'tagInMemory3' },
      { id: '456', label: 'tagInMemory2' },
    ];
    global.temp.tagsWithDuplicatesRESULT = ['123', '456', '789'];

    global.temp.existingTagWithoutId = [
      { id: '123', label: 'tagInMemory1' },
      { id: '', label: 'tagInMemory2' },
      { id: '789', label: 'tagInMemory3' },
    ];
    global.temp.existingTagWithoutIdRESULT = ['123', '789', 'N123'];
  });

  afterEach(() => {
    global.adp = null;
  });

  it('With valid Tags which is already in memory. Possibly the most commom situation.', (done) => {
    global.adp.tags.checkIt(global.temp.tagsCanBeFoundInMemory, global.temp.userobj)
      .then((RES) => {
        expect(RES).toEqual(global.temp.tagsCanBeFoundInMemoryRESULT);
        done();
      })
      .catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('With one new valid Tag between others Tags in memory.', (done) => {
    global.adp.tags.checkIt(global.temp.withOneNewTag, global.temp.userobj)
      .then((RES) => {
        expect(RES).toEqual(global.temp.withOneNewTagRESULT);
        done();
      })
      .catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('With duplicates, should just remove the duplicates and continue.', (done) => {
    global.adp.tags.checkIt(global.temp.tagsWithDuplicates, global.temp.userobj)
      .then((RES) => {
        expect(RES).toEqual(global.temp.tagsWithDuplicatesRESULT);
        done();
      })
      .catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('Sending an existing Tag without id. Should detect and use the existing id.', (done) => {
    global.adp.tags.checkIt(global.temp.existingTagWithoutId, global.temp.userobj)
      .then((RES) => {
        expect(RES).toEqual(global.temp.existingTagWithoutIdRESULT);
        done();
      })
      .catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('Trying create an empty Tag. Should return an error message.', (done) => {
    global.adp.tags.checkIt(global.temp.withEmptyTag, global.temp.userobj)
      .then(() => {
        expect(true).toBeFalsy();
        done();
      })
      .catch((ERR) => {
        expect(ERR).toEqual('Tag cannot be empty or contain only spaces.');
        done();
      });
  });

  it('Trying create a Tag with no alphanumeric characters. Should return an error message.', (done) => {
    global.adp.tags.checkIt(global.temp.withNoAlphaNumericTag, global.temp.userobj)
      .then(() => {
        expect(true).toBeFalsy();
        done();
      })
      .catch((ERR) => {
        expect(ERR).toEqual('The Tag "InvalidTag漢字" contains invalid characters.');
        done();
      });
  });
});
// ============================================================================================= //
