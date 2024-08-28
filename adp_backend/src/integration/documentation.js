// ============================================================================================= //
/**
* [ global.adp.integration.documentation ]
* @author John Dolan [xjohdol]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = async VERSION => new Promise(async (RESOLVE, REJECT) => {
  const configWithDefaultTheme = global.raml2html.getConfigForTheme();
  global.raml2html.render(global.path.join(__dirname, `documentation-${VERSION}.raml`), configWithDefaultTheme).then((result) => {
    RESOLVE(result);
  }, (error) => {
    REJECT(error);
  });
});
// ============================================================================================= //
