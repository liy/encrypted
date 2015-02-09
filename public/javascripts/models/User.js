var post = inclusive.post;
var put = inclusive.put;

var rsa = forge.pki.rsa;
var pki = forge.pki;


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
        data: 'AES hex string',
        key: 'RSA encrypted AES key, null if not encrypted',
        iv: 'RSA encrypted AES iv, null if not encrypted',
        to: 'hash of the recipient's public key, null if visible to all'
    }],
    signature: ....
  }
   */
  this.data = Object.create(null);
};
var p = User.prototype = Object.create(User.prototype);

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
  return localforage.setItem('currentUser', {
    id: this.id,
    privateKeyPem: pki.encryptRsaPrivateKey(this.privateKey, this.passphrase),
    publicKeyPem: pki.publicKeyToPem(this.publicKey),
    name: this.name,
    passphrase: this.passphrase,
    data: JSON.stringify(this.data)
  });
};

p.push = function(){
  var data = {
    id: this.id,
    name: this.name,
    publicKeyPem: pki.publicKeyToPem(this.publicKey),
    data: this.data
  }

  return put('/api/users/'+this.id, data, {'Content-Type': 'application/json'});
};

/**
 * [commit description]
 * @param  {[type]} content      content to send
 * @param  {[type]} publicKey Recipient public key, for encryption use.
 */
p.commit = function(content, recipientPublicKey){
  // construct the encryption
  // create cipher for message
  var key = forge.random.getBytesSync(16);
  var iv = forge.random.getBytesSync(16);
  var cipher = forge.cipher.createCipher('AES-CBC', key);
  cipher.start({iv: iv});
  cipher.update(forge.util.createBuffer(content));
  cipher.finish();
  // do I need to turn it into hex? or just let JSON.stringify to encode bytes(probably won't work)?
  var data = cipher.output.toHex();

  // encrypt key and iv
  var message = { data: data };
  if(recipientPublicKey){
    message.key = forge.util.bytesToHex(recipientPublicKey.encrypt(key));
    message.iv = forge.util.bytesToHex(recipientPublicKey.encrypt(iv));
    message.encrypted = true;
  }
  else{
    message.key = forge.util.bytesToHex(key);
    message.iv = forge.util.bytesToHex(iv);
    message.encrypted = false;
  }

  // add the new message to the message array
  this.data.messages = this.data.messages ? this.data.messages : [];
  this.data.messages.push(message);

  // sign the new message content, update the old signature
  var md = forge.md.sha1.create();
  md.update(JSON.stringify(this.data.messages), 'utf8');
  this.data.signature = forge.util.bytesToHex(this.privateKey.sign(md));

  this.save();
};

Object.defineProperty(p, 'publicKeyPem', {
  get: function() {
    return pki.publicKeyToPem(this.publicKey);
  }
});

User.create = function(name, passphrase){
  var keypair = rsa.generateKeyPair({bits: 1024, e: 0x10001});
  var privateKey = keypair.privateKey;
  var publicKey = keypair.publicKey;

  return post('/api/users', {
    name: name,
    publicKeyPem: pki.publicKeyToPem(publicKey)
  }, {'Content-Type': 'application/json'}).then(function(data){
    User.currentUser = new User(JSON.parse(data)._id, name, publicKey, privateKey, passphrase);
    return User.currentUser.save();
  });
};

User.convertServerModel = function(model){
  var publicKey = pki.publicKeyFromPem(model.publicKeyPem);
  var user = new User(model._id, model.name, publicKey);
  if(model.data){
    user.data = JSON.parse(model.data);
  }
  return user;
};

// TODO: have to obtain friend's public key instead of depends on server returned public key.
// May be hash other people's public key for searching?!
User.verify = function(user){
  if(user.data && user.data.signature){
    console.log(user.data);
    var md2 = forge.md.sha1.create();
    md2.update(JSON.stringify(user.data.messages), 'utf8');
    return user.publicKey.verify(md2.digest().bytes(), forge.util.hexToBytes(user.data.signature));
  }
  else{
    return true;
  }
};

User.currentUser = new User();
User.currentUser.load();
