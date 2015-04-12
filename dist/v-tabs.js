/**
 * vTabs - dynamic, flexible and accessible AngularJS tabs.
 * @version v0.1.0
 * @link http://lukaszwatroba.github.io/v-tabs
 * @author Łukasz Wątroba <l@lukaszwatroba.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function(angular) {
'use strict';




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




// vPage directive
angular.module('vTabs.directives')
  .directive('vPage', vPageDirective);


function vPageDirective ($animate, pagesConfig) {
  return {
    restrict: 'EA',
    require: '^vPages',
    transclude: true,
    scope: {},
    link: function (scope, iElement, iAttrs, pagesCtrl, transclude) {
      transclude(scope.$parent, function (clone) {
        iElement.append(clone);
      });

      iAttrs.$set('role', 'tabpanel');
      
      pagesCtrl.addPage(scope);

      function activate () {
        $animate.addClass(iElement, pagesConfig.states.active);
      }

      function deactivate () {
        $animate.removeClass(iElement, pagesConfig.states.active);
      }

      if (scope.isActive) {
        iElement.addClass(pagesConfig.states.active);
      }

      scope.$watch('isActive', function (newValue, oldValue) {
        if (newValue === oldValue) { return false; }

        if (newValue) {
          activate();
        } else {
          deactivate();
        }
      });
    }
  };
}
vPageDirective.$inject = ['$animate', 'pagesConfig'];




// vPages directive
angular.module('vTabs.directives')
  .directive('vPages', vPagesDirective);


function vPagesDirective () {
  return {
    restrict: 'EA',
    transclude: true,
    scope: {
      activeIndex: '=?active',
      control: '=?'
    },
    controller: vPagesDirectiveController,
    controllerAs: 'pagesCtrl',
    link: function (scope, iElement, iAttrs, ctrl, transclude) {
      transclude(scope.$parent, function (clone) {
        iElement.append(clone);
      });

      var protectedApiMethods = ['next', 'previous', 'activate'];

      function checkCustomControlAPIMethods () {
        angular.forEach(protectedApiMethods, function (iteratedMethodName) {
          if (scope.control[iteratedMethodName]) {
            throw new Error('The `' + iteratedMethodName + '` method can not be overwritten');
          }
        });
      }

      if (!angular.isDefined(scope.activeIndex) || !angular.isNumber(scope.activeIndex)) {
        scope.activeIndex = 0;
      }

      if (angular.isDefined(scope.control)) {
        checkCustomControlAPIMethods();

        var mergedControl = angular.extend({}, scope.internalControl, scope.control);
        scope.control = scope.internalControl = mergedControl;
      }
      else {
        scope.control = scope.internalControl;
      }
    }
  };
}


// vPages directive controller
function vPagesDirectiveController ($scope) {
  var ctrl = this;

  $scope.pages = [];

  ctrl.getPageByIndex = function (index) {
    return $scope.pages[index];
  };

  ctrl.getPageIndex = function (page) {
    return $scope.pages.indexOf(page);
  };

  ctrl.addPage = function (page) {
    $scope.pages.push(page);

    if ($scope.pages.length - 1 === $scope.activeIndex) {
      ctrl.activate(page);
    }
  };

  ctrl.next = function () {
    var newActiveIndex = $scope.activeIndex + 1;

    if (newActiveIndex > $scope.pages.length - 1) {
      newActiveIndex = 0;
    }

    $scope.activeIndex = newActiveIndex;
  };

  ctrl.previous = function () {
    var newActiveIndex = $scope.activeIndex - 1;

    if (newActiveIndex < 0) {
      newActiveIndex = $scope.pages.length - 1;
    }

    $scope.activeIndex = newActiveIndex;
  };

  ctrl.activate = function (pageToActivate) {
    if (!pageToActivate) { return; }

    if (!pageToActivate.isActive) {
      pageToActivate.isActive = true;

      angular.forEach($scope.pages, function (iteratedPage) {
        if (iteratedPage !== pageToActivate && iteratedPage.isActive) {
          iteratedPage.isActive = false;
        }
      });
    }
  };

  $scope.$watch('activeIndex', function (newValue, oldValue) {
    if (newValue === oldValue) { return; }
    ctrl.activate( ctrl.getPageByIndex(newValue) );
  });

  // API
  $scope.internalControl = {
    next: function () {
      ctrl.next();
    },
    previous: function () {
      ctrl.previous();
    },
    activate: function (index) {
      $scope.activeIndex = index;
    }
  };
}
vPagesDirectiveController.$inject = ['$scope'];



// vTab directive
angular.module('vTabs.directives')
  .directive('vTab', vTabDirective);


function vTabDirective ($animate, tabsConfig) {
  return {
    restrict: 'EA',
    require: '^vTabs',
    transclude: true,
    scope: {
      disabled: '=ngDisabled'
    },
    link: function (scope, iElement, iAttrs, tabsCtrl, transclude) {
      transclude(scope.$parent, function (clone) {
        iElement.append(clone);
      });

      iAttrs.$set('role', 'tab');
      
      tabsCtrl.addTab(scope);
      scope.tabsCtrl = tabsCtrl;

      scope.focus = function () { iElement[0].focus(); };

      function activate () {
        $animate.addClass(iElement, tabsConfig.states.active);

        iElement.attr({
          'aria-selected': 'true',
          'tabindex': '0'
        });
      }

      function deactivate () {
        $animate.removeClass(iElement, tabsConfig.states.active);

        iElement.attr({
          'aria-selected': 'false',
          'tabindex': '-1'
        });
      }

      if (scope.isActive) {
        $animate.addClass(iElement, tabsConfig.states.active);

        iElement.attr({
          'aria-selected': 'true',
          'tabindex': '0'
        });
      } else {
        iElement.attr({
          'aria-selected': 'false',
          'tabindex': '-1'
        });
      }

      iElement[0].onfocus = function () {
        scope.isFocused = true;
      };

      iElement[0].onblur = function () {
        scope.isFocused = false;
      };

      iElement.on('click', function () {
        if (scope.disabled) { return false; }

        scope.$apply(function () {
          tabsCtrl.activate(scope);
        });
      });

      iElement.on('keydown', function (event) {
        if (scope.disabled) { return false; }
        
        if (event.keyCode === 32  || event.keyCode === 13) {
          scope.$apply(function () { tabsCtrl.activate(scope); });
          event.preventDefault();
        } else if (event.keyCode === 39) {
          scope.$apply(function () { tabsCtrl.focusNext(); });
          event.preventDefault();
        } else if (event.keyCode === 37) {
          scope.$apply(function () { tabsCtrl.focusPrevious(); });
          event.preventDefault();
        }
      });

      scope.$watch('isActive', function (newValue, oldValue) {
        if (newValue === oldValue) { return false; }

        if (newValue) {
          activate();
        } else {
          deactivate();
        }
      });
    }
  };
}
vTabDirective.$inject = ['$animate', 'tabsConfig'];




// vTabs directive
angular.module('vTabs.directives')
  .directive('vTabs', vTabsDirective);


function vTabsDirective () {
  return {
    restrict: 'EA',
    transclude: true,
    scope: {
      activeIndex: '=?active',
      control: '=?'
    },
    controller: vTabsDirectiveController,
    controllerAs: 'tabsCtrl',
    link: function (scope, iElement, iAttrs, ctrl, transclude) {
      transclude(scope.$parent, function (clone) {
        iElement.append(clone);
      });

      var protectedApiMethods = ['next', 'previous', 'activate'];

      function checkCustomControlAPIMethods () {
        angular.forEach(protectedApiMethods, function (iteratedMethodName) {
          if (scope.control[iteratedMethodName]) {
            throw new Error('The `' + iteratedMethodName + '` method can not be overwritten');
          }
        });
      }

      if (!angular.isDefined(scope.activeIndex) || !angular.isNumber(scope.activeIndex)) {
        scope.activeIndex = 0;
      }

      if (angular.isDefined(scope.control)) {
        checkCustomControlAPIMethods();

        var mergedControl = angular.extend({}, scope.internalControl, scope.control);
        scope.control = scope.internalControl = mergedControl;
      }
      else {
        scope.control = scope.internalControl;
      }
    }
  };
}


// vTabs directive controller
function vTabsDirectiveController ($scope) {
  var ctrl = this;

  $scope.tabs = [];

  ctrl.getTabByIndex = function (index) {
    return $scope.tabs[index];
  };

  ctrl.getTabIndex = function (tab) {
    return $scope.tabs.indexOf(tab);
  };

  ctrl.addTab = function (tab) {
    $scope.tabs.push(tab);

    var tabIndex = $scope.tabs.length - 1;

    if (tabIndex === $scope.activeIndex) {
      tab.isActive = true;
    }
  };

  ctrl.focusNext = function () {
    var length = $scope.tabs.length;

    for (var i = 0; i < length; i++) {
      var iteratedTab = $scope.tabs[i];

      if (iteratedTab.isFocused) {
        var tabToFocusIndex = i + 1;

        if (tabToFocusIndex > $scope.tabs.length - 1) {
          tabToFocusIndex = 0;
        }

        var tabToFocus = $scope.tabs[tabToFocusIndex];
            tabToFocus.focus();

        break;
      }
    }
  };

  ctrl.focusPrevious = function () {
    var length = $scope.tabs.length;

    for (var i = 0; i < length; i++) {
      var iteratedTab = $scope.tabs[i];

      if (iteratedTab.isFocused) {
        var tabToFocusIndex = i - 1;

        if (tabToFocusIndex < 0) {
          tabToFocusIndex = $scope.tabs.length - 1;
        }

        var tabToFocus = $scope.tabs[tabToFocusIndex];
            tabToFocus.focus();

        break;
      }
    }
  };

  ctrl.next = function () {
    var newActiveIndex = $scope.activeIndex + 1;

    if (newActiveIndex > $scope.tabs.length - 1) {
      newActiveIndex = 0;
    }

    $scope.activeIndex = newActiveIndex;
  };

  ctrl.previous = function () {
    var newActiveIndex = $scope.activeIndex - 1;

    if (newActiveIndex < 0) {
      newActiveIndex = $scope.tabs.length - 1;
    }

    $scope.activeIndex = newActiveIndex;
  };

  ctrl.activate = function (tabToActivate) {
    if (!tabToActivate) { return; }

    if (!tabToActivate.isActive) {
      tabToActivate.isActive = true;
      $scope.activeIndex = ctrl.getTabIndex(tabToActivate);

      angular.forEach($scope.tabs, function (iteratedTab) {
        if (iteratedTab !== tabToActivate && iteratedTab.isActive) {
          iteratedTab.isActive = false;
        }
      });
    }
  };

  $scope.$watch('activeIndex', function (newValue, oldValue) {
    if (newValue === oldValue) { return; }

    var tabToActivate = ctrl.getTabByIndex(newValue);

    if (tabToActivate.disabled) {
      $scope.activeIndex = oldValue;
      return false;
    }

    ctrl.activate( ctrl.getTabByIndex(newValue) );
  });

  // API
  $scope.internalControl = {
    next: function () {
      ctrl.next();
    },
    previous: function () {
      ctrl.previous();
    },
    activate: function (index) {
      $scope.activeIndex = index;
    }
  };
}
vTabsDirectiveController.$inject = ['$scope'];

}(angular));