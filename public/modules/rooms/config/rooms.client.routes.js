/**
 * Created by TUNGTRAN on 7/12/2015.
 */
'use strict';
angular.module('rooms').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        // Admin state routing
        $stateProvider.
            state('admin.rooms',{
                url: '/rooms',
                templateUrl: 'modules/rooms/views/list-rooms.client.view.html'
            })
            .state('admin.createRooms',{
                url: '/rooms/create',
                templateUrl: 'modules/rooms/views/create-room.client.view.html'
            })
            .state('admin.viewRoom',{
                url: '/rooms/:roomId',
                templateUrl: 'modules/rooms/views/view-room.client.view.html'
            })
            .state('admin.editRoom',{
                url: '/rooms/:roomId/edit',
                templateUrl: 'modules/rooms/views/edit-room.client.view.html'
            }).
            state('room', {
                url: '/room/:roomId',
                templateUrl: 'modules/rooms/views/home.room.client.view.html'
            });
    }
]);