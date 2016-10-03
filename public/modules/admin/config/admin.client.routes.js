/**
 * Created by TUNGTRAN on 7/12/2015.
 */
'use strict';
angular.module('admin').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/admin/home');
        // Admin state routing
        $stateProvider.
            state('admin', {
                url: '/admin',
                templateUrl: 'modules/admin/views/admin.client.view.html'
            })
            .state('admin.home',{
                templateUrl: 'modules/admin/views/admin.home.client.view.html'
            })
            .state('admin.users',{
                url: '/users',
                templateUrl: 'modules/admin/views/admin.users.client.view.html'
            });
    }
]);