

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

