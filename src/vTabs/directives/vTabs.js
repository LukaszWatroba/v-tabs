

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
