window.onload = function(){
  // http://stackoverflow.com/questions/27624935/extract-rsa-private-key-from-cryptico-js
  (function(c){
      var parametersBigint = ["n", "d", "p", "q", "dmp1", "dmq1", "coeff"];

      c.serializeRSAKey = function(rsakey) {
          var keyObj = {};
          parametersBigint.forEach(function(parameter){
              keyObj[parameter] = c.b16to64(rsakey[parameter].toString(16));
          });
          // e is 3 implicitly
          return JSON.stringify(keyObj);
      }
      c.deserializeRSAKey = function(string) {
          var keyObj = JSON.parse(string);
          var rsa = new RSAKey();
          parametersBigint.forEach(function(parameter){
              rsa[parameter] = parseBigInt(c.b64to16(keyObj[parameter].split("|")[0]), 16);
          });
          rsa.e = parseInt("03", 16);
          return rsa
      }
  })(cryptico);

  var passphrase = '';
  // private key is an object
  var privateKey;
  // public key is a string
  var publicKey;


  var start = function(){
    // sign the test message
    var result = cryptico.sign("test", privateKey);

    var value = cryptico.decript()
    console.log(result);
  };

























  // preparing and key generation
  var saveKeyPair = function(privateKey, publicKey){
    localforage.setItem('keyPair', {
      privateKey: cryptico.serializeRSAKey(privateKey),
      publicKey: publicKey
    });
  };

  var generateKeyPair = function(passphrase){
    passphrase = passphrase || '';
    privateKey = cryptico.generateRSAKey(passphrase, 1024);
    publicKey = cryptico.publicKeyString(privateKey);

    saveKeyPair(privateKey, publicKey);

    return {
      privateKey: privateKey,
      publicKey: publicKey
    }
  };

  localforage.getItem('keyPair').then(function(value){
    // not sure why the value is null
    if(value){
      console.log('load key pair');
      privateKey = cryptico.deserializeRSAKey(value.privateKey);
      publicKey = value.publicKey;

      console.log(privateKey);
      console.log(publicKey);
    }
    else{
      console.log('new key pair');
      var keyPair = generateKeyPair();

      console.log(privateKey);
      console.log(publicKey);
    }

  }, function(error){
    console.log('new key pair');
    var keyPair = generateKeyPair();

    console.log(privateKey);
    console.log(publicKey);
  }).then(start);
};