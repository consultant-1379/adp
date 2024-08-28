// ============================================================================================= //
/**
* [ global.adp.document.extractPath ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (DOC) => {
  const query = DOC.split('?')[1];
  const params = (typeof query !== 'undefined' ? query.split(';') : []);

  const project = params.filter(p => p.indexOf('p=') >= 0)[0];
  const filename = params.filter(f => f.indexOf('f=') >= 0)[0];
  const diffCommitIdWithHbParam = params.filter(hb => hb.indexOf('hb=') >= 0)[0];
  let gerritBranchCommitPath = '/branches/master';

  const fileparts = filename.split('/').join('%2f');
  const projectparts = project.split('/').join('%2f');

  const gitProject = projectparts.substring(2, projectparts.length - 4);
  const gitFile = fileparts.substring(2, fileparts.length);

  if (typeof diffCommitIdWithHbParam === 'string' && diffCommitIdWithHbParam.trim() !== '') {
    const commitId = diffCommitIdWithHbParam.trim().substring(3);
    if (commitId.match(/(master)|(HEAD)/gm) === null) {
      gerritBranchCommitPath = `/commits/${commitId}`;
    }
  }
  return `https://gerrit-gamma.gic.ericsson.se/a/projects/${gitProject}${gerritBranchCommitPath}/files/${gitFile}/content`;
};

// ============================================================================================= //
// ============================================================================================= //
