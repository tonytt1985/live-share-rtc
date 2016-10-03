/**
 * Created by TUNGTRAN on 8/31/2015.
 */
angular.module('rooms').controller('AdminRoomsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Categories', 'Rooms',
    function($scope, $stateParams, $location, Authentication, Categories, Rooms){
        $scope.createInit = function(){
            $scope.categories = Categories.query(function(cats){
                $scope.selectedOption = cats[0];
            });
        };
        $scope.create = function(){
            var room = new Rooms({
                name: this.name,
                description: this.description,
                category: this.selectedOption._id
            });
            room.$save(function(response){
                $location.path('admin/rooms/' + response._id);
            },function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.update = function(){
            var room = $scope.room;
            room.category = this.selectedOption._id;
            room.$update(function(response){
                $location.path('admin/rooms/' + response._id);
            },function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.find = function(){
            $scope.rooms = Rooms.query();

        };
        $scope.findOne = function(){
            $scope.room = Rooms.get({roomId: $stateParams.roomId}, function(room){
                $scope.categories = Categories.query(function(cats){
                    $scope.selectedOption = room.category;
                });
            });
        };
        $scope.getCategory = function(id){
            return Categories.get({
                categoryId : id
            });
        };
}]);