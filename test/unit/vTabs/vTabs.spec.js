'use strict';

describe('vTabs', function () {

  var dependencies = [];

  var hasModule = function(module) {
    return dependencies.indexOf(module) >= 0;
  };



  beforeEach(function () {
    dependencies = angular.module('vTabs').requires;
  });

  
  
  it('should load config module', function () {
    expect(hasModule('vTabs.config')).toBe(true);
  });


  it('should load directives module', function () {
    expect(hasModule('vTabs.directives')).toBe(true);
  });

});