

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
