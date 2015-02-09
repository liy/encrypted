'use strict';
window.onload = function(){
  var require = inclusive.require;

  var request = require('request.js');
  var get = require('request.js', 'get');
  var put = require('request.js', 'put');
  var post = require('request.js', 'post');

  request.headers = {
    "Authorization": "my data"
  };


  // get the access profile of a user
  var getAccessProfile = function(id){
    return get('http://localhost:8080/profiles/' + id);
  };

  // // update the access profile of a user
  // var updateAccessProfile = function(id, data){
  //   return put('http://localhost:8080/profiles/' + id, data);
  // };

  // var deleteRequest = function(id){
  //   return request('http://localhost:8080/profiles/'+id, 'delete');
  // }

  getAccessProfile(1).then(function(response){
    console.log(response);
  });

  // updateAccessProfile(1).then(function(response){
  //   console.log(response);
  // });

  // deleteRequest(1).then(function(response){
  //   console.log(response);
  // });
}

