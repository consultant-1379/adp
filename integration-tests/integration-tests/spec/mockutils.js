class MockResponseBuilder {
  constructor() {
    this.duration = { times: { unlimited: true } };
  }

  matchPostRequest(path, bodyMatch, queryParameters) {
    this.matcher = {
      httpRequest: {
        method: 'POST',
        path,
      },
    };
    if (bodyMatch) {
      this.matcher.httpRequest.body = bodyMatch;
    }
    if (queryParameters) {
      this.matcher.httpRequest.queryStringParameters = queryParameters;
    }
    return this;
  }

  matchGetRequest(path, queryParameters) {
    this.matcher = {
      httpRequest: {
        method: 'GET',
        path,
      },
    };

    if (queryParameters) {
      this.matcher.httpRequest.queryStringParameters = queryParameters;
    }
    return this;
  }

  expectResponse(code, body) {
    this.response = {
      httpResponse: {
        statusCode: code,
        body: JSON.stringify(body),
      },
    };
    return this;
  }

  expectRawResponse(code, body) {
    this.response = {
      httpResponse: {
        statusCode: code,
        body,
      },
    };
    return this;
  }

  create() {
    return { ...this.matcher, ...this.response, ...this.duration };
  }
}

function jsonMatch(jsonObject) {
  return {
    type: 'JSON',
    json: jsonObject,
    matchType: 'ONLY_MATCHING_FIELDS',
  };
}

function GroupMeta(displayName, nickname, email) {
  return {
    email,
    objectCategory: 'CN=Group,CN=Schema,CN=Configuration,DC=ericsson,DC=se',
    mailNickname: nickname,
    displayName,
  };
}

module.exports = { MockResponseBuilder, jsonMatch, GroupMeta };
