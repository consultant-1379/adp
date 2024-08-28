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


describe('[[COMMENT::TUTORIAL::A---]] Basic tests for Comments ( Sequential Tests )', () => {
  beforeAll(async (done) => {
    originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    await portal.login();
    done();
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

  it('Preparing [[COMMENT::TUTORIAL::A---]]...', async (done) => {
    await apiTools.waitFor(1);
    done();
  });

  it('[[COMMENT::TUTORIAL::A001]] Should create a comment in Wordpress Tutorial', async (done) => {
    const locationID = 'tutorial_8971';
    await portal.postComment(locationID, 'tutorial title', 'h1-title', ['Super User'], ['super-user@adp-test.com'], ['esupuse'], 'Comment Text')
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
          .withContext(`Parameter location_title should be 'tutorial title', got ${parameters.location_title} instead.`)
          .toEqual('tutorial title');

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
        console.log('[[COMMENT::TUTORIAL::A001]] ERROR :: ', ERROR);
        done.fail();
      });
  });

  it('[[COMMENT::TUTORIAL::A002]] Should read comment from Wordpress Tutorial', async (done) => {
    const locationID = 'tutorial_8971';
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
          .withContext(`Comment location_title should be 'tutorial title', got ${comment.location_title} instead.`)
          .toEqual('tutorial title');

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
        console.log('[[COMMENT::TUTORIAL::A002]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::A003]] Should update a specific comment from Wordpress Tutorial', async (done) => {
    if (!transferDataToTheNextTest || !transferDataToTheNextTest._id) {
      console.log('The test [[COMMENT::TUTORIAL::A003]] can`t run without the tests [[COMMENT::TUTORIAL::A001]] and [[COMMENT::TUTORIAL::A002]].');
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
        console.log('[[COMMENT::TUTORIAL::A003]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::A004]] Should read the previous comment to check the last update', async (done) => {
    if (!transferDataToTheNextTest || !transferDataToTheNextTest._id) {
      console.log('The test [[COMMENT::TUTORIAL::A004]] can`t run without the tests [[COMMENT::TUTORIAL::A001]], [[COMMENT::TUTORIAL::A002]] and [[COMMENT::TUTORIAL::A003]].');
      done.fail();
      return;
    }
    const locationID = 'tutorial_8971';
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
        console.log('[[COMMENT::TUTORIAL::A004]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::A005]] Should resolve a specific comment from Wordpress Tutorial', async (done) => {
    if (!transferDataToTheNextTest || !transferDataToTheNextTest._id) {
      console.log('The test [[COMMENT::TUTORIAL::A005]] can`t run without the tests [[COMMENT::TUTORIAL::A001]] and [[COMMENT::TUTORIAL::A002]].');
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
        console.log('[[COMMENT::TUTORIAL::A005]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::A006]] Should read the previous comment to check the last resolve', async (done) => {
    if (!transferDataToTheNextTest || !transferDataToTheNextTest._id) {
      console.log('The test [[COMMENT::TUTORIAL::A006]] can`t run without the tests [[COMMENT::TUTORIAL::A001]], [[COMMENT::TUTORIAL::A002]] and [[COMMENT::TUTORIAL::A005]].');
      done.fail();
      return;
    }
    const locationID = 'tutorial_8971';
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
        console.log('[[COMMENT::TUTORIAL::A006]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::A007]] Should delete a specific comment', async (done) => {
    if (!transferDataToTheNextTest || !transferDataToTheNextTest._id) {
      console.log('The test [[COMMENT::TUTORIAL::A007]] can`t run without the tests [[COMMENT::TUTORIAL::A001]], [[COMMENT::TUTORIAL::A002]], [[COMMENT::TUTORIAL::A003]] and [[COMMENT::TUTORIAL::A004]].');
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
        console.log('[[COMMENT::TUTORIAL::A007]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::A008]] Should read the previous comment to check if it was deleted', async (done) => {
    if (!transferDataToTheNextTest || !transferDataToTheNextTest._id) {
      console.log('The test [[COMMENT::TUTORIAL::A008]] can`t run without the tests [[COMMENT::TUTORIAL::A001]], [[COMMENT::TUTORIAL::A002]], [[COMMENT::TUTORIAL::A003]], [[COMMENT::TUTORIAL::A004]] and [[COMMENT::TUTORIAL::A007]].');
      done.fail();
      return;
    }
    const locationID = 'tutorial_8971';
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
        console.log('[[COMMENT::TUTORIAL::A008]] ERROR :: ', ERROR);
        done.fail();
      });
  });
});

describe('[[COMMENT::TUTORIAL::B---]] Negative tests for Comments', () => {
  beforeAll(async (done) => {
    originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    await portal.login();
    done();
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

  it('Preparing [[COMMENT::TUTORIAL::B---]]...', async (done) => {
    await apiTools.waitFor(1);
    done();
  });

  it('[[COMMENT::TUTORIAL::B001]] Should fail when trying to create a comment with no parameters at all', async (done) => {
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
        console.log('[[COMMENT::TUTORIAL::B001]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::B002]] Should fail when trying to create a comment missing the "comment" parameter', async (done) => {
    const locationID = 'tutorial_8971';
    await portal.postComment(locationID, 'tutorial title', 'h1-title')
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
        console.log('[[COMMENT::TUTORIAL::B002]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::B003]] Should fail when trying to create a comment with "locationPage" parameter set as null', async (done) => {
    const locationID = 'tutorial_8971';
    await portal.postComment(locationID, 'tutorial title', null, 'Comment Text')
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
        console.log('[[COMMENT::TUTORIAL::B003]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::B004]] Should fail when trying to create a comment with "locationId" parameter set as null', async (done) => {
    await portal.postComment(null, 'tutorial title', 'h1-title', 'Comment Text')
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
        console.log('[[COMMENT::TUTORIAL::B004]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::B005]] Should fail when trying to create a comment with invalid Wordpress Tutorial id in "locationId" parameter', async (done) => {
    const locationID = 'tutorial_AAAA';
    await portal.postComment(locationID, 'tutorial title', 'h1-title', 'Comment Text')
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
        console.log('[[COMMENT::TUTORIAL::B005]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::B006]] Should fail when trying to create a comment without the type "tutorial" defined in "locationId" parameter', async (done) => {
    const locationID = '8971';
    await portal.postComment(locationID, 'tutorial title', 'h1-title', 'Comment Text')
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
        console.log('[[COMMENT::TUTORIAL::B006]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::B007]] Should fail trying to read if parameter is undefined', async (done) => {
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
        console.log('[[COMMENT::TUTORIAL::B007]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::B008]] Should fail trying to read if Wordpress Tutorial id is invalid', async (done) => {
    const locationID = 'tutorial_AAAA';
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
        console.log('[[COMMENT::TUTORIAL::B008]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::B009]] Should fail trying to read if type is invalid in locationId', async (done) => {
    const locationID = 'tutorials_8971';
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
        console.log('[[COMMENT::TUTORIAL::B009]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::B010]] Should fail to update if got no parameters', async (done) => {
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
        console.log('[[COMMENT::TUTORIAL::B010]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::B011]] Should fail to update if got no text', async (done) => {
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
        console.log('[[COMMENT::TUTORIAL::B011]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::B012]] Should fail to resolve if got no parameters', async (done) => {
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
        console.log('[[COMMENT::TUTORIAL::B012]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::B013]] Should fail to resolve if got no text', async (done) => {
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
        console.log('[[COMMENT::TUTORIAL::B013]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::B014]] Should not be able to delete a comment without parameters', async (done) => {
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
        console.log('[[COMMENT::TUTORIAL::B014]] ERROR :: ', ERROR);
        done.fail();
      });
  });
});


describe('[[COMMENT::TUTORIAL::D---]] Basic tests for Comments for different users( Sequential Tests )', () => {
  beforeAll(async (done) => {
    originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    done();
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

  it('Preparing [[COMMENT::TUTORIAL::D---]]...', async (done) => {
    await apiTools.waitFor(1);
    done();
  });

  it('[[COMMENT::TUTORIAL::D001]] Should create a comment in Wordpress Tutorial for etesuse user', async (done) => {
    const locationID = 'tutorial_9195';
    await portal.login(login.optionsTest);
    await portal.postComment(locationID, 'tutorial title', 'h3-title', ['Super User'], ['super-user@adp-test.com'], ['esupuse'], 'Text for Comment made by etesuse')
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
          .withContext(`Parameter location_title should be 'tutorial title', got ${parameters.location_title} instead.`)
          .toEqual('tutorial title');

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
        console.log('[[COMMENT::TUTORIAL::D001]] ERROR :: ', ERROR);
        done.fail();
      });
  });

  it('[[COMMENT::TUTORIAL::D002]] Should read comment from Wordpress Tutorial, etesuse user', async (done) => {
    const locationID = 'tutorial_9195';
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

        transferDataToTheNextTest = { _id: comment._id };

        expect(comment._id)
          .withContext('Comment unique id should be defined.')
          .toBeDefined();

        expect(comment.location_id)
          .withContext(`Comment location_id should be '${locationID}', got ${comment.location_id} instead.`)
          .toEqual(`${locationID}`);

        expect(comment.location_title)
          .withContext(`Comment location_title should be 'tutorial title', got ${comment.location_title} instead.`)
          .toEqual('tutorial title');

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
          .withContext(`Comment signum should be 'etesuse', got ${comment.signum} instead.`)
          .toEqual('etesuse');

        expect(comment.desc_comment)
          .withContext('Parameter desc_comment should be defined.')
          .toBeDefined();

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::TUTORIAL::D002]] ERROR :: ', ERROR);
        done.fail();
      });
  });

  it('[[COMMENT::TUTORIAL::D003]] Should be able to read comment from Wordpress Tutorial, etesuse user', async (done) => {
    const locationID = 'tutorial_9195';
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
          .withContext(`Comment signum should be 'etesuse', got ${comment.signum} instead.`)
          .toEqual('etesuse');

        expect(comment.desc_comment)
          .withContext('Parameter desc_comment should be defined.')
          .toBeDefined();

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::TUTORIAL::D003]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::D004]] Should not be able to update a specific comment from Wordpress Tutorial created, esupuse trying to update comment from etesuse user', async (done) => {
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
        console.log('[[COMMENT::TUTORIAL::D004]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::D005]] Should not be able to delete a specific comment', async (done) => {
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
        console.log('[[COMMENT::TUTORIAL::D005]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::D006]] Should read comment from Wordpress Tutorial to check if it was not deleted, etesuse user', async (done) => {
    const locationID = 'tutorial_9195';
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
          .withContext(`Comment signum should be 'etesuse', got ${comment.signum} instead.`)
          .toEqual('etesuse');

        expect(comment.desc_comment)
          .withContext('Parameter desc_comment should be defined.')
          .toBeDefined();

        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::TUTORIAL::D006]] ERROR :: ', ERROR);
        done.fail();
      });
  });

  it('[[COMMENT::TUTORIAL::D007]] Should delete a specific comment', async (done) => {
    await portal.login(login.optionsTest);
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
        console.log('[[COMMENT::TUTORIAL::D007]] ERROR :: ', ERROR);
        done.fail();
      });
  });
});

describe('[[COMMENT::TUTORIAL::E---]] Basic tests for Comments for different users( Sequential Tests )', () => {
  beforeAll(async (done) => {
    originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    done();
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

  it('Preparing [[COMMENT::TUTORIAL::E---]]...', async (done) => {
    await apiTools.waitFor(1);
    done();
  });

  it('[[COMMENT::TUTORIAL::E001]] Should not be able to create a comment in Wordpress Tutorial for Etesase user, who does not have access to Tutorial', async (done) => {
    const locationID = 'tutorial_9195';
    await portal.login(login.optionsTestUserEtarase);
    await portal.postComment(locationID, 'tutorial title', 'h3-title', ['Super User'], ['super-user@adp-test.com'], ['esupuse'], 'Text for Comment made by Etesase')
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
        console.log('[[COMMENT::TUTORIAL::E001]] ERROR :: ', ERROR);
        done.fail();
      });
  });

  it('[[COMMENT::TUTORIAL::E002]] Should create a comment in Wordpress Tutorial for Etesuse user', async (done) => {
    const locationID = 'tutorial_9195';
    await portal.login(login.optionsTest);
    await portal.postComment(locationID, 'tutorial title', 'h3-title', ['Super User'], ['super-user@adp-test.com'], ['esupuse'], 'Text for Comment made by Etesuse')
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
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::TUTORIAL::E002]] ERROR :: ', ERROR);
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
          .withContext(`Server Status Code should be 200, got ${body.code} instead.`)
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
        console.log('[[COMMENT::TUTORIAL::E002]] ERROR :: ', ERROR);
        done.fail();
      });
  });

  it('[[COMMENT::TUTORIAL::E003]] Should not be able to update a specific comment from Wordpress Tutorial created, Etarase user', async (done) => {
    await portal.login(login.optionsTestUserEtarase);
    await portal.putComment(transferDataToTheNextTest2._id, 'Updated Text')
      .then((PUT) => {
        const body = PUT
          && PUT.body
          ? PUT.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 403, got ${body.code} instead.`)
          .toEqual(404);
        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::TUTORIAL::E003]] ERROR :: ', ERROR);
        done.fail();
      });
  });


  it('[[COMMENT::TUTORIAL::E004]] Should not be able to delete a specific comment', async (done) => {
    await portal.login(login.optionsTestUserEtarase);
    await portal.deleteComment(`${transferDataToTheNextTest2._id}`)
      .then((DELETED) => {
        const body = DELETED
        && DELETED.body
          ? DELETED.body
          : null;

        expect(body.code)
          .withContext(`Server Status Code should be 403, got ${body.code} instead.`)
          .toEqual(404);
        done();
      })
      .catch((ERROR) => {
        console.log('[[COMMENT::TUTORIAL::E004]] ERROR :: ', ERROR);
        done.fail();
      });
  });
});
