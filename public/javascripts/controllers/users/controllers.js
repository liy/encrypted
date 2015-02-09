
var hasUser = false;

// global
var currentUserID;

var usersController = angular.module('UsersController', []).service('recipient', function(){
  var recipient = null;
  return {
    getValue: function () {
        return recipient;
    },
    setValue: function(value) {
      console.log('recipient updated: ' + value);
      recipient = value;
    }
  };
});


usersController.controller('UserNewController', ['$scope', '$http', '$routeParams', '$location',
  function($scope, $http, $routeParams, $location) {

    $scope.submit = function(user) {
      User.create(user.name, user.passphrase);
      $location.path('/users');
    }

  }]);

usersController.controller('UserIndexController', ['$scope', '$http',
  function ($scope, $http) {
    $http.get('/api/users').success(function(data) {
      $scope.users = data;
    });
  }]);

usersController.controller('UserShowController', ['$scope', '$http', '$routeParams', '$location', 'recipient',
  function($scope, $http, $routeParams, $location, recipient) {
    $http.get('/api/users/'+$routeParams.userId).success(function(response) {
      // TODO: decrypt the messages
      // console.log(response);
      $scope.user = User.convertServerModel(response);
      // console.log(User.verify($scope.user));

      var decryptedMessages = [];

      // has data
      if(response.data){
        var data = JSON.parse(response.data);
        for(var i=0; i<data.messages.length; ++i){
          var message = data.messages[i];
          // decrypt encrypted message
          if(message.encrypted){
            try{
              // use current user's private key to decrypt the message
              var keyDecrypted = User.currentUser.privateKey.decrypt(forge.util.hexToBytes(message.key));
              var ivDecrypted = User.currentUser.privateKey.decrypt(forge.util.hexToBytes(message.iv));
            }
            catch(err){
              // swallow any message cannot decrypt
              console.warn('Not for you!', message);
              continue;
            }
          }
          else{
            // just do a normal AES deciphering
            var keyDecrypted = forge.util.hexToBytes(message.key);
            var ivDecrypted = forge.util.hexToBytes(message.iv);
          }

          console.log(message)
          var decipher = forge.cipher.createDecipher('AES-CBC', keyDecrypted);
          decipher.start({iv: ivDecrypted});
          decipher.update(forge.util.createBuffer(forge.util.hexToBytes(message.data)));
          decipher.finish();
          // outputs decrypted hex
          console.log(decipher.output.data);
          decryptedMessages.push(decipher.output.data);
        }
      }

      $scope.messages = decryptedMessages;
    });

    // private message
    $scope.submit = function(content){
      User.currentUser.commit(content, $scope.user.publicKey);
      User.currentUser.push().then(function(result){
        window.alert('message created');
        $location.path('/users');
      });
    };
  }]);


usersController.controller('MessageController', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {

    $scope.flush = function(content) {
      // create a public message
      User.currentUser.commit(content);
      User.currentUser.push();

      console.log(User.currentUser);


      // Test decrypt
      // var keyDecrypted = currentUser.privateKey.decrypt(forge.util.hexToBytes(keyHex));
      // var ivDecrypted = currentUser.privateKey.decrypt(forge.util.hexToBytes(ivHex));


      // var decipher = forge.cipher.createDecipher('AES-CBC', keyDecrypted);
      // decipher.start({iv: ivDecrypted});
      // decipher.update(forge.util.createBuffer(forge.util.hexToBytes(dataHex)));
      // decipher.finish();
      // // outputs decrypted hex
      // console.log(decipher.output.data);











      // TODO: sign the message
      // var md = forge.md.sha1.create();
      // md.update(message, 'utf8');
      // var signature = forge.util.bytesToHex(currentUser.privateKey.sign(md));

      // // verify
      // var md2 = forge.md.sha1.create();
      // md2.update(message, 'utf8');
      // var verified = currentUser.publicKey.verify(md2.digest().bytes(), forge.util.hexToBytes(signature));


      // console.log(verified);



      // var data = {
      //   message: message,
      //   signature: signature
      // }

      // TODO: use AES to cipher the JSON text
      // TODO: use RSA to encrypt the AES key, send RSA encrypted key with the ciphered message

      // var key = forge.random.getBytesSync(16);
      // var iv = forge.random.getBytesSync(16);
      // var cipher = forge.cipher.createCipher('AES-CBC', key);
      // cipher.start({iv: iv});
      // cipher.update(forge.util.createBuffer(message));
      // cipher.finish();
      // var encrypted = cipher.output;
      // // outputs encrypted hex
      // console.log(encrypted.toHex());




      // var decipher = forge.cipher.createDecipher('AES-CBC', key);
      // decipher.start({iv: iv});
      // decipher.update(encrypted);
      // decipher.finish();
      // // outputs decrypted hex
      // console.log(decipher.output.data);



















      // // TODO: encrypt the data with target user's public key
      // // var targetPublicKey = forge.pki.publicKeyFromPem(data.publicKeyPem);
      // var encrypted = currentUser.publicKey.encrypt(JSON.stringify(toSend));

      // var decrypted = currentUser.privateKey.decrypt(encrypted);
      // console.log(decrypted);

      // var verified = currentUser.publicKey.verify(md.digest().bytes(), signature);
      // console.log(verified)



      // console.log(md);
      // console.log(forge.util.hexToBytes(message).toString());
      // console.log(currentUser);

      // $http.post('/api/users/' + currentuserID+ '/flush', {
      //   data: user.data
      // }).success(function(data, status, headers, config){
      //     console.log('update success!!!');
      //   }).error(function(data, status, headers, config){
      //     console.log('update error!!!!');
      //   });
    }
  }]);