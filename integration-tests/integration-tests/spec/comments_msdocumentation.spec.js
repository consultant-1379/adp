/* eslint-disable no-console */
/* eslint-disable jasmine/no-focused-tests */

const {
  PortalPrivateAPI,
} = require('./apiClients');
const { ApiTools } = require('./apiTools');

let transferDataToTheNextTest = null;
let transferDataToTheNextTest1 = null;
let transferDataToTheNextTest2 = null;
let originalValue;

const portal = new PortalPrivateAPI();
const apiTools = new ApiTools();
const login = require('../endpoints/login.js');


describe('[[COMMENT::MSDOCUMENTATION::A---]] Basic tests for Comments ( Sequential Tests )', () => {
  beforeAll(async (done) => {
    originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    await portal.login();
    done();
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

  it('Preparing [[COMMENT::MSDOCUMENTATION::A---]]...', async (done) => {
    await apiTools.waitFor(1);
    done();
  });

  it('[[COMMENT::MSDOCUMENTATION::A001]] Should create a comment in Microservice Mock Document page', async (done) => {
    const locationID = 'msdocumentation_45e7f4f992afe7bbb62a3391e500ffb1_1.0.0-dpi-default-document';
    await portal.postComment(locationID, 'ms title', 'h1-title', ['Super User'], ['super-user@adp-test.com'], ['esupuse'], 'Comment Text')
      .then((POSTED) => {
        if (!POSTED) {
          expect(POSTED)
            .withContext('Unexpected answer from server!')
            .toBeDefined();
          done.fail();
          return;
        }

        const body = POSTED
          && POSTED.body
          ? POSTED.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 200, got ${body.code} instead.`)
          .toEqual(200);

        const parameters = POSTED
          && POSTED.body
          && POSTED.body.BODYREQUEST
          ? POSTED.body.BODYREQUEST
          : null;

        expect(parameters.location_id)
          .withContext(`Parameter location_id should be '${locationID}', got ${parameters.location_id} instead.`)
          .toEqual(`${locationID}`);

        expect(parameters.location_title)
          .withContext(`Parameter location_title should be 'ms title', got ${parameters.location_title} instead.`)
          .toEqual('ms title');

        expect(parameters.location_page)
          .withContext(`Parameter location_page should be 'h1-title', got ${parameters.location_page} instead.`)
          .toEqual('h1-title');

        expect(parameters.location_author)
          .withContext(`Parameter location_author should be ['Super User'], got ${parameters.location_author} instead.`)
          .toEqual(['Super User']);

        expect(parameters.location_email)
          .withContext(`Parameter location_email should be ['super-user@adp-test.com'], got ${parameters.location_email} instead.`)
          .toEqual(['super-user@adp-test.com']);

        expect(parameters.location_signum)
          .withContext(`Parameter location_signum should be ['esupuse'], got ${parameters.location_signum} instead.`)
          .toEqual(['esupuse']);

        expect(parameters.comment_text)
          .withContext('Parameter comment_text should be defined.')
          .toBeDefined();

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::A001]] ERROR :: ', ERROR);
        done.fail();
      });
  });

  it('[[COMMENT::MSDOCUMENTATION::A002]] Should read comment from Microservice Mock Document page', async (done) => {
    const locationID = 'msdocumentation_45e7f4f992afe7bbb62a3391e500ffb1_1.0.0-dpi-default-document';
    await portal.getComments(locationID)
      .then((GOT) => {
        if (!GOT) {
          expect(GOT)
            .withContext('Unexpected answer from server!')
            .toBeDefined();
          done.fail();
          return;
        }

        const body = GOT
          && GOT.body
          ? GOT.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 200, got ${body.code} instead.`)
          .toEqual(200);

        const comment = GOT
          && GOT.body
          && Array.isArray(GOT.body.docs)
          && GOT.body.docs[0]
          ? GOT.body.docs[0]
          : null;

        transferDataToTheNextTest = { _id: comment._id };

        expect(comment._id)
          .withContext('Comment unique id should be defined.')
          .toBeDefined();

        expect(comment.location_id)
          .withContext(`Comment location_id should be '${locationID}', got ${comment.location_id} instead.`)
          .toEqual(`${locationID}`);

        expect(comment.location_title)
          .withContext(`Comment location_title should be 'ms title', got ${comment.location_title} instead.`)
          .toEqual('ms title');

        expect(comment.location_page)
          .withContext(`Comment location_page should be 'h1-title', got ${comment.location_page} instead.`)
          .toEqual('h1-title');

        expect(comment.location_author)
          .withContext(`Comment location_author should be ['Super User'], got ${comment.location_author} instead.`)
          .toEqual(['Super User']);

        expect(comment.location_email)
          .withContext(`Comment location_email should be ['super-user@adp-test.com'], got ${comment.location_email} instead.`)
          .toEqual(['super-user@adp-test.com']);

        expect(comment.location_signum)
          .withContext(`Comment location_signum should be ['esupuse'], got ${comment.location_signum} instead.`)
          .toEqual(['esupuse']);

        expect(comment.signum)
          .withContext(`Comment signum should be 'esupuse', got ${comment.signum} instead.`)
          .toEqual('esupuse');

        expect(comment.desc_comment)
          .withContext('Parameter desc_comment should be defined.')
          .toBeDefined();

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::A002]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::A003]] Should update a specific comment from Microservice Mock Document page', async (done) => {
    if (!transferDataToTheNextTest || !transferDataToTheNextTest._id) {
      console.log('The test [[COMMENT::MSDOCUMENTATION::A003]] can`t run without the tests [[COMMENT::MSDOCUMENTATION::A001]] and [[COMMENT::MSDOCUMENTATION::A002]].');
      done.fail();
      return;
    }
    await portal.putComment(transferDataToTheNextTest._id, 'Updated Text')
      .then((PUT) => {
        const body = PUT
          && PUT.body
          ? PUT.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 200, got ${body.code} instead.`)
          .toEqual(200);

        const parameters = PUT
          && PUT.body
          && PUT.body.BODYREQUEST
          ? PUT.body.BODYREQUEST
          : null;

        expect(`${parameters.comment_id}`)
          .withContext(`Comment unique id should be ${transferDataToTheNextTest._id}.`)
          .toEqual(`${transferDataToTheNextTest._id}`);

        expect(parameters.comment_text)
          .withContext(`comment_text should be 'Updated Text', got ${parameters.comment_text} instead.`)
          .toEqual('Updated Text');

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::A003]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::A004]] Should read the previous comment to check the last update', async (done) => {
    if (!transferDataToTheNextTest || !transferDataToTheNextTest._id) {
      console.log('The test [[COMMENT::MSDOCUMENTATION::A004]] can`t run without the tests [[COMMENT::MSDOCUMENTATION::A001]], [[COMMENT::MSDOCUMENTATION::A002]] and [[COMMENT::MSDOCUMENTATION::A003]].');
      done.fail();
      return;
    }
    const locationID = 'msdocumentation_45e7f4f992afe7bbb62a3391e500ffb1_1.0.0-dpi-default-document';
    await portal.getComments(locationID)
      .then((GOT) => {
        const body = GOT
        && GOT.body
          ? GOT.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 200, got ${body.code} instead.`)
          .toEqual(200);

        const comment = GOT
        && GOT.body
        && Array.isArray(GOT.body.docs)
          ? GOT.body.docs
          : null;

        let foundComment = null;
        comment.forEach((COMMENT) => {
          if (`${COMMENT._id}` === `${transferDataToTheNextTest._id}`) {
            foundComment = COMMENT;
          }
        });

        expect(foundComment._id)
          .withContext(`Comment id should be '${transferDataToTheNextTest._id}', got ${foundComment.id} instead.`)
          .toEqual(`${transferDataToTheNextTest._id}`);

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::A004]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::A005]] Should resolve a specific comment from Microservice Mock Document page', async (done) => {
    if (!transferDataToTheNextTest || !transferDataToTheNextTest._id) {
      console.log('The test [[COMMENT::MSDOCUMENTATION::A005]] can`t run without the tests [[COMMENT::MSDOCUMENTATION::A001]] and [[COMMENT::MSDOCUMENTATION::A002]].');
      done.fail();
      return;
    }
    await portal.resolveComment(transferDataToTheNextTest._id, 'Resolved Text')
      .then((PUT) => {
        const body = PUT
          && PUT.body
          ? PUT.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 200, got ${body.code} instead.`)
          .toEqual(200);

        const parameters = PUT
          && PUT.body
          && PUT.body.BODYREQUEST
          ? PUT.body.BODYREQUEST
          : null;

        expect(`${parameters.comment_id}`)
          .withContext(`Comment unique id should be ${transferDataToTheNextTest._id}.`)
          .toEqual(`${transferDataToTheNextTest._id}`);

        expect(parameters.resolve_text)
          .withContext(`resolve_text should be 'Resolved Text', got ${parameters.resolve_text} instead.`)
          .toEqual('Resolved Text');

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::A005]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::A006]] Should read the previous comment to check the last resolve', async (done) => {
    if (!transferDataToTheNextTest || !transferDataToTheNextTest._id) {
      console.log('The test [[COMMENT::MSDOCUMENTATION::A006]] can`t run without the tests [[COMMENT::MSDOCUMENTATION::A001]], [[COMMENT::MSDOCUMENTATION::A002]] and [[COMMENT::MSDOCUMENTATION::A005]].');
      done.fail();
      return;
    }
    const locationID = 'msdocumentation_45e7f4f992afe7bbb62a3391e500ffb1_1.0.0-dpi-default-document';
    await portal.getComments(locationID)
      .then((GOT) => {
        const body = GOT
        && GOT.body
          ? GOT.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 200, got ${body.code} instead.`)
          .toEqual(200);

        const comment = GOT
        && GOT.body
        && Array.isArray(GOT.body.docs)
          ? GOT.body.docs
          : null;

        let foundComment = null;
        comment.forEach((COMMENT) => {
          if (`${COMMENT._id}` === `${transferDataToTheNextTest._id}`) {
            foundComment = COMMENT;
          }
        });

        expect(foundComment._id)
          .withContext(`Comment id should be '${transferDataToTheNextTest._id}', got ${foundComment.id} instead.`)
          .toEqual(`${transferDataToTheNextTest._id}`);

        expect(foundComment.resolve)
          .withContext(`Comment resolve should be true, got ${foundComment.resolve} instead.`)
          .toEqual(true);

        expect(foundComment.desc_resolve)
          .withContext(`desc_resolve should be 'Resolved Text', got ${foundComment.desc_resolve} instead.`)
          .toEqual('Resolved Text');

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::A006]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::A007]] Should delete a specific comment', async (done) => {
    if (!transferDataToTheNextTest || !transferDataToTheNextTest._id) {
      console.log('The test [[COMMENT::MSDOCUMENTATION::A007]] can`t run without the tests [[COMMENT::MSDOCUMENTATION::A001]], [[COMMENT::MSDOCUMENTATION::A002]], [[COMMENT::MSDOCUMENTATION::A003]] and [[COMMENT::MSDOCUMENTATION::A004]].');
      done.fail();
      return;
    }
    await portal.deleteComment(`${transferDataToTheNextTest._id}`)
      .then((DELETED) => {
        const body = DELETED
        && DELETED.body
          ? DELETED.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 200, got ${body.code} instead.`)
          .toEqual(200);

        expect(body.message)
          .withContext(`Server message should be 'Comment successful deleted', got ${body.message} instead.`)
          .toEqual('Comment successful deleted');

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::A007]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::A008]] Should read the previous comment to check if it was deleted', async (done) => {
    if (!transferDataToTheNextTest || !transferDataToTheNextTest._id) {
      console.log('The test [[COMMENT::MSDOCUMENTATION::A008]] can`t run without the tests [[COMMENT::MSDOCUMENTATION::A001]], [[COMMENT::MSDOCUMENTATION::A002]], [[COMMENT::MSDOCUMENTATION::A003]], [[COMMENT::MSDOCUMENTATION::A004]] and [[COMMENT::MSDOCUMENTATION::A007]].');
      done.fail();
      return;
    }
    const locationID = 'msdocumentation_45e7f4f992afe7bbb62a3391e500ffb1_1.0.0-dpi-default-document';
    await portal.getComments(locationID)
      .then((GOT) => {
        const body = GOT
        && GOT.body
          ? GOT.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 200, got ${body.code} instead.`)
          .toEqual(200);

        const comment = GOT
        && GOT.body
        && Array.isArray(GOT.body.docs)
          ? GOT.body.docs
          : null;

        let foundComment = null;
        comment.forEach((COMMENT) => {
          if (`${COMMENT._id}` === `${transferDataToTheNextTest._id}`) {
            foundComment = COMMENT;
          }
        });

        expect(foundComment)
          .withContext(`Comment id should be null, got ${JSON.stringify(foundComment, null, 2)} instead.`)
          .toBeNull();

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::A008]] ERROR :: ', ERROR);
        done.fail();
      });
  });
});

describe('[[COMMENT::MSDOCUMENTATION::B---]] Negative tests for Comments', () => {
  beforeAll(async (done) => {
    originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    await portal.login();
    done();
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

  it('Preparing [[COMMENT::MSDOCUMENTATION::B---]]...', async (done) => {
    await apiTools.waitFor(1);
    done();
  });

  it('[[COMMENT::MSDOCUMENTATION::B001]] Should fail when trying to create a comment with no parameters at all', async (done) => {
    await portal.postComment()
      .then((POSTED) => {
        if (!POSTED) {
          expect(POSTED)
            .withContext('Unexpected answer from server!')
            .toBeDefined();
          done.fail();
          return;
        }

        const body = POSTED
          && POSTED.body
          ? POSTED.body
          : null;

        expect(body.code)
          .withContext(`Negative test: Server Status Code should be 400, got ${body.code} instead.`)
          .toEqual(400);

        expect(body.message)
          .withContext(`Negative test: Server Message should be 'Bad Request', got ${body.message} instead.`)
          .toEqual('Bad Request');

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::B001]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::B002]] Should fail when trying to create a comment missing the "comment" parameter', async (done) => {
    const locationID = 'msdocumentation_45e7f4f992afe7bbb62a3391e500ffb1_1.0.0-dpi-default-document';
    await portal.postComment(locationID, 'ms title', 'h1-title')
      .then((POSTED) => {
        if (!POSTED) {
          expect(POSTED)
            .withContext('Unexpected answer from server!')
            .toBeDefined();
          done.fail();
          return;
        }

        const body = POSTED
          && POSTED.body
          ? POSTED.body
          : null;

        expect(body.code)
          .withContext(`Negative test: Server Status Code should be 400, got ${body.code} instead.`)
          .toEqual(400);

        expect(body.message)
          .withContext(`Negative test: Server Message should be 'Bad Request', got ${body.message} instead.`)
          .toEqual('Bad Request');

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::B002]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::B003]] Should fail when trying to create a comment with "locationPage" parameter set as null', async (done) => {
    const locationID = 'msdocumentation_45e7f4f992afe7bbb62a3391e500ffb1_1.0.0-dpi-default-document';
    await portal.postComment(locationID, 'ms title', null, 'Comment Text')
      .then((POSTED) => {
        if (!POSTED) {
          expect(POSTED)
            .withContext('Unexpected answer from server!')
            .toBeDefined();
          done.fail();
          return;
        }

        const body = POSTED
          && POSTED.body
          ? POSTED.body
          : null;

        expect(body.code)
          .withContext(`Negative test: Server Status Code should be 400, got ${body.code} instead.`)
          .toEqual(400);

        expect(body.message)
          .withContext(`Negative test: Server Message should be 'Bad Request', got ${body.message} instead.`)
          .toEqual('Bad Request');

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::B003]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::B004]] Should fail when trying to create a comment with "locationId" parameter set as null', async (done) => {
    await portal.postComment(null, 'ms title', 'h1-title', 'Comment Text')
      .then((POSTED) => {
        if (!POSTED) {
          expect(POSTED)
            .withContext('Unexpected answer from server!')
            .toBeDefined();
          done.fail();
          return;
        }

        const body = POSTED
          && POSTED.body
          ? POSTED.body
          : null;

        expect(body.code)
          .withContext(`Negative test: Server Status Code should be 400, got ${body.code} instead.`)
          .toEqual(400);

        expect(body.message)
          .withContext(`Negative test: Server Message should be 'Bad Request', got ${body.message} instead.`)
          .toEqual('Bad Request');

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::B004]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::B005]] Should fail when trying to create a comment with invalid ms id in "locationId" parameter', async (done) => {
    const locationID = 'msdocumentation_invalidMicroserviceId_1.0.0-dpi-default-document';
    await portal.postComment(locationID, 'ms title', 'h1-title', 'Comment Text')
      .then((POSTED) => {
        if (!POSTED) {
          expect(POSTED)
            .withContext('Unexpected answer from server!')
            .toBeDefined();
          done.fail();
          return;
        }

        const body = POSTED
          && POSTED.body
          ? POSTED.body
          : null;

        expect(body.code)
          .withContext(`Negative test: Server Status Code should be 400, got ${body.code} instead.`)
          .toEqual(400);

        expect(body.message)
          .withContext(`Negative test: Server Message should be 'Bad Request', got ${body.message} instead.`)
          .toEqual('Bad Request');

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::B005]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::B006]] Should fail when trying to create a comment without the type "ms" defined in "locationId" parameter', async (done) => {
    const locationID = '45e7f4f992afe7bbb62a3391e500ffb1_1.0.0-dpi-default-document';
    await portal.postComment(locationID, 'ms title', 'h1-title', 'Comment Text')
      .then((POSTED) => {
        if (!POSTED) {
          expect(POSTED)
            .withContext('Unexpected answer from server!')
            .toBeDefined();
          done.fail();
          return;
        }

        const body = POSTED
          && POSTED.body
          ? POSTED.body
          : null;

        expect(body.code)
          .withContext(`Negative test: Server Status Code should be 400, got ${body.code} instead.`)
          .toEqual(400);

        expect(body.message)
          .withContext(`Negative test: Server Message should be 'Bad Request', got ${body.message} instead.`)
          .toEqual('Bad Request');

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::B006]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::B007]] Should fail trying to read if parameter is undefined', async (done) => {
    await portal.getComments()
      .then((GOT) => {
        if (!GOT) {
          expect(GOT)
            .withContext('Unexpected answer from server!')
            .toBeDefined();
          done.fail();
          return;
        }

        const body = GOT
          && GOT.body
          ? GOT.body
          : null;

        expect(body.code)
          .withContext(`Negative test: Server Status Code should be 400, got ${body.code} instead.`)
          .toEqual(400);

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::B007]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::B008]] Should fail trying to read if ms id is invalid', async (done) => {
    const locationID = 'msdocumentation_invalidMsId_1.0.0-dpi-default-document';
    await portal.getComments(locationID)
      .then((GOT) => {
        if (!GOT) {
          expect(GOT)
            .withContext('Unexpected answer from server!')
            .toBeDefined();
          done.fail();
          return;
        }

        const body = GOT
          && GOT.body
          ? GOT.body
          : null;

        expect(body.code)
          .withContext(`Negative test: Server Status Code should be 400, got ${body.code} instead.`)
          .toEqual(400);

        expect(body.message)
          .withContext(`Negative test: Server Message should be 'Bad Request', got ${body.message} instead.`)
          .toEqual('Bad Request');

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::B008]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::B009]] Should fail trying to read if type is invalid in locationId', async (done) => {
    const locationID = '45e7f4f992afe7bbb62a3391e500ffb1_1.0.0-dpi-default-document';
    await portal.getComments(locationID)
      .then((GOT) => {
        if (!GOT) {
          expect(GOT)
            .withContext('Unexpected answer from server!')
            .toBeDefined();
          done.fail();
          return;
        }

        const body = GOT
          && GOT.body
          ? GOT.body
          : null;

        expect(body.code)
          .withContext(`Negative test: Server Status Code should be 400, got ${body.code} instead.`)
          .toEqual(400);

        expect(body.message)
          .withContext(`Negative test: Server Message should be 'Bad Request', got ${body.message} instead.`)
          .toEqual('Bad Request');

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::B009]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::B010]] Should fail to update if got no parameters', async (done) => {
    await portal.putComment()
      .then((PUT) => {
        const body = PUT
          && PUT.body
          ? PUT.body
          : null;

        expect(body.code)
          .withContext(`Negative test: Server Status Code should be 400, got ${body.code} instead.`)
          .toEqual(400);

        expect(body.message)
          .withContext(`Negative test: Server Message should be 'Bad Request', got ${body.message} instead.`)
          .toEqual('Bad Request');

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::B010]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::B011]] Should fail to update if got no text', async (done) => {
    await portal.putComment('635bc88defb76034f9032c3d')
      .then((PUT) => {
        const body = PUT
          && PUT.body
          ? PUT.body
          : null;

        expect(body.code)
          .withContext(`Negative test: Server Status Code should be 400, got ${body.code} instead.`)
          .toEqual(400);

        expect(body.message)
          .withContext(`Negative test: Server Message should be 'Bad Request', got ${body.message} instead.`)
          .toEqual('Bad Request');

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::B011]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::B012]] Should fail to resolve if got no parameters', async (done) => {
    await portal.resolveComment()
      .then((PUT) => {
        const body = PUT
          && PUT.body
          ? PUT.body
          : null;

        expect(body.code)
          .withContext(`Negative test: Server Status Code should be 400, got ${body.code} instead.`)
          .toEqual(400);

        expect(body.message)
          .withContext(`Negative test: Server Message should be 'Bad Request', got ${body.message} instead.`)
          .toEqual('Bad Request');

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::B012]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::B013]] Should fail to resolve if got no text', async (done) => {
    await portal.resolveComment('635bc88defb76034f9032c3d')
      .then((PUT) => {
        const body = PUT
          && PUT.body
          ? PUT.body
          : null;

        expect(body.code)
          .withContext(`Negative test: Server Status Code should be 400, got ${body.code} instead.`)
          .toEqual(400);

        expect(body.message)
          .withContext(`Negative test: Server Message should be 'Bad Request', got ${body.message} instead.`)
          .toEqual('Bad Request');

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::B013]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::B014]] Should not be able to delete a comment without parameters', async (done) => {
    await portal.deleteComment()
      .then((DELETED) => {
        const body = DELETED
        && DELETED.body
          ? DELETED.body
          : null;

        expect(body.code)
          .withContext(`Negative test: Server Status Code should be 400, got ${body.code} instead.`)
          .toEqual(400);

        expect(body.message)
          .withContext(`Negative test: Server Message should be 'Bad Request', got ${body.message} instead.`)
          .toEqual('Bad Request');

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::B014]] ERROR :: ', ERROR);
        done.fail();
      });
  });
});


describe('[[COMMENT::MSDOCUMENTATION::D---]] Basic tests for Comments for different users( Sequential Tests )', () => {
  beforeAll(async (done) => {
    originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    done();
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

  it('Preparing [[COMMENT::MSDOCUMENTATION::D---]]...', async (done) => {
    await apiTools.waitFor(1);
    done();
  });

  it('[[COMMENT::MSDOCUMENTATION::D001]] Should create a comment in Microservice Mock Document page for Etesase user', async (done) => {
    const locationID = 'msdocumentation_17e57f6cea1b5a673f8775e6cf023344_1.0.0-dpi-default-document';
    await portal.login(login.optionsTestUserEtesase);
    await portal.postComment(locationID, 'ms title', 'h3-title', ['Super User'], ['super-user@adp-test.com'], ['esupuse'], 'Text for Comment made by Etesase')
      .then((POSTED) => {
        if (!POSTED) {
          expect(POSTED)
            .withContext('Unexpected answer from server!')
            .toBeDefined();
          done.fail();
          return;
        }

        const body = POSTED
          && POSTED.body
          ? POSTED.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 200, got ${body.code} instead.`)
          .toEqual(200);

        const parameters = POSTED
          && POSTED.body
          && POSTED.body.BODYREQUEST
          ? POSTED.body.BODYREQUEST
          : null;

        expect(parameters.location_id)
          .withContext(`Parameter location_id should be '${locationID}', got ${parameters.location_id} instead.`)
          .toEqual(`${locationID}`);

        expect(parameters.location_title)
          .withContext(`Parameter location_title should be 'ms title', got ${parameters.location_title} instead.`)
          .toEqual('ms title');

        expect(parameters.location_page)
          .withContext(`Parameter location_page should be 'h3-title', got ${parameters.location_page} instead.`)
          .toEqual('h3-title');

        expect(parameters.location_author)
          .withContext(`Parameter location_author should be ['Super User'], got ${parameters.location_author} instead.`)
          .toEqual(['Super User']);

        expect(parameters.location_email)
          .withContext(`Parameter location_email should be ['super-user@adp-test.com'], got ${parameters.location_email} instead.`)
          .toEqual(['super-user@adp-test.com']);

        expect(parameters.location_signum)
          .withContext(`Parameter location_signum should be ['esupuse'], got ${parameters.location_signum} instead.`)
          .toEqual(['esupuse']);

        expect(parameters.comment_text)
          .withContext('Parameter comment_text should be defined.')
          .toBeDefined();

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::D001]] ERROR :: ', ERROR);
        done.fail();
      });
  });

  it('[[COMMENT::MSDOCUMENTATION::D002]] Should read comment from Microservice Mock Document page, Etesase user', async (done) => {
    const locationID = 'msdocumentation_17e57f6cea1b5a673f8775e6cf023344_1.0.0-dpi-default-document';
    await portal.login(login.optionsTestUserEtesase);
    await portal.getComments(locationID)
      .then((GOT) => {
        if (!GOT) {
          expect(GOT)
            .withContext('Unexpected answer from server!')
            .toBeDefined();
          done.fail();
          return;
        }

        const body = GOT
          && GOT.body
          ? GOT.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 200, got ${body.code} instead.`)
          .toEqual(200);

        const comment = GOT
          && GOT.body
          && Array.isArray(GOT.body.docs)
          && GOT.body.docs[0]
          ? GOT.body.docs[0]
          : null;

        transferDataToTheNextTest = { _id: comment._id };

        expect(comment._id)
          .withContext('Comment unique id should be defined.')
          .toBeDefined();

        expect(comment.location_id)
          .withContext(`Comment location_id should be '${locationID}', got ${comment.location_id} instead.`)
          .toEqual(`${locationID}`);

        expect(comment.location_title)
          .withContext(`Comment location_title should be 'ms title', got ${comment.location_title} instead.`)
          .toEqual('ms title');

        expect(comment.location_page)
          .withContext(`Comment location_page should be 'h3-title', got ${comment.location_page} instead.`)
          .toEqual('h3-title');

        expect(comment.location_author)
          .withContext(`Comment location_author should be ['Super User'], got ${comment.location_author} instead.`)
          .toEqual(['Super User']);

        expect(comment.location_email)
          .withContext(`Comment location_email should be ['super-user@adp-test.com'], got ${comment.location_email} instead.`)
          .toEqual(['super-user@adp-test.com']);

        expect(comment.location_signum)
          .withContext(`Comment location_signum should be ['esupuse'], got ${comment.location_signum} instead.`)
          .toEqual(['esupuse']);

        expect(comment.signum)
          .withContext(`Comment signum should be 'etesase', got ${comment.signum} instead.`)
          .toEqual('etesase');

        expect(comment.desc_comment)
          .withContext('Parameter desc_comment should be defined.')
          .toBeDefined();

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::D002]] ERROR :: ', ERROR);
        done.fail();
      });
  });

  it('[[COMMENT::MSDOCUMENTATION::D003]] Should be able to read comment from Microservice Mock Document page, Etesuse user', async (done) => {
    const locationID = 'msdocumentation_17e57f6cea1b5a673f8775e6cf023344_1.0.0-dpi-default-document';
    await portal.login(login.optionsTest);
    await portal.getComments(locationID)
      .then((GOT) => {
        if (!GOT) {
          expect(GOT)
            .withContext('Unexpected answer from server!')
            .toBeDefined();
          done.fail();
          return;
        }

        const body = GOT
          && GOT.body
          ? GOT.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 200, got ${body.code} instead.`)
          .toEqual(200);

        const comment = GOT
          && GOT.body
          && Array.isArray(GOT.body.docs)
          && GOT.body.docs[0]
          ? GOT.body.docs[0]
          : null;

        transferDataToTheNextTest1 = { _id: comment._id };

        expect(comment._id)
          .withContext('Comment unique id should be defined.')
          .toBeDefined();

        expect(comment.location_id)
          .withContext(`Comment location_id should be '${locationID}', got ${comment.location_id} instead.`)
          .toEqual(`${locationID}`);

        expect(comment.location_page)
          .withContext(`Comment location_page should be 'h3-title', got ${comment.location_page} instead.`)
          .toEqual('h3-title');

        expect(comment.location_author)
          .withContext(`Comment location_author should be ['Super User'], got ${comment.location_author} instead.`)
          .toEqual(['Super User']);

        expect(comment.location_email)
          .withContext(`Comment location_email should be ['super-user@adp-test.com'], got ${comment.location_email} instead.`)
          .toEqual(['super-user@adp-test.com']);

        expect(comment.location_signum)
          .withContext(`Comment location_signum should be ['esupuse'], got ${comment.location_signum} instead.`)
          .toEqual(['esupuse']);

        expect(comment.signum)
          .withContext(`Comment signum should be 'etesase', got ${comment.signum} instead.`)
          .toEqual('etesase');

        expect(comment.desc_comment)
          .withContext('Parameter desc_comment should be defined.')
          .toBeDefined();

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::D003]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::D004]] Should not be able to update a specific comment from Microservice Mock Document page created, Etesuse user', async (done) => {
    await portal.login();
    await portal.putComment(transferDataToTheNextTest1._id, 'Updated Text')
      .then((PUT) => {
        const body = PUT
          && PUT.body
          ? PUT.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 403, got ${body.code} instead.`)
          .toEqual(403);
        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::D004]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::D005]] Should not be able to delete a specific comment', async (done) => {
    await portal.login();
    await portal.deleteComment(`${transferDataToTheNextTest1._id}`)
      .then((DELETED) => {
        const body = DELETED
        && DELETED.body
          ? DELETED.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 403, got ${body.code} instead.`)
          .toEqual(403);
        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::D005]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::D006]] Should read comment from Microservice Mock Document page to check if it was not deleted, Etesase user', async (done) => {
    const locationID = 'msdocumentation_17e57f6cea1b5a673f8775e6cf023344_1.0.0-dpi-default-document';
    await portal.login(login.optionsTestUserEtesase);
    await portal.getComments(locationID)
      .then((GOT) => {
        if (!GOT) {
          expect(GOT)
            .withContext('Unexpected answer from server!')
            .toBeDefined();
          done.fail();
          return;
        }

        const body = GOT
          && GOT.body
          ? GOT.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 200, got ${body.code} instead.`)
          .toEqual(200);

        const comment = GOT
          && GOT.body
          && Array.isArray(GOT.body.docs)
          && GOT.body.docs[0]
          ? GOT.body.docs[0]
          : null;

        transferDataToTheNextTest = { _id: comment._id };

        expect(comment._id)
          .withContext('Comment unique id should be defined.')
          .toBeDefined();

        expect(comment.location_id)
          .withContext(`Comment location_id should be '${locationID}', got ${comment.location_id} instead.`)
          .toEqual(`${locationID}`);

        expect(comment.location_page)
          .withContext(`Comment location_page should be 'h3-title', got ${comment.location_page} instead.`)
          .toEqual('h3-title');

        expect(comment.location_author)
          .withContext(`Comment location_author should be ['Super User'], got ${comment.location_author} instead.`)
          .toEqual(['Super User']);

        expect(comment.location_email)
          .withContext(`Comment location_email should be ['super-user@adp-test.com'], got ${comment.location_email} instead.`)
          .toEqual(['super-user@adp-test.com']);

        expect(comment.location_signum)
          .withContext(`Comment location_signum should be ['esupuse'], got ${comment.location_signum} instead.`)
          .toEqual(['esupuse']);

        expect(comment.signum)
          .withContext(`Comment signum should be 'etesase', got ${comment.signum} instead.`)
          .toEqual('etesase');

        expect(comment.desc_comment)
          .withContext('Parameter desc_comment should be defined.')
          .toBeDefined();

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::D006]] ERROR :: ', ERROR);
        done.fail();
      });
  });

  it('[[COMMENT::MSDOCUMENTATION::D007]] Should delete a specific comment', async (done) => {
    await portal.login(login.optionsTestUserEtesase);
    await portal.deleteComment(`${transferDataToTheNextTest._id}`)
      .then((DELETED) => {
        const body = DELETED
        && DELETED.body
          ? DELETED.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 200, got ${body.code} instead.`)
          .toEqual(200);

        expect(body.message)
          .withContext(`Server message should be 'Comment successful deleted', got ${body.message} instead.`)
          .toEqual('Comment successful deleted');

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::D007]] ERROR :: ', ERROR);
        done.fail();
      });
  });
});

