

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

