/**
 * Created by TUNGTRAN on 8/26/2015.
 */

angular.module('categories').controller('AdminCategoriesController',['$scope', '$stateParams', '$location', 'Authentication', 'Categories',
    function($scope, $stateParams, $location, Authentication, Categories){
        $scope.authentication = Authentication;
        $scope.create = function(){
            var category = new Categories({
                name: this.catName,
                description: this.catDescription
            });
            category.$save(function(response){
                $location.path('admin/categories/'+ response._id);
                $scope.catName = "";
                $scope.catDescription = "";
            },function(errResponse){
                $scope.error = errResponse.data.message;
            });
        };
        $scope.update = function(){
            var category = $scope.category;
            category.$update(function(response){
                $location.path('/admin/categories/'+ response._id);
            }, function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.remove = function(category){
            if(category){
                category.$remove();
                for(var i in $scope.categories){
                    if($scope.categories[i] === category)
                        $scope.categories.splice(i, 1);
                }
            }else{
                $scope.category.$remove(function(){
                    $location.path('/admin/categories');
                });
            }
        };
        $scope.findOne = function(){
            $scope.category = Categories.get({
                categoryId : $stateParams.categoryId
            });
        };
        $scope.find = function(){
            $scope.categories = Categories.query();
        };
    }]);