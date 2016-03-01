

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
