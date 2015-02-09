'use strict';

if(Promise === undefined){
  /* jshint -W079 */
  var Promise = ES6Promise.Promise;
}

/**
 * Using JavaScript Promise.
 * http://www.html5rocks.com/en/tutorials/es6/promises/
 * Polyfill required if browser does not support Promise: https://github.com/jakearchibald/es6-promise
 *
 * Note that if custom headers is provided in the request. Browser will fire a preflight request to check with the server
 * to make sure the server support the headers. More information here:
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
 *
 * @param  {[String]} uri             Request target url.
 * @param  {[String]} method          Type of the request: GET, PUT, POST, DELETE, etc.
 * @param  {[String, Object]} data    The body data, either a string or object. Object will be stringified. Optional.
 * @param  {[Object]} headers         Headers added into the request. Optional.
 * @return {[Promise]}                A Promise
 */
var request = inclusive.request = function(uri, method, data, headers){
  return new Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest();
    xhr.open(method, uri);

    // global default headers
    var headerName;
    for(headerName in request.headers){
      xhr.setRequestHeader(headerName, request.headers[headerName]);
    }

    // custom headers override
    for(headerName in headers){
      xhr.setRequestHeader(headerName, headers[headerName]);
    }

    xhr.onload = function(){
      if(this.status === 200){
        resolve(this.response);
      }
      else{
        reject(new Error(this.statusText));
      }
    };

    xhr.onerror = function(error){
      reject(error);
    };

    if(data){
      var payload;
      if(typeof data === 'string'){
        payload = data;
      }
      else{
        payload = JSON.stringify(data);
      }
      xhr.send(payload);
    }
    else{
      xhr.send();
    }
  });
};

/**
 * Shortcut to send GET method request
 * @param  {String} uri   The target uri
 * @param  {Object} headers     The headers specific for this request.
 * @return {Promise} A Promise
 */
var get = inclusive.get = function(uri, headers){
  return request(uri, 'get', null, headers);
};

/**
 * Shortcut to send the POST method request
 * @param  {String} uri   The target uri
 * @param  {[Object, String]} data    The body data payload send through this request. If it is an Object, it will be serialized.
 * @param  {Object} headers     The headers specific for this reuqest.
 * @return {Promise} A Promise
 */
var post = inclusive.post = function(uri, data, headers){
  return request(uri, 'post', data, headers);
};


/**
 * Shortcut to send a PUT method request.
 * @param  {String} uri   The target uri
 * @param  {[Object, String]} data    The body data payload send with this request. If it is an Object, it will be serialized.
 * @param  {Object} headers     The headers specific for this request.
 * @return {Promise} A ES6Promise
 */
var put = inclusive.put = function(uri, data, headers){
  return request(uri, 'put', data, headers);
};