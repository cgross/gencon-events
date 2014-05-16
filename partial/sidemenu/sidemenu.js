angular.module('genconEvents').controller('SidemenuCtrl',function($scope,$state,events,
	$ionicSideMenuDelegate,$rootScope){

    $scope.times = {
        all:true,
        wedMorn:true,
        wedAfter:true,
        thursMorn:true,
        thursAfter:true,
        friMorn:true,
        friAfter:true,
        satMorn:true,
        satAfter:true,
        sunMorn:true,
        sunAfter:true
    };

    $scope.search = {text:''};

    $scope.allTimes = function(){
        var value = !$scope.times.all;
        _.chain($scope.times).keys().each(function(key){
            $scope.times[key] = value;
        });
    };

    $scope.applyFilter = function(){

		var filter = {};
		filter.text = $scope.search.text;
		filter.times = $scope.times;

		events.applyFilter(filter);

        $ionicSideMenuDelegate.toggleLeft();
        $state.go('app.home');
        $rootScope.$broadcast('refresh');
    };

    $scope.clearFilter = function(){
        $scope.search.text = '';
        _.each($scope.times,function(value,key){
            $scope.times[key] = true;
        });
    };


});