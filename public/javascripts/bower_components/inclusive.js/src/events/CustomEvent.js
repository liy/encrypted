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