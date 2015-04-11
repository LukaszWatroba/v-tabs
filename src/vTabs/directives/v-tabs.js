

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
