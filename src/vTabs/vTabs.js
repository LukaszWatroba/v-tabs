

// Config
angular.module('vTabs.config', [])
  .constant('tabsConfig', {
    states: {
      active: 'is-active'
    }
  })
  .constant('pagesConfig', {
    states: {
      active: 'is-active'
    }
  });


// Modules
angular.module('vTabs.directives', []);
angular.module('vTabs',
  [
    'vTabs.config',
    'vTabs.directives'
  ]);

