/**
 * vTabs - dynamic, flexible and accessible AngularJS tabs.
 * @version v0.2.0
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
    controller: PageDirectiveController,
    scope: {
      isDisabled: '=?ngDisabled',
      id: '@?'
    },
    link: function (scope, iElement, iAttrs, pagesCtrl, transclude) {
      transclude(scope.$parent.$new(), function (clone, transclusionScope) {
        transclusionScope.$page = scope.internalControl;
        if (scope.id) { transclusionScope.$page.id = scope.id; }
        iElement.append(clone);
      });

      iAttrs.$set('role', 'tabpanel');

      scope.pagesCtrl = pagesCtrl;
      scope.pageElement = iElement;

      pagesCtrl.addPage(scope);

      if (angular.isDefined(iAttrs.disabled)) {
        scope.isDisabled = true;
      }

      function activate () {
        $animate.addClass(iElement, pagesConfig.states.active);
      }

      function deactivate () {
        $animate.removeClass(iElement, pagesConfig.states.active);
      }

      scope.$watch('isActive', function (newValue, oldValue) {
        if (newValue === oldValue) { return false; }
        if (newValue) { activate(); }
        else { deactivate(); }
      });

      scope.$evalAsync(function () {
        if (scope.isActive) {
          activate();
        }
      });
    }
  };
}
vPageDirective.$inject = ['$animate', 'pagesConfig'];


// vPage directive controller
function PageDirectiveController ($scope) {
  var ctrl = this;

  ctrl.isActive = function isActive () {
    return !!$scope.isActive;
  };

  ctrl.activate = function activate () {
    $scope.pagesCtrl.activate($scope);
  };

  $scope.internalControl = {
    activate: ctrl.activate,
    isActive: ctrl.isActive
  };
}

PageDirectiveController.$inject = ['$scope'];



// vPages directive
angular.module('vTabs.directives')
  .directive('vPages', vPagesDirective);


function vPagesDirective () {
  return {
    restrict: 'EA',
    transclude: true,
    scope: {
      activeIndex: '=?active',
      control: '=?',
      id: '@?'
    },
    controller: vPagesDirectiveController,
    controllerAs: 'pagesCtrl',
    link: function (scope, iElement, iAttrs, ctrl, transclude) {
      transclude(scope.$parent.$new(), function (clone, transclusionScope) {
        transclusionScope.$pages = scope.internalControl;
        if (scope.id) { transclusionScope.$pages.id = scope.id; }
        iElement.append(clone);
      });

      if (angular.isDefined(scope.control)) {
        checkCustomControlAPIMethods();

        var mergedControl = angular.extend({}, scope.internalControl, scope.control);
        scope.control = scope.internalControl = mergedControl;
      } else {
        scope.control = scope.internalControl;
      }

      if (!angular.isDefined(scope.activeIndex) || !angular.isNumber(scope.activeIndex)) {
        scope.activeIndex = 0;
      }

      function checkCustomControlAPIMethods () {
        var protectedApiMethods = ['next', 'previous', 'activate'];

        angular.forEach(protectedApiMethods, function (iteratedMethodName) {
          if (scope.control[iteratedMethodName]) {
            throw new Error('The `' + iteratedMethodName + '` method can not be overwritten');
          }
        });
      }

      scope.$applyAsync(function () {
        var eventName = (angular.isDefined(ctrl.getPagesId())) ? ctrl.getPagesId() + ':onReady' : 'vPages:onReady';
        scope.$emit(eventName);
      });
    }
  };
}


// vPages directive controller
function vPagesDirectiveController ($scope) {
  var ctrl = this;

  $scope.pages = [];

  ctrl.getPagesId = function getPagesId () {
    return $scope.id;
  };

  ctrl.getPageByIndex = function (index) {
    return $scope.pages[index];
  };

  ctrl.getPageIndex = function (page) {
    return $scope.pages.indexOf(page);
  };

  ctrl.getPageIndexById = function getPageIndexById (id) {
    var length = $scope.pages.length,
        index = null;

    for (var i = 0; i < length; i++) {
      var iteratedPage = $scope.pages[i];
      if (iteratedPage.id && iteratedPage.id === id) { index = i; }
    }

    return index;
  };

  ctrl.addPage = function (page) {
    $scope.pages.push(page);

    if ($scope.activeIndex === ctrl.getPageIndex(page)) {
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

    var pageToActivate = ctrl.getPageByIndex(newValue);
    if (pageToActivate.isDisabled) {
      $scope.activeIndex = (angular.isDefined(oldValue)) ? oldValue : 0;
      return false;
    }

    ctrl.activate(pageToActivate);
  });

  // API
  $scope.internalControl = {
    next: function () {
      ctrl.next();
    },
    previous: function () {
      ctrl.previous();
    },
    activate: function (indexOrId) {
      if (angular.isString(indexOrId)) {
        $scope.activeIndex = ctrl.getPageIndexById(indexOrId);
      } else {
        $scope.activeIndex = indexOrId;
      }
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
    controller: TabDirectiveController,
    scope: {
      isDisabled: '=?ngDisabled',
      id: '@?'
    },
    link: function (scope, iElement, iAttrs, tabsCtrl, transclude) {
      transclude(scope.$parent.$new(), function (clone, transclusionScope) {
        transclusionScope.$tab = scope.internalControl;
        if (scope.id) { transclusionScope.$tab.id = scope.id; }
        iElement.append(clone);
      });

      iAttrs.$set('role', 'tab');

      scope.isInactive = angular.isDefined(iAttrs.inactive);
      scope.tabsCtrl = tabsCtrl;
      scope.tabElement = iElement;
      scope.focus = focus;

      tabsCtrl.addTab(scope);

      if (angular.isDefined(iAttrs.disabled)) {
        scope.isDisabled = true;
      }

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

      function focus () {
        iElement[0].focus();
      }

      function onClick () {
        if (scope.isDisabled || scope.isInactive) { return false; }

        scope.$apply(function () {
          tabsCtrl.activate(scope);
        });
      }

      function onKeydown (event) {
        if (scope.isDisabled) { return false; }

        if (event.keyCode === 32  || event.keyCode === 13) {
          scope.$apply(function () { tabsCtrl.activate(scope); });
          event.preventDefault();
        } else if (event.keyCode === 39) {
          tabsCtrl.focusNext();
          event.preventDefault();
        } else if (event.keyCode === 37) {
          tabsCtrl.focusPrevious();
          event.preventDefault();
        }
      }

      function onFocus () {
        scope.$apply(function () {
          scope.isFocused = true;
        });
      }

      function onBlur () {
        scope.$apply(function () {
          scope.isFocused = false;
        });
      }

      function onDestroy () {
        iElement.off('click', onClick);
        iElement.off('keydown', onKeydown);
        iElement[0].onfocus = null;
        iElement[0].onblur = null;
      }

      scope.$watch('isActive', function (newValue, oldValue) {
        if (newValue === oldValue) { return false; }
        if (newValue) { activate(); }
        else { deactivate(); }
      });

      iElement.on('click', onClick);
      iElement.on('keydown', onKeydown);
      iElement[0].onfocus = onFocus;
      iElement[0].onblur = onBlur;

      scope.$on('$destroy', onDestroy);

      scope.$evalAsync(function () {
        if (scope.isActive) {
          activate();
        } else {
          deactivate();
        }
      });
    }
  };
}
vTabDirective.$inject = ['$animate', 'tabsConfig'];


// vTab directive controller
function TabDirectiveController ($scope) {
  var ctrl = this;

  ctrl.isActive = function isActive () {
    return !!$scope.isActive;
  };

  ctrl.activate = function activate () {
    $scope.tabsCtrl.activate($scope);
  };

  $scope.internalControl = {
    activate: ctrl.activate,
    isActive: ctrl.isActive
  };
}

TabDirectiveController.$inject = ['$scope'];



// vTabs directive
angular.module('vTabs.directives')
  .directive('vTabs', vTabsDirective);


function vTabsDirective () {
  return {
    restrict: 'EA',
    transclude: true,
    scope: {
      activeIndex: '=?active',
      control: '=?',
      id: '@?'
    },
    controller: vTabsDirectiveController,
    controllerAs: 'tabsCtrl',
    link: function (scope, iElement, iAttrs, ctrl, transclude) {
      transclude(scope.$parent.$new(), function (clone, transclusionScope) {
        transclusionScope.$tabs = scope.internalControl;
        if (scope.id) { transclusionScope.$tabs.id = scope.id; }
        iElement.append(clone);
      });

      if (!angular.isDefined(scope.activeIndex) || !angular.isNumber(scope.activeIndex)) {
        scope.activeIndex = 0;
      }

      if (angular.isDefined(scope.control)) {
        checkCustomControlAPIMethods();

        var mergedControl = angular.extend({}, scope.internalControl, scope.control);
        scope.control = scope.internalControl = mergedControl;
      } else {
        scope.control = scope.internalControl;
      }

      function checkCustomControlAPIMethods () {
        var protectedApiMethods = ['next', 'previous', 'activate'];

        angular.forEach(protectedApiMethods, function (iteratedMethodName) {
          if (scope.control[iteratedMethodName]) {
            throw new Error('The `' + iteratedMethodName + '` method can not be overwritten');
          }
        });
      }

      scope.$applyAsync(function () {
        var eventName = (angular.isDefined(ctrl.getTabsId())) ? ctrl.getTabsId() + ':onReady' : 'vTabs:onReady';
        scope.$emit(eventName);
      });
    }
  };
}


// vTabs directive controller
function vTabsDirectiveController ($scope) {
  var ctrl = this;

  $scope.tabs = [];

  ctrl.getTabsId = function getTabsId () {
    return $scope.id;
  };

  ctrl.getTabByIndex = function getTabByIndex (index) {
    return $scope.tabs[index];
  };

  ctrl.getTabIndex = function getTabIndex (tab) {
    return $scope.tabs.indexOf(tab);
  };

  ctrl.getTabIndexById = function getTabIndexById (id) {
    var length = $scope.tabs.length,
        index = null;

    for (var i = 0; i < length; i++) {
      var iteratedTab = $scope.tabs[i];
      if (iteratedTab.id && iteratedTab.id === id) { index = i; }
    }

    return index;
  };

  ctrl.addTab = function (tab) {
    $scope.tabs.push(tab);

    if ($scope.activeIndex === ctrl.getTabIndex(tab)) {
      ctrl.activate(tab);
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
    if (tabToActivate.isDisabled) {
      $scope.activeIndex = (angular.isDefined(oldValue)) ? oldValue : 0;
      return false;
    }

    ctrl.activate(tabToActivate);
  });

  // API
  $scope.internalControl = {
    next: function () {
      ctrl.next();
    },
    previous: function () {
      ctrl.previous();
    },
    activate: function (indexOrId) {
      if (angular.isString(indexOrId)) {
        $scope.activeIndex = ctrl.getTabIndexById(indexOrId);
      } else {
        $scope.activeIndex = indexOrId;
      }
    }
  };
}
vTabsDirectiveController.$inject = ['$scope'];

}(angular));