'use strict';
var request = inclusive.request;
var get = inclusive.get;
var post = inclusive.post;

var baseURI = 'http://10.0.0.150/lapsapi/';

// There are 2 web service calls involved in the code:
// Authenticate with the server and obtain the token
// POST   http://10.0.0.150/lapsapi/token/UserName=Inclusive&Password=2198EAC485699287D81A7A43DAC08FF51F6E&grant_type=password
//
// Grab the profile of a user, which is user id 1.
// GET    http://10.0.0.150/lapsapi/api/v1/profiles/students/1

/**
 * Authenticate with server side to obtain token
 * @param  {string} username Username string
 * @param  {string} password Password string
 * @return {Promise}          A Promise
 */
var authentication = function(username, password){
  // hard code username and password, for testing purpose
  var username = 'Inclusive';
  var password = '2198EAC485699287D81A7A43DAC08FF51F6E';

	return post(baseURI + "token", 'UserName='+username+'&Password='+password+'&grant_type=password').then(function(response){
    var token = JSON.parse(response).access_token;
	  // after authentication, all the requests need to be authenticated with the server.
	  request.headers = {
	  	'Authorization': "Bearer " + token
	  };

    return token;
	}, function(error){
	  console.log("authentication error " + error);
	})
};

/**
 * Get user profile from server-side
 * @param  {uint} id    User id
 * @return {Promise}    A Promise
 */
var getProfile = function(id){
  // hard code the id to be 1,  for now
	id = 1;

	return get(baseURI + 'api/v1/profiles/students/' + id).then(function(response){
    return JSON.parse(response)
	}, function(error){
	  console.log("getProfile error " + error);
	});
};





// Authenticate first, "then" get the user profile.
authentication()
  .then(getProfile)
  .then(function(profile){
  	console.log('get profile successfully', profile);
  }, function(error){
    console.log(error);
  });