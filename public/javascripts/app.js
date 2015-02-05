// public/core.js
var messsageApp = angular.module('MessageApp', [
    'ngRoute',
    'UsersController'
    ]);

messsageApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/users', {
        templateUrl: 'views/users/index.html',
        controller: 'UserIndexController'
      }).
      when('/users/new', {
        templateUrl: 'views/users/new.html',
        controller: 'UserNewController'
      }).
      when('/users/:userId', {
        templateUrl: 'views/users/show.html',
        controller: 'UserShowController'
      }).
      when('/message', {
        templateUrl: 'views/message.html',
        controller: 'MessageController'
      }).
      otherwise({
        // TODO: send public message
        redirectTo: '/message'
      });
  }]);