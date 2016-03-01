

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