describe('[[COMMENT::MSDOCUMENTATION::E---]] Basic tests for Comments for different users( Sequential Tests )', () => {
  beforeAll(async (done) => {
    originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    done();
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

  it('Preparing [[COMMENT::MSDOCUMENTATION::E---]]...', async (done) => {
    await apiTools.waitFor(1);
    done();
  });

  it('[[COMMENT::MSDOCUMENTATION::E001]] Should not be able to create a comment in Microservice Mock Document page for Etesase user, who does not have access to microservice', async (done) => {
    const locationID = 'msdocumentation_45e7f4f992afe7bbb62a3391e5011ff8_1.0.0-dpi-default-document';
    await portal.login(login.optionsTestUserEtarase);
    await portal.postComment(locationID, 'ms title', 'h3-title', ['Super User'], ['super-user@adp-test.com'], ['esupuse'], 'Text for Comment made by Etesase')
      .then((POSTED) => {
        if (!POSTED) {
          expect(POSTED)
            .withContext('Unexpected answer from server!')
            .toBeDefined();
          done.fail();
          return;
        }

        const body = POSTED
          && POSTED.body
          ? POSTED.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 404, got ${body.code} instead.`)
          .toEqual(404);
        // it is 404 instead of 403  becouse this will require extra access to database

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::E001]] ERROR :: ', ERROR);
        done.fail();
      });
  });

  it('[[COMMENT::MSDOCUMENTATION::E002]] Should create a comment in Microservice Overview page for Etesuse user', async (done) => {
    const locationID = 'msdocumentation_45e7f4f992afe7bbb62a3391e5011ff8_1.0.0-dpi-default-document';
    await portal.login(login.optionsTest);
    await portal.postComment(locationID, 'ms title', 'h3-title', ['Super User'], ['super-user@adp-test.com'], ['esupuse'], 'Text for Comment made by Etesuse')
      .then((POSTED) => {
        if (!POSTED) {
          expect(POSTED)
            .withContext('Unexpected answer from server!')
            .toBeDefined();
          done.fail();
          return;
        }

        const body = POSTED
          && POSTED.body
          ? POSTED.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 200, got ${body.code} instead. ${body}`)
          .toEqual(200);
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::E002]] ERROR :: ', ERROR);
        done.fail();
      });

    await portal.getComments(locationID)
      .then((GOT) => {
        if (!GOT) {
          expect(GOT)
            .withContext('Unexpected answer from server!')
            .toBeDefined();
          done.fail();
          return;
        }

        const body = GOT
          && GOT.body
          ? GOT.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 200, got ${body.code} instead. ${body}`)
          .toEqual(200);

        const comment = GOT
          && GOT.body
          && Array.isArray(GOT.body.docs)
          && GOT.body.docs[0]
          ? GOT.body.docs[0]
          : null;

        transferDataToTheNextTest2 = { _id: comment._id };

        expect(comment._id)
          .withContext('Comment unique id should be defined.')
          .toBeDefined();
        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::E002]] ERROR :: ', ERROR);
        done.fail();
      });
  });

  it('[[COMMENT::MSDOCUMENTATION::E003]] Should not be able to update a specific comment from Microservice Overview page created, Etarase user', async (done) => {
    await portal.login(login.optionsTestUserEtarase);
    await portal.putComment(transferDataToTheNextTest2._id, 'Updated Text')
      .then((PUT) => {
        const body = PUT
          && PUT.body
          ? PUT.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 403, got ${body.code} instead. ${body}`)
          .toEqual(404);
        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::E003]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::MSDOCUMENTATION::E004]] Should not be able to delete a specific comment', async (done) => {
    await portal.login(login.optionsTestUserEtarase);
    await portal.deleteComment(`${transferDataToTheNextTest2._id}`)
      .then((DELETED) => {
        const body = DELETED
        && DELETED.body
          ? DELETED.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 403, got ${body.code} instead. ${body}`)
          .toEqual(404);
        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::MSDOCUMENTATION::E004]] ERROR :: ', ERROR);
        done.fail();
      });
  });
});
