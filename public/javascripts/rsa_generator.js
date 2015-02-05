var post = inclusive.post;
var put = inclusive.put;

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
    data: 'JSON string of the whole user signed message content'
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

var saveCurrentUser = function(user){
  return localforage.setItem('currentUser', JSON.stringify(user));
}







var User = function(id, name, publicKey, privateKey, passphrase){
  this.name = name;
  this.passphrase = passphrase;
  this.id = id;
  this.privateKey = privateKey;
  this.publicKey = publicKey;

  /*
  data format:
  {
    messages: [{
        dataHex: 'AES hex string',
        key: 'RSA encrypted AES key',
        iv: 'RSA encrypted AES iv'
    }],
    signature: ....
  }
   */
  this.data = Object.create(null);
};
var p = User.prototype = Object.create(User.prototype);

User.create = function(name, passphrase){
  var keypair = rsa.generateKeyPair({bits: 1024, e: 0x10001});
  var privateKey = keypair.privateKey;
  var publicKey = keypair.publicKey;

  return post('/api/users', {
    name: name,
    publicKeyPem: pki.publicKeyToPem(publicKey)
  }).then(function(data){
    User.currentUser = new User(JSON.parse(data)._id, name, publicKey, privateKey, passphrase);
    return User.currentUser.save();
  });
};

User.init = function(){
  var user = new User();
  User.currentUser = user;
  return user.load();
};

p.load = function(){
  var onload = function(value){
    if(!value)
      return null;

    this.id = value.id;
    this.privateKey = pki.decryptRsaPrivateKey(value.privateKeyPem, value.passphrase);
    this.publicKey = pki.publicKeyFromPem(value.publicKeyPem);
    this.name = value.name;
    this.passphrase = value.passphrase;
    this.data = JSON.parse(value.data);
  };
  return localforage.getItem('currentUser').then(onload.bind(this));
};

p.save = function(){
  var data = {
    id: this.id,
    privateKeyPem: pki.encryptRsaPrivateKey(this.privateKey, this.passphrase),
    publicKeyPem: pki.publicKeyToPem(this.publicKey),
    name: this.name,
    passphrase: this.passphrase,
    data: JSON.stringify(this.data)
  };

  return localforage.setItem('currentUser', data);
};

p.push = function(){
  var data = {
    id: this.id,
    name: this.name,
    publicKeyPem: pki.publicKeyToPem(this.publicKey),
    data: this.data
  }

  return put('/api/users/'+this.id, data);
};

// TODO: change publicKeyPem to another user object
p.commit = function(content, publicKeyPem){
  // construct the encryption
  // create cipher for message
  var key = forge.random.getBytesSync(16);
  var iv = forge.random.getBytesSync(16);
  var cipher = forge.cipher.createCipher('AES-CBC', key);
  cipher.start({iv: iv});
  cipher.update(forge.util.createBuffer(content));
  cipher.finish();
  // do I need to turn it into hex? or just let JSON.stringify to encode bytes(probably won't work)?
  var dataHex = cipher.output.toHex();

  // encrypt key and iv,
  var keyHex = forge.util.bytesToHex(this.publicKey.encrypt(key));
  var ivHex = forge.util.bytesToHex(this.publicKey.encrypt(iv));
  var message = {
    data: dataHex,
    key: keyHex,
    iv: ivHex
  };

  // add the new message to the message array
  this.data.messages = this.data.messages ? this.data.messages : [];
  this.data.messages.push(message);

  // sign the new message content, update the old signature
  var md = forge.md.sha1.create();
  md.update(JSON.stringify(this.data.messages), 'utf8');
  this.data.signature = forge.util.bytesToHex(this.privateKey.sign(md));

  this.save();
};

User.init();