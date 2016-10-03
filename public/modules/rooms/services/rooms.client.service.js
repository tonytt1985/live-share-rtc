/**
 * Created by TUNGTRAN on 8/31/2015.
 */
'use strict;'
angular.module('rooms').factory('Rooms', ['$resource',
    function($resource) {
        return $resource('rooms/:roomId', {
            roomId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);