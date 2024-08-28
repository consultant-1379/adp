// ============================================================================================= //
/**
* [ global.adp.access.setupPassport ]
* Just a configuration file to start the <b>Passport Node JS Library</b>.<br/>
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => {
  const LdapStrategyOBJ = new global.passportLdap.Strategy({
    server: global.adp.config.ldap,
  });

  const JWTStrategy = new global.passportJWT.Strategy({
    jwtFromRequest: global.passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: global.adp.config.jwt.secret,
  }, global.JWTStrategyHandler);

  const JWTIntegrationStrategy = new global.passportJWT.Strategy({
    jwtFromRequest: global.passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: global.adp.config.jwtIntegration.secret,
  }, global.JWTIntegrationStrategyHandler);

  global.passport.use(LdapStrategyOBJ);
  global.passport.use(JWTStrategy);
  global.passport.use('jwt-integration', JWTIntegrationStrategy);
};
// ============================================================================================= //
