var ldap = require('ldapjs');
var ericsson = "ecd.ericsson.se:389";
var mock = "131.160.143.86:38900";


// var base="o=ericsson"
 //var username = "ejohdol"
 //var userpass = "apassword"
// var adminDn = 'uid=eadpusers,ou=Users,ou=Internal,o=ericsson'
// var adminCred = '#sPGDD1#fTzC8JHg'
// var server = ericsson

 var base = "dc=example,dc=org"
 var username = "etesuse"
 var userpass = "test-password1"
 var adminDn = "cn=admin,dc=example,dc=org"
 var adminCred = "admin"
 
 var server = mock

var filt = `(&(objectClass=*)(cn=${username}))`

var client = ldap.createClient({
  url: 'ldap://'+server,
  timeout: "8000"
});

callback = function(err, items){
 console.log(items);
 if(items && items.length) {
  userDn = items[0].dn;
  client.bind(userDn,userpass, function(err){
   console.log(err)
   if(!err){
   console.log(username + " logged in");
   }
  });
 }
}
client.bind(adminDn, adminCred, function(err) {
 if(err){
 console.log(err);
 }
 console.log("ok");
 opts={
  filter:filt,
  scope:"sub"
 }
 client.search(base, opts, function(erro, searchResult){
   console.log(erro);
   var items = [];
      searchResult.on('searchEntry', function(entry) {
        items.push(entry.object);
      });

      searchResult.on('error', callback);

      searchResult.on('end', function(result) {
        if (result.status !== 0) {
          var err = 'non-zero status from LDAP search: ' + result.status;
          return callback(err);
        }
        return callback(null, items);
      });
 });
});
