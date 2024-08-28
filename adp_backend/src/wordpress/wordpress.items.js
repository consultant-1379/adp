/**
 * Set of wordpress endpoint collections.
 * This will be used to call wordpress endpoint
 * For example, to call POSTS endpoint, actual url string
 * will contain 'posts'.
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
module.exports = {
  BLOG: 'posts/:id',
  BLOGS: 'posts?per_page=50',
  NEWS: 'posts?categories=35&per_page=50',
  CATEGORY: 'posts?categories=:catid&per_page=100',
  CATEGORIES: 'categories?parent=:parent',
  CATEGORIES_ALL: 'categories?per_page=100',
  LIST_ALL_CATEGORIES_AND_CHILDREN: 'allcategories',
  CREATE_PAGE: 'pages',
  POSTS: 'posts',
  USERS: 'users?per_page=100',
  USER: 'users/:userid',
  AUTHOR: 'users?slug=:signum',
  DOC: 'pages?slug=:docname',
  PAGE: 'pages/:id',
  PAGE_STATUS: 'pages/:id?status=:status',
  TUTORIAL_PAGE: 'tutorialPageBySlug',
  PARENT_EXIDS: 'pages?parent=:pid:ids',
  DOC_PREVIEW: 'preview/:id',
  SEARCH: 'search/:keyword',
  SEARCHPOSTS: 'posts?per_page=100&search=:keyword',
  SAVEPOST: 'posts',
  MENUS: 'adp_portal_menu',
  MENU: 'menu',
  PAGECHECKPATH: 'fetchArticleValidatePath',
  TUTORIALCHECKPATH: 'fetchTutorialPageValidatePath',
  HIGHLIGHTS: 'highlightsMenuList',
};
