/**
 * Created by TUNGTRAN on 7/12/2015.
 */
'use strict';
angular.module('categories').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        // Admin state routing
        $stateProvider.
            state('admin.categories',{
                url: '/categories',
                templateUrl: 'modules/categories/views/list-categories.client.view.html'
            })
            .state('admin.createCategories',{
                url: '/categories/create',
                templateUrl: 'modules/categories/views/create-category.client.view.html'
            })
            .state('admin.viewCategory',{
                url: '/categories/:categoryId',
                templateUrl: 'modules/categories/views/view-category.client.view.html'
            })
            .state('admin.editCategory',{
                url: '/categories/:categoryId/edit',
                templateUrl: 'modules/categories/views/edit-category.client.view.html'
            });
    }
]);