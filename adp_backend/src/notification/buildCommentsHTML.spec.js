// ============================================================================================= //
/**
* Unit test for [ global.adp.notification.buildCommentsHTML ]
* @author Rinosh
*/
// ============================================================================================= //
describe('Testing [ global.adp.notification.buildCommentsHTML ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.notification = {};
    global.adp.config = {};
    global.adp.config.baseSiteAddress = 'https://base-address';
    /* eslint-disable global-require */
    global.adp.notification.buildCommentsHTML = require('./buildCommentsHTML');
    /* eslint-enable global-require */
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should reject if comment data is undefined or empty', () => {
    const mailObj = {
      comment: {},
    };

    global.adp.notification.buildCommentsHTML({}).catch((error) => {
      expect(error.length).toBeGreaterThan(0);
    });

    global.adp.notification.buildCommentsHTML(mailObj).catch((error) => {
      expect(error.length).toBeGreaterThan(0);
    });
  });

  it('Should reject if the action is undefined or empty', () => {
    const mailObj = {
      comment: { _id: 'test' },
    };

    global.adp.notification.buildCommentsHTML(mailObj).catch((error) => {
      expect(error.length).toBeGreaterThan(0);
    });

    mailObj.action = '  ';
    global.adp.notification.buildCommentsHTML(mailObj).catch((error) => {
      expect(error.length).toBeGreaterThan(0);
    });
  });

  it('Should reject if the usr array is undefined or empty', () => {
    const mailObj = {
      comment: { _id: 'test' },
      action: 'test',
    };

    global.adp.notification.buildCommentsHTML(mailObj).catch((error) => {
      expect(error.length).toBeGreaterThan(0);
    });

    mailObj.usr = [];
    global.adp.notification.buildCommentsHTML(mailObj).catch((error) => {
      expect(error.length).toBeGreaterThan(0);
    });
  });

  it('Should return html containing the users information, comment data and the action layout for create or delete.', () => {
    let mailObj = {
      comment:
      {
        _id: '657c2704fbd62531c08abee9',
        location_id: 'msdocumentation_45e7f4f992afe7bbb62a3391e5010c3b_321-additional-documents-troubleshooting-guide',
        location_page: 'comment-h2-introduction-branch',
        location_author: [
          'Super User',
        ],
        location_email: [
          'super-user@adp-test.com',
        ],
        location_signum: [
          'esupuse',
        ],
        location_type: 'msdocumentation',
        location_ms: {
          ms_id: '45e7f4f992afe7bbb62a3391e5010c3b',
          ms_page: '321-additional-documents-troubleshooting-guide',
        },
        dt_create: '2023-12-15T10:14:28.926Z',
        dt_last_update: '2023-12-15T10:14:28.926Z',
        signum: 'esupuse',
        nm_author: 'Super User',
        nm_email: 'super-user@adp-test.com',
        desc_comment: 'my comments',
      },
      action: 'add',
      usr: [
        { name: 'testName', email: 'testEmail', signum: 'testSignum' },
      ],
    };

    global.adp.notification.buildCommentsHTML(mailObj).then((newMailObj) => {
      const htmlResult = newMailObj.messageHTML;

      expect(htmlResult).toContain(mailObj.comment.nm_author);
      expect(htmlResult).toContain(mailObj.comment.location_author);
      expect(htmlResult).toContain(mailObj.comment.dt_last_update);
    });

    // delete
    mailObj = {
      comment:
      {
        _id: '657c2704fbd62531c08abee9',
        location_id: 'msdocumentation_45e7f4f992afe7bbb62a3391e5010c3b_321-additional-documents-troubleshooting-guide',
        location_page: 'comment-h2-introduction-branch',
        location_author: [
          'Super User',
        ],
        location_email: [
          'super-user@adp-test.com',
        ],
        location_signum: [
          'esupuse',
        ],
        location_type: 'msdocumentation',
        location_ms: {
          ms_id: '45e7f4f992afe7bbb62a3391e5010c3b',
          ms_page: '321-additional-documents-troubleshooting-guide',
        },
        dt_create: '2023-12-15T10:14:28.926Z',
        dt_last_update: '2023-12-15T10:14:28.926Z',
        signum: 'esupuse',
        nm_author: 'Super User',
        nm_email: 'super-user@adp-test.com',
        desc_comment: 'my comments',
        dt_deleted: '2023-12-15T11:04:32.297Z',
        deleted: true,
      },
      action: 'delete',
      usr: [
        { name: 'testName', email: 'testEmail', signum: 'testSignum' },
      ],
    };

    global.adp.notification.buildCommentsHTML(mailObj).then((newMailObj) => {
      const htmlResult = newMailObj.messageHTML;

      expect(htmlResult).toContain(mailObj.comment.nm_author);
      expect(htmlResult).toContain(mailObj.comment.location_author);
      expect(htmlResult).toContain(mailObj.comment.dt_last_update);
    });
  });


  it('Should return html containing the users information, comment data and the action layout for update.', () => {
    const mailObj = {
      comment:
      {
        _id: '657c2704fbd62531c08abee9',
        location_id: 'msdocumentation_45e7f4f992afe7bbb62a3391e5010c3b_321-additional-documents-troubleshooting-guide',
        location_page: 'comment-h2-introduction-branch',
        location_author: [
          'Super User',
        ],
        location_email: [
          'super-user@adp-test.com',
        ],
        location_signum: [
          'esupuse',
        ],
        location_type: 'msdocumentation',
        location_ms: {
          ms_id: '45e7f4f992afe7bbb62a3391e5010c3b',
          ms_page: '321-additional-documents-troubleshooting-guide',
        },
        dt_create: '2023-12-15T10:14:28.926Z',
        dt_last_update: '2023-12-15T10:14:28.926Z',
        signum: 'esupuse',
        nm_author: 'Super User',
        nm_email: 'super-user@adp-test.com',
        desc_comment: 'my comments',
      },
      action: 'update',
      usr: [
        { name: 'testName', email: 'testEmail', signum: 'testSignum' },
      ],
    };

    global.adp.notification.buildCommentsHTML(mailObj).then((newMailObj) => {
      const htmlResult = newMailObj.messageHTML;

      expect(htmlResult).toContain(mailObj.comment.nm_author);
      expect(htmlResult).toContain(mailObj.comment.location_author);
      expect(htmlResult).toContain(mailObj.comment.dt_last_update);
    });
  });

  it('Should return html containing the users information, comment data and the action layout for resolve.', () => {
    const mailObj = {
      comment:
      {
        _id: '65941c8dfbd62531c08abf2d',
        location_id: 'msdocumentation_45e7f4f992afe7bbb62a3391e5010c3b_321-additional-documents-troubleshooting-guide',
        location_page: 'comment-h2-introduction-branch',
        location_author: [
          'Super User',
        ],
        location_email: [
          'super-user@adp-test.com',
        ],
        location_signum: [
          'esupuse',
        ],
        location_type: 'msdocumentation',
        location_ms: {
          ms_id: '45e7f4f992afe7bbb62a3391e5010c3b',
          ms_page: '321-additional-documents-troubleshooting-guide',
        },
        dt_create: '2024-01-02T14:24:13.311Z',
        dt_last_update: '2024-01-02T14:24:13.311Z',
        signum: 'esupuse',
        nm_author: 'Super User',
        nm_email: 'super-user@adp-test.com',
        desc_comment: 'my comments',
        resolve: true,
        dt_resolve: '2024-01-02T14:24:49.048Z',
        desc_resolve: 'Content updated and will be published in an upcoming product release',
        resolve_signum: 'esupuse',
        resolve_author: 'Super User',
        resolve_email: 'super-user@adp-test.com',
      },
      action: 'resolve',
      usr: [
        { name: 'testName', email: 'testEmail', signum: 'testSignum' },
      ],
    };

    global.adp.notification.buildCommentsHTML(mailObj).then((newMailObj) => {
      const htmlResult = newMailObj.messageHTML;

      expect(htmlResult).toContain(mailObj.comment.nm_author);
      expect(htmlResult).toContain(mailObj.comment.location_author);
      expect(htmlResult).toContain(mailObj.comment.dt_last_update);
      expect(htmlResult).toContain(mailObj.comment.desc_resolve);
      expect(htmlResult).toContain('Resolved');
    });
  });

  it('check for invalid action state.', () => {
    const mailObj = {
      comment:
      {
        _id: '65941c8dfbd62531c08abf2d',
        location_id: 'article_3346',
        location_page: 'comment-h1-what_is_adp',
        location_author: [
          'Super User',
        ],
        location_email: [
          'super-user@adp-test.com',
        ],
        location_signum: [
          'esupuse',
        ],
        location_type: 'article',
        location_ms: {
          ms_id: '3346',
          ms_page: null,
        },
        dt_create: '2024-01-02T14:24:13.311Z',
        dt_last_update: '2024-01-02T14:24:13.311Z',
        signum: 'esupuse',
        nm_author: 'Super User',
        nm_email: 'super-user@adp-test.com',
        desc_comment: 'my comments',
        resolve: true,
        dt_resolve: '2024-01-02T14:24:49.048Z',
        desc_resolve: 'Content updated and will be published in an upcoming product release',
        resolve_signum: 'esupuse',
        resolve_author: 'Super User',
        resolve_email: 'super-user@adp-test.com',
      },
      action: 'test',
      usr: [
        { name: 'testName', email: 'testEmail', signum: 'testSignum' },
      ],
    };

    global.adp.notification.buildCommentsHTML(mailObj).then((newMailObj) => {
      const htmlResult = newMailObj.messageHTML;

      expect(htmlResult).not.toContain(mailObj.comment.desc_comment);
    });
  });
});
