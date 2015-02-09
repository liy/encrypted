/* global describe, it */
'use strict';

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('Correct build', function(){
  it('Should have AccessManager', function(){
    expect(inclusive.AccessManager).to.not.equal('undefined');
  });
});