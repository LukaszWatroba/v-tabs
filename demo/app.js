(function (angular) {
  'use strict';

  angular
    .module('myApp', [ 'ngAnimate', 'ngTouch', 'ngSanitize', 'vTabs' ])

    .controller('MainController', function ($scope) {

      $scope.simpleTabs = {
        active: 0
      };

      $scope.simplePages = {
        active: 0
      };

      $scope.verticalTabs = {
        active: 0
      };

      $scope.horizontalTabs = {
        active: 0
      };

      $scope.pages = [
        {
          id: 1,
          title: 'Tab 1',
          content: '<h4>Page 1</h4><p>Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies.</p>'
        },
        {
          id: 2,
          title: 'Tab 2',
          content: '<h4>Page 2</h4><p>Curabitur et ligula. Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac, laoreet enim. Phasellus fermentum in, dolor.</p>'
        },
        {
          id: 3,
          title: 'Tab 3',
          content: '<h4>Page 3</h4><p>Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis velit, rhoncus eu, luctus et interdum adipiscing wisi.</p>'
        }
      ];
    });

})(angular);
