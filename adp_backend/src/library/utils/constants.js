/**
* [ adp.utils.constants ]
* Reusable constants can be declared here
* @return Object containing all the reusable constants
* @author Veerender Voskula [zvosvee]
*/
// User allowed roles
const ROLE = {
  ADMIN: 'admin',
  AUTHOR: 'author',
};

// RBAC Groups
const GROUPS = {
  DEFAULT_GROUP: 'Internal Users Group',
};

// Default Group ID for Internal Users Groups
const RBAC = {
  DEFAULT_GROUPID: '602e415e01f5f70007a0a950',
};

// HTTP Status code with user readable messages
const HTTP_STATUS = {
  400: 'User not found',
  401: 'Unauthorized',
  403: 'Forbidden: Insufficient privileges',
  404: 'Not Found',
  500: 'Internal Server Error',
  503: 'Service Unavailable',
};

// Utils for date related functionalities
const DATE_UTILS = {
  YYYY_MM_DD_REGEX: /^\d{4}-\d{2}-(0[1-9]|[12]\d|3[01])$/gi,
};

// Error Messages
const ERROR_MESSAGES = {
  ERROR_COMMENT_ID: 'comment_id is null/invalid',
  ERROR_LOCATION_ID: 'location_id is null/invalid',
  ERROR_LOCATION_TITLE: 'location_title is null/invalid',
  ERROR_LOCATION_PAGE: 'location_page is null/invalid',
  ERROR_LOCATION_AUTHOR: 'location_author is null/invalid',
  ERROR_LOCATION_EMAIL: 'location_email is null/invalid',
  ERROR_LOCATION_SIGNUM: 'location_signum is null/invalid',
  ERROR_COMMENT_TEXT: 'comment_text is null/invalid',
  ERROR_RESOLVE_TEXT: 'resolve_text is null/invalid',
};

// Utils for pvi constants values
const PVI = {
  DOC_NAME: 'Product Version Information (PVI)',
  DOC_SLUG: 'pvi',
};

// Utils for synchronization status
const SYNC_STATUS = {
  FAILED: 'Failed',
  IN_PROGRESS: 'In Progress',
  QUEUED: 'Queued',
  COMPLETED: 'Completed',
}

module.exports = {
  ROLE, GROUPS, HTTP_STATUS, DATE_UTILS, RBAC, PVI, ERROR_MESSAGES, SYNC_STATUS
};
