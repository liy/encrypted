var usersController = angular.module('UsersController', []);

usersController.controller('UserNewController', ['$scope', '$http',
  function($scope, $http) {

  }]);

usersController.controller('UserIndexController', ['$scope', '$http',
  function ($scope, $http) {
    $http.get('/api/users').success(function(data) {
      data = [{name:'liy'}, {name:'test'}];
      $scope.users = data;
    });
  }]);

usersController.controller('UserShowController', ['$scope', '$routeParams',
  function($scope, $routeParams) {
    $scope.userId = $routeParams.userId;
  }]);