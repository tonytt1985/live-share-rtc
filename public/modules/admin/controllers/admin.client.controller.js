/**
 * Created by TUNGTRAN on 7/13/2015.
 */
'use strict';
angular.module('admin').controller('AdminController', ['$scope', '$http', '$location', 'Authentication', '$state', function($scope, $http, $location, Authentication, $state){
    $scope.user = Authentication.user;
    if (!$scope.user)
        $location.path('/');
    else if($scope.user.roles.indexOf('admin'))
        $location.path('/');
    if($location.path() === '/admin')
        $state.transitionTo('admin.home');
}]);
