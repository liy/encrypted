var post = inclusive.post;

var rsa = forge.pki.rsa;
var pki = forge.pki;

var currentUser = null;

var saveKeyPair = function(privateKey, publicKey, user)
{
  var privateKeyPem = pki.encryptRsaPrivateKey(privateKey, user.passphrase);
  var publicKeyPem = pki.publicKeyToPem(publicKey);

  return localforage.setItem('keyPair', {
    privateKeyPem: privateKeyPem,
    publicKeyPem: publicKeyPem,
    name: user.name,
    passphrase: user.passphrase,
    data: ''
  });
};

var generateKeyPair = function(user){
  console.log('new key pair');

  var keypair = rsa.generateKeyPair({bits: 1024, e: 0x10001});
  var privateKey = keypair.privateKey;
  var publicKey = keypair.publicKey;

  console.log(privateKey);
  console.log(publicKey);

  return saveKeyPair(privateKey, publicKey, user);
};

// var loadKeyPair = function()
// {
//   return localforage.getItem('keyPair').then(function(value){
//     // not sure why the value is null
//     if(value){
//       console.log('load key pair');
//       privateKey = pki.decryptRsaPrivateKey(value.privateKeyPem, value.passphrase);
//       publicKey = pki.publicKeyFromPem(value.publicKeyPem);

//       publicKeyPem = value.publicKeyPem;

//       console.log(privateKey);
//       console.log(publicKey);
//     }
//     else{
//       generateKeyPair('password');
//     }

//   }, function(error){
//     generateKeyPair('password');
//   });
// };

var getKeyPair = function(){
  return localforage.getItem('keyPair').then(function(value){
    return {
      privateKey: pki.decryptRsaPrivateKey(value.privateKeyPem, value.passphrase),
      publicKey: pki.publicKeyFromPem(value.publicKeyPem)
    }
  })
};

var hasKeyPair = function(){
  return localforage.getItem('keyPair').then(function(value){
    if(value){
      return true;
    }
    else{
      return false;
    }
  }, function(){
    return false;
  });
}

var setupCurrentUser = function(){
  return localforage.getItem('userID').then(function(id){
    localforage.getItem('keyPair').then(function(value){
      currentUser = {
        id: id,
        privateKey: pki.decryptRsaPrivateKey(value.privateKeyPem, value.passphrase),
        publicKey: pki.publicKeyFromPem(value.publicKeyPem),
        name: value.name,
        passphrase: value.passphrase,
        data: value.data
      }
      return currentUser;
    })
  });
};