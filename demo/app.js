(function (angular) {
  'use strict';

  angular
    .module('myApp', [ 'ngAnimate', 'ngTouch', 'ngSanitize', 'vTabs' ])

    .config(function ($compileProvider) {
      $compileProvider.debugInfoEnabled(false);
    })

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
          content: '<img src="http://lorempixel.com/1000/500/nature/3" alt=""><blockquote>"Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem." <br>— Aliquam Libero</blockquote><ol><li>Lorem ipsum dolor sit amet</li><li>Nullam dignissim convallis est</li><li>Praesent mattis</li></ol><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p>'
        },
        {
          title: 'Tab 2',
          content: '<img src="http://lorempixel.com/1000/500/nature/1" alt=""><blockquote>"Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem." <br>— Aliquam Libero</blockquote><ol><li>Lorem ipsum dolor sit amet</li><li>Nullam dignissim convallis est</li><li>Praesent mattis</li></ol><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p>'
        },
        {
          title: 'Tab 3',
          content: '<img src="http://lorempixel.com/1000/500/nature/4" alt=""><blockquote>"Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem." <br>— Aliquam Libero</blockquote><ol><li>Lorem ipsum dolor sit amet</li><li>Nullam dignissim convallis est</li><li>Praesent mattis</li></ol><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p>'
        }
      ];
    });

})(angular);
