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