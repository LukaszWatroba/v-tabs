

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

      if (angular.isDefined(iAttrs.disabled)) {
        scope.isDisabled = true;
      }

      scope.isInactive = angular.isDefined(iAttrs.inactive);

      scope.tabsCtrl = tabsCtrl;
      scope.tabElement = iElement;

      tabsCtrl.addTab(scope);

      function focus () {
        iElement[0].focus();
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

      iElement[0].onfocus = function () {
        scope.$apply(function () {
          scope.isFocused = true;
        });
      };

      iElement[0].onblur = function () {
        scope.$apply(function () {
          scope.isFocused = false;
        });
      };

      iElement.on('click', function () {
        if (scope.isDisabled || scope.isInactive) { return false; }

        scope.$apply(function () {
          tabsCtrl.activate(scope);
        });
      });

      iElement.on('keydown', function (event) {
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
      });

      scope.focus = focus;

      scope.$evalAsync(function () {
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
      });

      scope.$watch('isActive', function (newValue, oldValue) {
        if (newValue === oldValue) { return false; }
        if (newValue) { activate(); }
        else { deactivate(); }
      });
    }
  };
}
vTabDirective.$inject = ['$animate', 'tabsConfig'];


// vTab directive controller
function TabDirectiveController ($scope) {
  var ctrl = this;

  ctrl.isActive = function isActive () {
    return $scope.isActive;
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
