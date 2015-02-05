
var hasUser = false;

// global
var currentUserID;

var usersController = angular.module('UsersController', []);


usersController.controller('UserNewController', ['$scope', '$http', '$routeParams', '$location',
  function($scope, $http, $routeParams, $location) {

    $scope.submit = function(user) {
      User.create(user.name, user.passphrase);
    }

  }]);

usersController.controller('UserIndexController', ['$scope', '$http',
  function ($scope, $http) {
    $http.get('/api/users').success(function(data) {
      $scope.users = data;
    });
  }]);

usersController.controller('UserShowController', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {
    $http.get('/api/users/'+$routeParams.userId).success(function(data) {
      console.log(data);
      // TODO: decrypt the messages
      $scope.user = data;
    });
  }]);


usersController.controller('MessageController', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {

    $scope.flush = function(formData) {
      User.currentUser.commit(formData.content);
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