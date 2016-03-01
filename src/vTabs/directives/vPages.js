

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
