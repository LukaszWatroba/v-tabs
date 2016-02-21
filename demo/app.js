(function (angular) {
  'use strict';

  angular
    .module('myApp', [ 'ngAnimate', 'ngTouch', 'ngSanitize', 'vTabs' ])

    .controller('MainController', function ($scope) {
      $scope.verticalTabs = {
        active: 0
      };

      $scope.horizontalTabs = {
        active: 0
      };

      $scope.pages = [
        {
          title: 'Tab 1',
          content: '<h4>Tab 1</h4><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p><ol><li>Lorem ipsum dolor sit amet</li><li>Nullam dignissim convallis est</li><li>Praesent mattis</li></ol>'
        },
        {
          title: 'Tab 2',
          content: '<h4>Tab 2</h4><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p><ol><li>Lorem ipsum dolor sit amet</li><li>Nullam dignissim convallis est</li><li>Praesent mattis</li></ol>'
        },
        {
          title: 'Tab 3 (disabled)',
          content: '<h4>Tab 3</h4><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p><ol><li>Lorem ipsum dolor sit amet</li><li>Nullam dignissim convallis est</li><li>Praesent mattis</li></ol>',
          isDisabled: true
        }
      ];
    });

})(angular);
