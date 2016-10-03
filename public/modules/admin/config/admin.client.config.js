/**
 * Created by TUNGTRAN on 7/10/2015.
 */

'use strict';
angular.module('admin').run(['Menus',function(Menus){
    Menus.addMenu('rightMenu', false, ['admin']);
    Menus.addMenuItem('rightMenu', 'Users', 'admin/users', '', '',false,['admin']);
    Menus.addMenuItem('rightMenu', 'Categories', 'categories', 'dropdown', '/admin/categories(/create)?',false,['admin']);
    Menus.addSubMenuItem('rightMenu', 'categories', 'List Categories', 'admin/categories');
    Menus.addSubMenuItem('rightMenu', 'categories', 'New Categories', 'admin/categories/create');
    Menus.addMenuItem('rightMenu', 'Rooms', 'rooms', 'dropdown', '/admin/rooms(/create)?',false,['admin']);
    Menus.addSubMenuItem('rightMenu', 'rooms', 'List Rooms', 'admin/rooms');
    Menus.addSubMenuItem('rightMenu', 'rooms', 'New Rooms', 'admin/rooms/create');
}]);