window.onload = function(){
  var post = inclusive.post;

  var rsa = forge.pki.rsa;
  var pki = forge.pki;

  var passphrase = 'password';
  var privateKey;
  var publicKey;
  var privateKeyPem;
  var publicKeyPem;


  var saveKeyPair = function(privateKey, publicKey)
  {
    privateKeyPem = pki.encryptRsaPrivateKey(privateKey, passphrase);
    publicKeyPem = pki.publicKeyToPem(publicKey);

    localforage.setItem('keyPair', {
      privateKeyPem: privateKeyPem,
      publicKeyPem: publicKeyPem,
      passphrase: passphrase
    });
  };

  var generateKeyPair = function(){
    console.log('new key pair');

    var keypair = rsa.generateKeyPair({bits: 1024, e: 0x10001});
    privateKey = keypair.privateKey;
    publicKey = keypair.publicKey;

    console.log(privateKey);
    console.log(publicKey);

    saveKeyPair(privateKey, publicKey);
  };

  var loadKeyPair = function()
  {
    return localforage.getItem('keyPair').then(function(value){
      // not sure why the value is null
      if(value){
        console.log('load key pair');
        privateKey = pki.decryptRsaPrivateKey(value.privateKeyPem, value.passphrase);
        publicKey = pki.publicKeyFromPem(value.publicKeyPem);

        publicKeyPem = value.publicKeyPem;

        console.log(privateKey);
        console.log(publicKey);
      }
      else{
        generateKeyPair();
      }

    }, function(error){
      generateKeyPair();
    });
  };

  loadKeyPair().then(function(){
    var input = document.createElement("input");
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', 'private-key-pem');
    input.setAttribute('value', privateKeyPem);
  });

  var submitButton = document.getElementById('submit-button');
  submitButton.onclick = function(){
    // post('/users', {
    //   name: document.getElementById('name').value,
    //   publicKeyPem: publicKeyPem
    // }, {'Content-Type': 'application/json; charset=UTF-8'});

    // inclusive.post('api/users', {
    //   name: document.getElementById('name').value,
    //   publicKeyPem: publicKeyPem
    // });
  };

};