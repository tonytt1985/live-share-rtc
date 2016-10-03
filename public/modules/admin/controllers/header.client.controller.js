'use strict';

angular.module('admin').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$http', '$window',
	function($scope, Authentication, Menus, $http, $window) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
        $scope.signout = function(){
            $window.location.href ='/auth/signout';
        };
	}
]);