
var hasUser = false;

// global
var currentUserID;

var usersController = angular.module('UsersController', []);


usersController.controller('UserNewController', ['$scope', '$http', '$routeParams', '$location',
  function($scope, $http, $routeParams, $location) {

    $scope.submit = function(user) {
      generateKeyPair(user).then(function(value){
        console.log('post', value);
        $http.post('/api/users', {
          name: value.name,
          publicKeyPem: value.publicKeyPem
        }).success(function(data, status, headers, config){

          localforage.setItem("userID", data._id);
          currentUserID = data._id;

          console.log('success!!!');
        }).error(function(data, status, headers, config){
          console.log('error!!!!');
        })
      });
    };

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
    setupCurrentUser();

    $scope.flush = function(data) {
      var message = "to sisi";

      // TODO: sign the message
      var md = forge.md.sha1.create();
      md.update(message, 'utf8');
      var signature = forge.util.bytesToHex(currentUser.privateKey.sign(md));


      var toSend = {
        message: message,
        signature: signature
      }

      // TODO: use AES to cipher the JSON text
      // TODO: use RSA to encrypt the AES key, send RSA encrypted key with the ciphered message

      var key = forge.random.getBytesSync(16);
      var iv = forge.random.getBytesSync(16);
      var cipher = forge.cipher.createCipher('AES-CBC', key);
      cipher.start({iv: iv});
      cipher.update(forge.util.createBuffer(message));
      cipher.finish();
      var encrypted = cipher.output;
      // outputs encrypted hex
      console.log(encrypted.toHex());




      var decipher = forge.cipher.createDecipher('AES-CBC', key);
      decipher.start({iv: iv});
      decipher.update(encrypted);
      decipher.finish();
      // outputs decrypted hex
      console.log(decipher.output.data);



















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
return;
      // $http.post('/api/users/' + currentuserID+ '/flush', {
      //   data: user.data
      // }).success(function(data, status, headers, config){
      //     console.log('update success!!!');
      //   }).error(function(data, status, headers, config){
      //     console.log('update error!!!!');
      //   });
    }
  }]);