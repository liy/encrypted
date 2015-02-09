'use strict';(function(){// inclusive package
var inclusive = window.inclusive = window.inclusive || Object.create(null);

var require = inclusive.require = function(path, moduleName){
  // if file contains multiple modules
  if(moduleName){
    return inclusive[moduleName];
  }

  var index = path.lastIndexOf('/');
  index = (index === -1) ? 0 : index+1;
  var fileName = path.substr(index);

  var className = fileName.split('.')[0];

  return inclusive[className];
};
'use strict';
// DOM CustomEvent polyfill:
// https://developer.mozilla.org/en/docs/Web/API/CustomEvent#Polyfill
// https://github.com/krambuhl/custom-event-polyfill/blob/master/custom-event-polyfill.js

// always use modified CustomEvent

/* jshint -W079 */
var CustomEvent = inclusive.CustomEvent = function(type, bubbles, cancelable, detail){
  var evt = document.createEvent('CustomEvent');
  evt.initCustomEvent(type, bubbles, cancelable, detail);

  evt._immediatePropagationStopped = false;

  evt._propagationStopped = false;

  /**
   * There are three phases of the event.
   * 1, the capturing phase, which is the first phase of the event flow.
   * 2, the target phase, which is the second phase of the event flow.
   * 3, the bubbling phase, which is the third phase of the event flow.
   */
  // cannot set the eventPhase in strict mode in IE.
  // evt.eventPhase = 0;

  // Have to delete it first, then setup a new eventPhase property.
  delete evt.eventPhase;
  Object.defineProperty(evt, 'eventPhase', {
    get: function() {
        return this._eventPhase;
    },
    set: function(value) {
        this._eventPhase = value;
    }
  });
  evt.eventPhase = 0;


  evt._currentTarget = null;
  Object.defineProperty(evt, 'currentTarget', {
    get: function() {
        return this._currentTarget;
    },
    set: function(value) {
        this._currentTarget = value;
    }
  });

  // evt._target = null;
  // Object.defineProperty(evt, 'target', {
  //   get: function() {
  //       return this._target;
  //   },
  //   set: function(value) {
  //       this._target = value;
  //   }
  // });

  return evt;
};
// var p = CustomEvent.prototype = window.Event.prototype;

// /**
//  * Prevents all other event listeners from being triggered for this event dispatch, including any remaining candidate event listeners.
//  * Once it has been called, further calls to this method have no additional effect.
//  */
// p.stopImmediatePropagation = function(){
//   this._immediatePropagationStopped = this._propagationStopped = true;
// };

// *
//  * Prevents all other event listeners from being triggered, excluding any remaining candidate event listeners.
//  * Once it has been called, further calls to this method have no additional effect.

// p.stopPropagation = function(){
//   this._propagationStopped = true;
// };

// p.toString = function(){
//   return '[Event type="' + this.type + '" ' + 'bubbles='+this.bubbles+' eventPhase=' + this.eventPhase + ']';
// };
'use strict';

/**
 * http://stackoverflow.com/questions/183214/javascript-callback-scope
 * bind function create a closure of a desired scope for the passed in function parameter.
 *
 */
inclusive.bind = function(scope, func) {
  return function () {
    func.apply(scope, arguments);
  };
};

/**
 * http://blog.bripkens.de/2011/05/maintaining-and-testing-scope-in-javascript/
 * Don't konw which way is better... probably, this is slower than former function approach.
 * The native implementation should not be override, so check bind exist or not before overrding.
 */
if(Function.prototype.bind === undefined) {
  Function.prototype.bind = function(scope){
    var func = this;
    return function(){
      return func.apply(scope, arguments);
    };
  };
}

// http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
inclusive.isDOMElement = function(obj){
  try {
    //Using W3 DOM2 (works for FF, Opera and Chrom)
    return obj instanceof HTMLElement;
  }
  catch(e){
    //Browsers not supporting W3 DOM2 don't have HTMLElement and
    //an exception is thrown and we end up here. Testing some
    //properties that all elements have. (works on IE7)
    return (typeof obj === 'object') &&
      (obj.nodeType===1) && (typeof obj.style === 'object') &&
      (typeof obj.ownerDocument ==='object');
  }
};
'use strict';

var isDOMElement = require('utils.js', 'isDOMElement');

var GenericEvent = inclusive.GenericEvent = function(type, bubbles){
  this.type = type;
  this.bubbles = bubbles || false;

  this.target = null;

  this.currentTarget = null;

  this._immediatePropagationStopped = false;

  this._propagationStopped = false;

  /**
   * There are three phases of the event.
   * 1, the capturing phase, which is the first phase of the event flow.
   * 2, the target phase, which is the second phase of the event flow.
   * 3, the bubbling phase, which is the third phase of the event flow.
   */
  this.eventPhase = 0;
};
var p = GenericEvent.prototype;

GenericEvent.COMPLETE = 'complete';

/**
 * Prevents all other event listeners from being triggered for this event dispatch, including any remaining candidate event listeners.
 * Once it has been called, further calls to this method have no additional effect.
 */
p.stopImmediatePropagation = function(){
  this._immediatePropagationStopped = this._propagationStopped = true;
};

/**
 * Prevents all other event listeners from being triggered, excluding any remaining candidate event listeners.
 * Once it has been called, further calls to this method have no additional effect.
 */
p.stopPropagation = function(){
  this._propagationStopped = true;
};

p.toString = function(){
  return '[GenericEvent type="' + this.type + '" ' + 'bubbles='+this.bubbles+' eventPhase=' + this.eventPhase + ']';
};
'use strict';

/* jshint -W079 */
var CustomEvent = require('events/CustomEvent.js');
var isDOMElement = require('utils.js', 'isDOMElement');
var GenericEvent = require('events/GenericEvent.js');

var EventDispatcher = inclusive.EventDispatcher = function(){
  // Storing all the capture phase listeners.
  // Type as key, the actual listener function as the value.
  this._captures = Object.create(null);

  // Storing the **target phase** and bubble phase listeners.
  // Type as key, the actual listener function as the value.
  //
  // Note that the target phase listener is stored here.
  this._targetBubbles = Object.create(null);
};
var p = EventDispatcher.prototype;

var createEvent = function(obj, type, bubbles, cancelable){
  if(isDOMElement(obj)){
    return new inclusive.CustomEvent(type, bubbles, cancelable);
  }
  else{
    return new GenericEvent(type, bubbles);
  }
};

/**
 * [addEventListener description]
 * @param {[type]} type       [description]
 * @param {[type]} listener   [description]
 * @param {Boolean} useCapture Use capture phase. Note that if you set useCapture to true and add a listener to the source(target) event dispatcher,
 *                            listener will not triggered. The capture phase stops before the target. You should use non-capture phase listener.
 *                            e.g., A Container contains a Bitmap, adding listener to the Bitmap and set useCapture to true will not get triggered.
 *                            Instead, you can disable useCapture, or add listener to the Container and use capture phase.
 */
p.addEventListener = function(type, listener, useCapture){
  var listeners;
  if(useCapture){
    if(!this._captures[type]){
      this._captures[type] = [];
    }
    listeners = this._captures[type];
  }
  else{
    if(!this._targetBubbles[type]){
      this._targetBubbles[type] = [];
    }
    listeners = this._targetBubbles[type];
  }
  listeners.push(listener);

  return listener;
};

p.hasEventListener = function(type){
  return this._targetBubbles[type] || this._captures[type];
};

p.removeEventListener = function(type, listener, useCapture){
  var listeners = useCapture ? this._captures[type] : this._targetBubbles[type];
  var len = listeners.length;
  var index = listeners.indexOf(listener);
  if(index !== -1){
    if(len === 1){
      listeners.length = 0;
    }
    else{
      listeners.splice(index, 1);
    }
  }
};

/**
 * Dispatch event with corresponding type, and add custom properties for
 * the event object being sent.
 * @param  {Object} type              The type of the event.
 * @param  {Object} customEventProps  You can add extra custom properties into the event object using the object map.
 * @return {Object} The event object being sent.
 */
p.dispatch = function(type, customEventProps){
  var e = createEvent(this, type);

  if(customEventProps){
    // TODO: I might need to add extra check here to make sure that
    // invoker does not manipulate "currentTarget" and "target", or
    // other unexpected variables
    //
    // Again, currentTarget and target should only be managed by browser, or
    // if we are using createjs, they will be managed by "dispatchEvent" function.
    for(var key in customEventProps){
      e[key] = customEventProps[key];
    }
  }

  return this.dispatchEvent(e);
};

/**
 * Dispatch a Event instance to all the listeners.
 * @param  {Object} e The event instance.
 * @return {Object}   The event instance
 */
p.dispatchEvent = function(e){
  // get all the nodes(parents, includes the dispatcher itself) needs to be notified by the event
  var nodes = [this];
  var node = this.parent;
  while(node){
    nodes.push(node);
    node = node.parent;
  }

  // event's target is always the source event dispatcher, which originated the event.
  // currentTarget is pointed to the listener
  e.target = this;

  var i, j, lstLen, listeners;
  var len = nodes.length;

  // capture phase
  for(i=len-1; i>0 && !e._propagationStopped; --i){
    e.eventPhase = 1;
    e.currentTarget = nodes[i];

    // trigger all the listeners of the node
    listeners = nodes[i]._captures[e.type];
    // console.dir(nodes[i]._captures);
    if(!listeners){
      continue;
    }

    lstLen = listeners.length;
    for(j=0; j<lstLen && !e._immediatePropagationStopped; ++j){
      listeners[j](e);
    }
  }

  // target phase
  e.eventPhase = 2;
  e.currentTarget = nodes[0];
  // trigger all the listeners of the node
  listeners = nodes[0]._targetBubbles[e.type];
  if(listeners){
    lstLen = listeners.length;
    for(j=0; j<lstLen && !e._immediatePropagationStopped; ++j){
      listeners[j](e);
    }
  }

  // bubble phase
  for(i=1; i<len && !e._propagationStopped && e.bubbles; ++i){
    e.eventPhase = 3;
    e.currentTarget = nodes[i];

    // trigger all the listeners of the node
    listeners = nodes[i]._targetBubbles[e.type];
    if(!listeners){
      continue;
    }

    lstLen = listeners.length;
    for(j=0; j<lstLen && !e._immediatePropagationStopped; ++j){
      listeners[j](e);
    }
  }

  return e;
};
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
};})();
//# sourceMappingURL=inclusive.js.map