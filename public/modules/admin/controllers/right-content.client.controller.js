/**
 * Created by TUNGTRAN on 7/13/2015.
 */
'use strict';
angular.module('admin').controller('RightContentController', ['$scope', 'Authentication', 'Menus', function($scope, Authentication, Menus){
    $scope.authentication = Authentication;
    $scope.menu = Menus.getMenu('rightMenu');
    console.log($scope.menu);
}]);