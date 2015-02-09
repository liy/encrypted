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